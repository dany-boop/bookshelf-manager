import { useLoadingScreen } from '@/app/use-loading-screen';
import RegisterForm from '@/components/common/forms/register-form';
import LoadingScreen from '@/components/common/page-loading';
import { ModeToggle } from '@/components/common/theme-toggler';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Register = () => {
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
          <h1 className="text-3xl text-center font-bold ">Register</h1>

          <div className="flex-col">
            <div>
              <RegisterForm />
            </div>
            <div className="mt-5">
              already have an account?{' '}
              <Link href={'/auth/login'} className="text-indigo-600">
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Register;
