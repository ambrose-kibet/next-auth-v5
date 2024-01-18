import { Card, CardFooter, CardHeader } from '../ui/card';
import BackButton from './BackButton';
import Header from './header';

const ErrorCard = () => {
  return (
    <Card className=" w-full max-w-[400px]">
      <CardHeader>
        <Header label="Oops! Something Went Wrong!" />
      </CardHeader>
      <CardFooter>
        <BackButton
          backButtonHref="/auth/login"
          backButtonLabel="Back to login"
        />
      </CardFooter>
    </Card>
  );
};
export default ErrorCard;
