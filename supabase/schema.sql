-- ==============================================================================
-- SUBLILOVE DATABASE SCHEMA & SECURITY POLICIES (Supabase / PostgreSQL)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. Table: Users (Profiles synced with auth.users)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."Users" (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) DEFAULT '',
  mail VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(20) NOT NULL DEFAULT 'cliente' CHECK (role IN ('admin', 'cliente', 'user')),
  creation_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  update_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_users_mail ON public."Users"(mail);
CREATE INDEX IF NOT EXISTS idx_users_role ON public."Users"(role);
CREATE INDEX IF NOT EXISTS idx_users_deleted ON public."Users"(deleted);

-- ------------------------------------------------------------------------------
-- 2. Table: Products (Catalog items)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."Products" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('sublimacion', 'papeleria')),
  description TEXT DEFAULT '',
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  base_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  discount_price NUMERIC(10, 2) DEFAULT 0,
  materials TEXT DEFAULT '',
  sizes TEXT[] DEFAULT ARRAY['Estándar'],
  print_area VARCHAR(255) DEFAULT '',
  icon VARCHAR(50) DEFAULT '☕',
  image TEXT DEFAULT '/img/logo.png',
  featured BOOLEAN DEFAULT FALSE,
  badge VARCHAR(50) DEFAULT NULL,
  creation_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  update_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- Indices for catalog queries
CREATE INDEX IF NOT EXISTS idx_products_category ON public."Products"(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public."Products"(featured);
CREATE INDEX IF NOT EXISTS idx_products_deleted ON public."Products"(deleted);

-- ------------------------------------------------------------------------------
-- 3. Table: Settings (Global store settings)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public."Settings" (
  id INT PRIMARY KEY DEFAULT 1,
  business_name VARCHAR(100) NOT NULL DEFAULT 'Sublilove',
  whatsapp_phone VARCHAR(50) NOT NULL DEFAULT '584243695379',
  instagram_url VARCHAR(255) DEFAULT 'https://www.instagram.com/subli_lover',
  facebook_url VARCHAR(255) DEFAULT 'https://www.facebook.com/share/1D4XtomhZa/',
  contact_email VARCHAR(255) DEFAULT 'info@subliypapeleria.com',
  exchange_rate_usd_ves NUMERIC(10, 2) DEFAULT 60.50,
  update_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT single_row_settings CHECK (id = 1)
);

-- Insert initial settings row if not exists
INSERT INTO public."Settings" (id, business_name, whatsapp_phone, instagram_url, facebook_url, contact_email, exchange_rate_usd_ves)
VALUES (1, 'Sublilove', '584243695379', 'https://www.instagram.com/subli_lover', 'https://www.facebook.com/share/1D4XtomhZa/', 'info@subliypapeleria.com', 60.50)
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 4. Row Level Security (RLS) Policies
-- ------------------------------------------------------------------------------
ALTER TABLE public."Users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Products" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Settings" ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public."Users"
    WHERE id = auth.uid() AND role = 'admin' AND deleted = FALSE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Users Table Policies:
-- 1. Anyone logged in can read their own profile. Admins can read all active profiles.
CREATE POLICY "Users view own or admin view all"
  ON public."Users" FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

-- 2. Users can insert their own profile on register
CREATE POLICY "Users can insert own profile"
  ON public."Users" FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 3. Users can update their own profile (cannot change role to admin unless already admin)
CREATE POLICY "Users update own profile or admin update all"
  ON public."Users" FOR UPDATE
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (
    (auth.uid() = id AND role = (SELECT role FROM public."Users" WHERE id = auth.uid()))
    OR public.is_admin()
  );

-- 4. Only admins can delete profiles
CREATE POLICY "Only admins can delete users"
  ON public."Users" FOR DELETE
  USING (public.is_admin());

-- Products Table Policies:
-- 1. Anyone (public visitors + authenticated) can view non-deleted products
CREATE POLICY "Public read products"
  ON public."Products" FOR SELECT
  USING (deleted = FALSE OR public.is_admin());

-- 2. Only admins can create, update, or delete products
CREATE POLICY "Admins manage products"
  ON public."Products" FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Settings Table Policies:
-- 1. Anyone can read store settings
CREATE POLICY "Public read settings"
  ON public."Settings" FOR SELECT
  USING (TRUE);

-- 2. Only admins can modify store settings
CREATE POLICY "Admins update settings"
  ON public."Settings" FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 5. PostgreSQL Triggers (Cascade User Lifecycle)
-- ------------------------------------------------------------------------------

-- Trigger 1: Auto-create profile in public."Users" when auth.users signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public."Users" (id, name, last_name, mail, role, creation_date, update_date, deleted)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NEW.email,
    'cliente',
    NOW(),
    NOW(),
    FALSE
  )
  ON CONFLICT (id) DO UPDATE
  SET
    name = EXCLUDED.name,
    last_name = EXCLUDED.last_name,
    mail = EXCLUDED.mail,
    update_date = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger 2: Deleting from public."Users" cascades to delete in auth.users
CREATE OR REPLACE FUNCTION public.handle_delete_user()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM auth.users WHERE id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_delete_user ON public."Users";
CREATE TRIGGER trigger_delete_user
  AFTER DELETE ON public."Users"
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_delete_user();

-- Trigger 3: Deleting from auth.users cascades to delete in public."Users"
CREATE OR REPLACE FUNCTION public.handle_auth_user_deleted()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM public."Users" WHERE id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_auth_user_deleted ON auth.users;
CREATE TRIGGER trigger_auth_user_deleted
  AFTER DELETE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_auth_user_deleted();
