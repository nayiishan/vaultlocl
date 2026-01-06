import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout
      title="VaultLock"
      subtitle="Securely login to your account"
    >
      <LoginForm />
    </AuthLayout>
  );
}
