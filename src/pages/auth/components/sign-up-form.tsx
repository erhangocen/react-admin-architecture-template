import { HTMLAttributes, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconBrandFacebook, IconBrandGithub } from '@tabler/icons-react';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/custom/button';
import { PasswordInput } from '@/components/custom/password-input';
import { cn } from '@/lib/utils';
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';
import { get, post } from '@/network';
import ErrorExample from '@/pages/settings/error-example';
import { Progress } from '@/components/ui/progress';
import { errorToast2, errorToast3 } from '@/components/custom/error-toast';
import {
  RegisterRequestModel,
  useRegisterSchema,
} from '@/data/models/request-models/register/register-request-model';
import { CommonColors } from '@/data/common-colors';
import { RegisterResponseModel } from '@/data/models/response-models/register/register-response-model';

interface SignUpFormProps extends HTMLAttributes<HTMLDivElement> {
  credential: {
    email: string;
    token: string;
  };
}

export function SignUpForm({
  className,
  credential,
  ...props
}: SignUpFormProps) {
  const navigate = useNavigate();
  const registerSchema = useRegisterSchema();

  const form = useForm<RegisterRequestModel>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    form.reset({
      email: credential.email,
      token: credential.token,
      confirmPassword: '',
      password: '',
      userName: '',
    });
  }, [credential]);

  const registerFnc = async (data: RegisterRequestModel) => {
    const response: RegisterResponseModel = await post(
      '5496.app.github.dev/confirm',
      data
    );
    return response;
  };

  const { mutateAsync: signUp, isPending } = useMutation({
    mutationFn: registerFnc,
    onError: errorToast3,
    onSuccess: (data) => {
      toast({
        variant: 'success',
        title: 'Tebrikler',
        description:
          'Başarılı bir şekilde kayıt işlemi tamamlandı. Kullanıcı adı ve şifreniz ile giriş yapabilirsiniz.',
        duration: 5000,
      });
      navigate('/');
    },
  });

  async function onSubmit(data: RegisterRequestModel) {
    const response = await signUp(data);
    return response;
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input disabled placeholder='name@example.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='userName'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Kulanıcı Adı</FormLabel>
                  <FormControl>
                    <Input placeholder='Kullanıcı Adı Giriniz' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2' loading={isPending}>
              Create Account
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
