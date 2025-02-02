import LoginForm from '@/components/common/Form/LoginForm';
import { ModeToggle } from '@/components/common/ThemeToggle';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Login = () => {
  return (
    <main className="grid grid-cols-7 ">
      <div className="fixed z-10 top-10 left-20 ">
        <ModeToggle className="bg-stone-200/30 dark:bg-stone-900/30 backdrop-filter backdrop-blur-sm shadow-lg" />
      </div>
      <section className="hidden md:block md:col-span-2 ">
        <div className="h-full w-full  overflow-hidden">
          <Image
            src="/assets/login-background.jpg"
            alt="Background"
            fill
            quality={100}
            loading="lazy"
            className="object-cover object-center"
          />
        </div>
      </section>
      <section className="container z-10 col-span-7 md:col-span-5 min-w-full  min-h-screen flex items-center  justify-center bg-gray-100 dark:bg-gray-900 overflow-x-hidden">
        <div className="w-96  p-5 ">
          <div className="flex justify-center">
            <h1 className="text-3xl text-center font-bold ">Login</h1>
          </div>

          <div className="flex-col">
            <div>
              <LoginForm />
            </div>
            <div className="mt-5">
              don't have a account?{' '}
              <Link href={'/auth/register'} className="text-indigo-600">
                register here
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;
