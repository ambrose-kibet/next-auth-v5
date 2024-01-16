import CardWrapper from '@/components/auth/CardWrapper';
import LoginForm from '@/components/auth/LoginForm';

function LoginPage() {
  return (
    <CardWrapper
      backButtonLabel="Don't have an account?"
      showSocials
      backButtonLink="/auth/register"
      headerLabel="welcome back"
    >
      <LoginForm />
    </CardWrapper>
  );
}
export default LoginPage;
