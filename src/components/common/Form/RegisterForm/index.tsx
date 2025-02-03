'use client';
import { Button } from '@/components/ui/button';
import { FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

const registerSchema = z.object({
  username: z
    .string()
    .nonempty('Username cannot be empty')
    .min(3, { message: 'Username must be at least 3 characters' }),
  email: z
    .string()
    .nonempty('Email cannot be empty')
    .email('email must be have @ something')
    .min(3, { message: 'email must be at least 3 characters' }),
  password: z
    .string()
    .nonempty('Password cannot be empty')
    .min(6, { message: 'Password must be at least 6 characters' }),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  const handleToggleVisibility = () => {
    setVisible((prevVisible) => !prevVisible);
  };

  const methods = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        // toast.success('Registration successful! Please log in.');
        router.push('/auth/login');
      } else {
        // toast.error(result.message || 'Something went wrong');
      }
    } catch (error) {
      //   toast.error('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormControl>
          <div className="">
            <Input
              id="username"
              type="username"
              autoComplete="off"
              placeholder="Enter your username"
              label="username"
              {...register('username', { required: 'Username is required' })}
              className="w-ful border-gray-400 p-5 py-6 rounded-lg text-sm mt-10 focus:border-green-500"
            />
            <FormMessage>{errors.username?.message}</FormMessage>
          </div>
        </FormControl>
        <FormControl>
          <div className="">
            <Input
              id="email"
              label="Email"
              type="email"
              autoComplete="off"
              placeholder="Enter your email"
              {...register('email', { required: 'Email is required' })}
              className="w-ful border-gray-400 p-5 py-6 rounded-lg text-sm mt-10 focus:border-green-500"
            />
            <FormMessage>{errors.email?.message}</FormMessage>
          </div>
        </FormControl>

        <FormControl>
          <div className="">
            <Input
              id="password"
              type="password"
              label="Password"
              {...register('password')}
              placeholder="Enter your password"
              className="w-ful border-gray-400 p-5 py-6 rounded-lg text-sm mt-10 focus:border-green-500"
            />

            <FormMessage>{errors.password?.message}</FormMessage>
          </div>
        </FormControl>

        <Button
          type="submit"
          className="w-full mt-2 bg-gray-900 hover:bg-gray-800 dark:bg-gray-200 dark:hover:bg-gray-300 shadow-md hover:shadow-xl dark:text-slate-900 text-slate-50"
        >
          {loading ? (
            <span className="animate-spin text-center "></span>
          ) : (
            'Register'
          )}
        </Button>
      </form>
    </FormProvider>
  );
};

export default RegisterForm;
