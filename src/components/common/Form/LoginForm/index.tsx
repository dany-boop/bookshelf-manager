'use client';
import { loginFailure, loginSuccess } from '@/store/reducers/authSlice';
import React, { useState } from 'react';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';

const loginSchema = z.object({
  email: z
    .string()
    .nonempty('Email cannot be empty')
    .email('email must be have @ something')
    .min(3, { message: 'email cannot be empty' }),
  password: z
    .string()
    .nonempty('Password cannot be empty')
    .min(6, { message: 'Password cannot be empty' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleToggleVisibility = () => {
    setVisible((prevVisible) => !prevVisible);
  };

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const { user, token } = await response.json();
        dispatch(loginSuccess({ user, token }));
        router.push('/dashboard');
      } else {
        // If the response is not OK, read the error message from the response
        const errorData = await response.json();
        // Check for specific error messages related to fields
        if (errorData.message.includes('Email')) {
          methods.setError('email', {
            type: 'manual',
            message: errorData.message,
          });
        } else if (errorData.message.includes('Password')) {
          methods.setError('password', {
            type: 'manual',
            message: errorData.message,
          });
        } else {
          dispatch(loginFailure(errorData.message));
        }
        console.log(errorData.message);
      }
    } catch (error: any) {
      dispatch(loginFailure(error.message));
      console.log(error.message);
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
              id="email"
              label="Email"
              type="email"
              autoComplete="off"
              placeholder=""
              {...register('email', { required: 'Email is required' })}
              className="w-ful border-gray-400 p-5 py-6 rounded-lg text-sm mt-10 focus:border-green-500"
            />
            <FormMessage>{errors.email?.message}</FormMessage>
          </div>
        </FormControl>

        <FormControl>
          <div className="relative">
            <Input
              id="password"
              type={visible ? 'text' : 'password'}
              label="Password"
              {...register('password')}
              placeholder="Enter your password"
              className="w-ful border-gray-400 p-5 py-6 rounded-lg text-sm mt-10 focus:border-green-500"
            />
            <button
              type="button"
              onClick={handleToggleVisibility}
              className="absolute top-1/4 right-4 transform cursor-pointer text-slate-800 dark:text-slate-200 hover:bg-gray-400 p-0.5 rounded-full"
            >
              {visible ? (
                <Icon icon="solar:eye-bold-duotone" width={25} />
              ) : (
                <Icon icon="iconamoon:eye-off-duotone" width={25} />
              )}
            </button>

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
            'Login'
          )}
        </Button>
      </form>
    </FormProvider>
  );
};

export default LoginForm;
