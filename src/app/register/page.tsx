import { AuthLayout } from "@/components/auth/AuthLayout";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { UnauthGuard } from "@/components/auth/UnauthGuard";

export default function RegisterPage() {
  return (
    <UnauthGuard>
      <AuthLayout
        title="Create an Account"
        subtitle="Join VaultLock today"
      >
        <RegisterForm />
      </AuthLayout>
    </UnauthGuard>
  );
}
