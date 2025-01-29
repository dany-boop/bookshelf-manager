import RegisterForm from '@/components/common/Form/RegisterForm';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Register = () => {
  return (
    <main className="flex overflow-hidden">
      <Image
        src={'/assets/login-background.jpg'}
        alt="background"
        className=" bg-cover fixed w-full h-full"
        fill
        quality={100}
        loading="lazy"
      />
      <section className="container z-10  min-w-full  min-h-screen flex items-center bg-[--bg-container] justify-center overflow-x-hidden">
        <div className="w-96 bg-stone-200/50 backdrop-filter backdrop-blur-sm shadow-lg p-5 rounded-lg">
          <div className="flex justify-center">
            <div className="">
              <h1 className="text-3xl text-center font-bold ">Register</h1>
            </div>
          </div>

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
