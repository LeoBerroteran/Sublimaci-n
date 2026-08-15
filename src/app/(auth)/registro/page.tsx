import AuthLayout from '@/components/templates/AuthLayout/AuthLayout';
import RegisterForm from '@/components/organisms/RegisterForm/RegisterForm';

export default function RegisterPage() {
  return (
    <AuthLayout title="Crear Cuenta" subtitle="Únete a Sublilove y personaliza tus productos">
      <RegisterForm />
    </AuthLayout>
  );
}
