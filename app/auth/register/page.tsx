import CardWrapper from '@/components/auth/CardWrapper';
import RegistrationForm from '@/components/auth/RegistrationForm';

const RegisterPage = () => {
  return (
    <CardWrapper
      backButtonLabel="Already have an account?"
      showSocials
      backButtonLink="/auth/login"
      headerLabel="welcome"
    >
      <RegistrationForm />
    </CardWrapper>
  );
};
export default RegisterPage;
