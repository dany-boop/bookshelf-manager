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

      const result = await res.json();

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
            <Label htmlFor="email">Username</Label>
            <Input
              id="username"
              type="username"
              {...register('username', { required: 'Username is required' })}
              placeholder="Enter your username"
              className="w-full"
            />
            <FormMessage>{errors.email?.message}</FormMessage>
          </div>
        </FormControl>
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
          {loading ? 'Registering ...' : 'Register'}
        </Button>
      </form>
    </FormProvider>
  );
};

export default RegisterForm;
