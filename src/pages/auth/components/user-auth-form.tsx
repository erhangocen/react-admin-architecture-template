import { HTMLAttributes, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { IconBrandFacebook, IconBrandGithub } from '@tabler/icons-react';
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
import { useAuth } from '@/hooks/use-auth';
import {
  SignInRequestModel,
  useSignInSchema,
} from '@/data/models/request-models/sign-in/sign-in-request-model';
import { toast } from '@/components/ui/use-toast';
import { CommonColors } from '@/data/common-colors';
import { useMutation } from '@tanstack/react-query';
import { errorToast3 } from '@/components/custom/error-toast';
import { post } from '@/network';
import { SignInResponseModel } from '@/data/models/response-models/sign-in/sign-in-response-model';

interface UserAuthFormProps extends HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const { login } = useAuth();
  const signInSchema = useSignInSchema();

  const form = useForm<SignInRequestModel>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      userName: '',
      password: '',
    },
  });

  const registerFnc = async (data: SignInRequestModel) => {
    const response: SignInResponseModel = await post(
      '5170.app.github.dev/signin',
      data
    );
    return response;
  };

  const { mutateAsync: signUp, isPending } = useMutation({
    mutationFn: registerFnc,
    onError: errorToast3,
    onSuccess: (response) => {
      if (response.token != undefined || response.token != null) {
        toast({
          variant: 'default',
          title: 'Başarılı Bir Şekilde Giriş Yapıldı.',
          description: 'Yönetim Paneline Yönlendiriliyorsunuz...',
        });
        login(response.token);
      } else {
        toast({
          variant: 'destructive',
          title: 'Giriş Yapılamadı.',
          description: 'Kullanıcı Adı veya Şifrenizi Kontrol Ediniz.',
        });
      }
    },
  });

  async function onSubmit(data: SignInRequestModel) {
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
              name='userName'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>User Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter your user name' {...field} />
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
                  <div className='flex items-center justify-between'>
                    <FormLabel>Password</FormLabel>
                    <Link
                      to='/forgot-password'
                      className='text-sm font-medium text-muted-foreground hover:opacity-75'
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2' loading={isPending}>
              Login
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
