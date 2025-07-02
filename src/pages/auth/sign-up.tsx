import { Card } from '@/components/ui/card';
import { SignUpForm } from './components/sign-up-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Logo from '@/components/ui/logo';
import { get, post } from '@/network';
import { useMutation, useQuery } from '@tanstack/react-query';
import GeneralError from '../errors/general-error';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import SignUpLoader from './components/sign-up-loader';
import { toast } from '@/components/ui/use-toast';
import { ValidateInvitationResponse } from '@/data/models/response-models/invitation/validate-invitation-response';

export default function SignUp() {
  const [queryParameters] = useSearchParams();
  const email = queryParameters.get('email');
  const token = queryParameters.get('token')?.replace(/\s/g, '+');
  const rid = queryParameters.get('rid');

  const checkEmailIsValid = async (rid: string) => {
    const response: ValidateInvitationResponse = await get(
      `2360.app.github.dev/validate/${rid}`
      // {
      //   params: { referenceId: rid },
      // }
    );
    return response;
  };

  const validateInvitation = useQuery({
    queryFn: async () => await checkEmailIsValid(rid!),
    queryKey: ['validateInvitation', rid],
    retry: false,
    enabled: !!rid,
  });

  if (!email || !token || !rid) {
    return <GeneralError />;
  }

  if (
    !validateInvitation.isLoading &&
    (validateInvitation.isError || validateInvitation.data?.isValid !== true)
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
            {validateInvitation.isLoading ? (
              <SignUpLoader />
            ) : (
              <>
                <div className='mb-2 flex flex-col space-y-3 text-left'>
                  <h1 className='text-lg font-semibold tracking-tight'>
                    Create an account
                  </h1>
                  <p className='text-sm text-muted-foreground'>
                    Enter your email and password to create an account. <br />
                    Already have an account?{' '}
                    <Link
                      to='/sign-in'
                      className='underline underline-offset-4 hover:text-primary'
                    >
                      Sign In
                    </Link>
                  </p>
                </div>
                <SignUpForm
                  credential={{
                    email,
                    token,
                  }}
                />
                <p className='mt-4 px-8 text-center text-sm text-muted-foreground'>
                  By creating an account, you agree to our{' '}
                  <a
                    href='/terms'
                    className='underline underline-offset-4 hover:text-primary'
                  >
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a
                    href='/privacy'
                    className='underline underline-offset-4 hover:text-primary'
                  >
                    Privacy Policy
                  </a>
                  .
                </p>
              </>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
