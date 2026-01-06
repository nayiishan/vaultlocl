import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { UnauthGuard } from "@/components/auth/UnauthGuard";

export default function LoginPage() {
  return (
    <UnauthGuard>
      <AuthLayout
        title="VaultLock"
        subtitle="Securely login to your account"
      >
        <LoginForm />
      </AuthLayout>
    </UnauthGuard>
  );
}
