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
import {
  PassresetConfirmRequestModel,
  usePassresetConfirmSchema,
} from '@/data/models/request-models/passreset/passreset-confirm-request-model';

interface PasswordResetFormProps extends HTMLAttributes<HTMLDivElement> {
  credential: {
    email?: string;
    phone?: string;
    username?: string;
    token: string;
  };
}

export function PasswordResetForm({
  className,
  credential,
  ...props
}: PasswordResetFormProps) {
  const navigate = useNavigate();
  const passresetConfirmSchema = usePassresetConfirmSchema();

  const form = useForm<PassresetConfirmRequestModel>({
    resolver: zodResolver(passresetConfirmSchema),
  });

  useEffect(() => {
    form.reset({
      email: credential.email,
      token: credential.token,
      confirmPassword: '',
      username: '',
      newPassword: '',
      phone: '',
    });
  }, [credential]);

  const registerFnc = async (data: PassresetConfirmRequestModel) => {
    const response: RegisterResponseModel = await post(
      '5170.app.github.dev/register/confirm',
      data
    );
    return response;
  };

  const { mutateAsync: passwordReset, isPending } = useMutation({
    mutationFn: registerFnc,
    onError: errorToast3,
  });

  async function onSubmit(data: PassresetConfirmRequestModel) {
    const response = await passwordReset(data);
    if (response.succeeded === true) {
      toast({
        variant: 'default',
        color: CommonColors.Success,
        title: 'Tebrikler',
        description: 'Başarılı bir şekilde kayıt işlemi tamamlandı.',
      });
      navigate('/');
    }
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            <FormItem className='space-y-1'>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  disabled
                  placeholder=''
                  value={
                    form.watch('username') ??
                    form.watch('email') ??
                    form.watch('phone')
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormField
              control={form.control}
              name='newPassword'
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
