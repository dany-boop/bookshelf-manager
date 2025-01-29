'use client';
import { loginFailure, loginSuccess } from '@/store/reducers/authSlice';
import React, { useState } from 'react';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormControl, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const loginSchema = z.object({
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

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      console.log('response', response);

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
          // Generic error if no field-specific message is found
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
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email', { required: 'Email is required' })}
              placeholder="Enter your email"
              className="w-full"
            />
            <FormMessage>{errors.email?.message}</FormMessage>
          </div>
        </FormControl>

        <FormControl>
          <div className="">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register('password')}
              placeholder="Enter your password"
              className="w-full"
            />

            <FormMessage>{errors.password?.message}</FormMessage>
          </div>
        </FormControl>

        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 shadow-md hover:shadow-xl text-white"
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </FormProvider>
  );
};

export default LoginForm;
