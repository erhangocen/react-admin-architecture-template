import { Card } from '@/components/ui/card';
import Logo from '@/components/ui/logo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ForgotFormWithEmail } from './components/forgot-form-with-email';
import { ForgotFormWithPhoneNumber } from './components/forgot-form-with-phone-number';
import { useForm, UseFormReturn } from 'react-hook-form';
import {
  PassresetRequestModel,
  usePassresetSchema,
} from '@/data/models/request-models/passreset/passreset-request-model';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { ForgotFormWithUserName } from './components/forgot-form-with-username';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { post } from '@/network';
import { errorToast3 } from '@/components/custom/error-toast';

export type ForgotPasswordFormProps = {
  onSubmit: (data: PassresetRequestModel) => void;
  isLoading: boolean;
  form: UseFormReturn<PassresetRequestModel>;
};

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);

  const passresetSchema = usePassresetSchema();
  const navigate = useNavigate();

  const form = useForm<PassresetRequestModel>({
    resolver: zodResolver(passresetSchema),
  });

  useEffect(() => {
    form.reset({
      username: '',
      phone: '',
      email: '',
    });
  }, [form]);

  const passResetFnc = async (data: PassresetRequestModel) => {
    const response = await post('5170.app.github.dev/password/reset', data);
    return response;
  };

  const { mutateAsync: passReset, isPending } = useMutation({
    mutationFn: passResetFnc,
    onError: errorToast3,
    onSuccess: () => {
      navigate('/sign-in');
    },
  });

  async function onSubmit(data: PassresetRequestModel) {
    await passReset(data);
  }

  return (
    <>
      <div className='container grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8'>
          <div className='mb-4 flex items-center justify-center'>
            <Logo />
          </div>
          <Card className='p-6'>
            <div className='mb-2 flex flex-col space-y-2 text-left'>
              <h1 className='text-md font-semibold tracking-tight'>
                Forgot Password
              </h1>
              <p className='text-sm text-muted-foreground'>
                Enter your registered email and we will send you a link to reset
                your password. You remember your password?{' '}
                <Link
                  to='/sign-in'
                  className='underline underline-offset-4 hover:text-primary'
                >
                  Sign In
                </Link>
              </p>
            </div>
            <Tabs defaultValue='email' onValueChange={(e) => console.log(e)}>
              <TabsList className='grid w-full grid-cols-3'>
                <TabsTrigger value='email'>Email</TabsTrigger>
                <TabsTrigger value='phoneNumber'>Phone No.</TabsTrigger>
                <TabsTrigger value='userName'>Kullanıcı Adı</TabsTrigger>
              </TabsList>
              <TabsContent value='email'>
                <ForgotFormWithEmail
                  formProps={{ form: form, isLoading, onSubmit }}
                />
              </TabsContent>
              <TabsContent value='phoneNumber'>
                <ForgotFormWithPhoneNumber
                  formProps={{ form: form, isLoading, onSubmit }}
                />
              </TabsContent>
              <TabsContent value='userName'>
                <ForgotFormWithUserName
                  formProps={{ form: form, isLoading, onSubmit }}
                />
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </>
  );
}
