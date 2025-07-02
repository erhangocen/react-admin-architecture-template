import Logo from '@/components/ui/logo';
import { UserAuthForm } from './components/user-auth-form';
import W3 from '@/assets/w3.svg';
import {
  MouseParallaxContainer,
  MouseParallaxChild,
} from 'react-parallax-mouse';
import { Link } from 'react-router-dom';

export default function SignIn() {
  return (
    <>
      <MouseParallaxContainer globalFactorX={0.15} globalFactorY={0.15}>
        <div className='container relative grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
          <div className='relative flex hidden h-full flex-col justify-between bg-muted p-10 text-white dark:border-r lg:flex'>
            <div className='absolute inset-0 bg-zinc-900' />
            <div className='z-10'>
              <Logo light={false} size={{ height: 40, width: 200 }} />
            </div>
            <MouseParallaxChild
              factorX={0.15}
              factorY={0.2}
              className='pt-12'
              inverted
            >
              <img
                src={W3}
                className='relative m-auto'
                width={450}
                height={90}
                alt='Vite'
              />
            </MouseParallaxChild>

            <div className='relative z-20'>
              <blockquote className='space-y-2'>
                <p className='text-lg'>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.{' '}
                  <br />{' '}
                  <div className='flex flex-row items-center gap-2'>
                    <div>
                      Voluptatum libero minima totam consequatur est quo
                      repellat beatae magni, quis odio laboriosam sapiente,
                      dolorum optio vitae saepe tenetur vero!
                    </div>
                  </div>
                </p>
              </blockquote>
            </div>
          </div>
          <div className='lg:p-8'>
            <div className='mx-auto flex w-full flex-col justify-center space-y-3 sm:w-[350px]'>
              <div className='flex flex-col space-y-2 text-left'>
                <h1 className='text-2xl font-semibold tracking-tight'>Login</h1>
                <p className='text-sm text-muted-foreground'>
                  Log into your account with email and password
                </p>
              </div>
              <UserAuthForm />
              <p className='px-8 text-center text-sm text-muted-foreground'>
                By clicking login, you agree to our{' '}
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
            </div>
          </div>
        </div>
      </MouseParallaxContainer>
    </>
  );
}
