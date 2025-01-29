import LoginForm from '@/components/common/Form/LoginForm';
import { ModeToggle } from '@/components/common/ThemeToggle';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Login = () => {
  return (
    <main className="flex overflow-hidden">
      <div className="z-10 mt-10 ml-20 ">
        <ModeToggle className="bg-stone-200/30 dark:bg-stone-900/30 backdrop-filter backdrop-blur-sm shadow-lg" />
      </div>
      <Image
        src={'/assets/login-background.jpg'}
        alt="background"
        className=" bg-cover fixed w-full h-full"
        fill
        quality={100}
        loading="lazy"
      />
      <section className="container z-10  min-w-full  min-h-screen flex items-center bg-[--bg-container] justify-center overflow-x-hidden">
        <div className="w-96 bg-stone-200/50 dark:bg-stone-900/50 backdrop-filter backdrop-blur-sm shadow-lg p-5 rounded-lg">
          <div className="flex justify-center">
            <div className="">
              <h1 className="text-3xl text-center font-bold ">Login</h1>
            </div>
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
