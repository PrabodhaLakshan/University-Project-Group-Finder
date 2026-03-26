import IntroGate from "@/components/IntroGate";
import AuthPage from "@/components/AuthPage";

export default function LoginPage() {
  return (
    <IntroGate>
      <AuthPage initial="login" />
    </IntroGate>
  );
}
