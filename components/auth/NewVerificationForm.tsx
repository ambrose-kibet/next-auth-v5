'use client';

import { verifyEmail } from '@/actions/verify-email';
import CardWrapper from '@/components/auth/CardWrapper';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Form } from 'react-hook-form';
import PropagateLoader from 'react-spinners/PropagateLoader';
import FormError from '../form-error';
import FormSuccess from '../form-success';

const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const searchParams = useSearchParams();

  const token = searchParams.get('token');
  const handleSubmit = useCallback(async () => {
    if (success || error) return;
    setError(undefined);
    setSuccess(undefined);
    if (!token) {
      setError('Missing token!');
      return;
    }
    verifyEmail(token)
      .then((data) => {
        if (data.error) {
          setError(data.error);
          return;
        }
        setSuccess(data.success);
      })
      .catch((err) => {
        setError('Something went wrong!');
      });
  }, [token, success, error]);
  useEffect(() => {
    handleSubmit();
  }, [handleSubmit]);
  return (
    <CardWrapper
      headerLabel="Verify your email address"
      backButtonLabel="Back to login"
      backButtonLink="/auth/login"
    >
      <div className="flex items-center justify-center w-full">
        {!success && !error && (
          <PropagateLoader color="hsla(262.1 83.3% 57.8%)" />
        )}
        <FormError message={error} />
        <FormSuccess message={success} />
      </div>
    </CardWrapper>
  );
};
export default NewVerificationForm;
