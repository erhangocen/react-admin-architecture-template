import { Card } from '@/components/ui/card';
import { SignUpForm } from './components/sign-up-form';
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';
import Logo from '@/components/ui/logo';
import { get, post } from '@/network';
import { useMutation, useQuery } from '@tanstack/react-query';
import GeneralError from '../errors/general-error';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import SignUpLoader from './components/sign-up-loader';
import { toast } from '@/components/ui/use-toast';
import { PasswordResetForm } from './components/password-reset-form';

export default function PassresetConfirm() {
  const stringConvert = (x: string | null) => {
    if (x === null || x === '') {
      return undefined;
    }
    return x;
  };

  const [queryParameters] = useSearchParams();
  const email = stringConvert(queryParameters.get('email'));
  const username = stringConvert(queryParameters.get('username'));
  const phone = stringConvert(queryParameters.get('phone'));
  const token = queryParameters.get('resetToken')?.replace(/\s/g, '+');

  if (!email || !token) {
    return <GeneralError />;
  }

  const checkValidToken = async (
    token: string,
    email?: string,
    phone?: string,
    username?: string
  ) => {
    const response = await post(`2360.app.github.dev/validate/`, {
      token,
      email,
      phone,
      username,
    });
    return response;
  };

  const validateToken = useQuery({
    queryFn: async () => await checkValidToken(email, token),
    queryKey: ['validateToken', email, token],
    retry: false,
  });

  if (
    !validateToken.isLoading &&
    validateToken.isError
    //   || validateToken.data?.isValid !== true
  ) {
    return <GeneralError />;
  }

  return (
    <>
      <div className='container grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8'>
          <div className='mb-4 flex items-center justify-center'>
            <Logo />
          </div>
          <Card className='p-6'>
            {validateToken.isLoading ? (
              <SignUpLoader />
            ) : (
              <>
                <div className='mb-2 flex flex-col space-y-3 text-left'>
                  <h1 className='text-lg font-semibold tracking-tight'>
                    Reset Password
                  </h1>
                  <p className='text-sm text-muted-foreground'>
                    Enter your email and password to create an account. You
                    remember your password?{' '}
                    <Link
                      to='/sign-in'
                      className='underline underline-offset-4 hover:text-primary'
                    >
                      Sign In
                    </Link>
                  </p>
                </div>
                <PasswordResetForm
                  credential={{
                    email,
                    token,
                    username,
                    phone,
                  }}
                />
              </>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
