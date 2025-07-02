import { HTMLAttributes, useState } from 'react';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/custom/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ForgotPasswordFormProps } from '../forgot-password';

interface ForgotFormWithUserNameProps extends HTMLAttributes<HTMLDivElement> {
  formProps: ForgotPasswordFormProps;
}

export function ForgotFormWithUserName({
  className,
  formProps: { form, isLoading, onSubmit },
  ...props
}: ForgotFormWithUserNameProps) {
  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormControl>
                    <Input
                      placeholder='username'
                      {...field}
                      onChange={(e) => {
                        form.reset({
                          username: e.target.value,
                          phone: '',
                          email: '',
                        });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2' loading={isLoading}>
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
