import AuthLayout from '@/components/templates/AuthLayout/AuthLayout';
import LoginForm from '@/components/organisms/LoginForm/LoginForm';

export default function LoginPage() {
  return (
    <AuthLayout title="Iniciar Sesión" subtitle="Accede a tu cuenta de Sublilove">
      <LoginForm />
    </AuthLayout>
  );
}
