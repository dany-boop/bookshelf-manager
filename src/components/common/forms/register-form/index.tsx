'use client';
import { Button } from '@/components/ui/button';
import { FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { registerUser } from '@/redux/reducers/authSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { RegisterFormData, registerSchema } from '@/schemas/register';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

const RegisterForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  const { loading, error } = useSelector((state: RootState) => state.auth);

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
  } = methods;

  const onSubmit = async (data: RegisterFormData) => {
    const resultAction = await dispatch(registerUser(data));

    if (registerUser.fulfilled.match(resultAction)) {
      toast.success('Registration successful! Please log in.');
      router.push('/auth/login');
    } else {
      toast.error(resultAction.payload || 'Registration failed');
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
              onClick={() => setVisible((v) => !v)}
              className="absolute top-1/4 right-4 transform cursor-pointer text-slate-800 dark:text-slate-200 hover:bg-gray-400 p-0.5 rounded-full"
            >
              <Icon
                icon={
                  visible
                    ? 'solar:eye-bold-duotone'
                    : 'iconamoon:eye-off-duotone'
                }
                width={25}
              />
            </button>
            <FormMessage>{errors.password?.message}</FormMessage>
          </div>
        </FormControl>

        <Button
          type="submit"
          className="w-full mt-2 bg-gray-900 hover:bg-gray-800 dark:bg-gray-200 dark:hover:bg-gray-300 shadow-md hover:shadow-xl dark:text-slate-900 text-slate-50"
        >
          {loading ? (
            <span className="animate-spin text-center ">
              <Icon icon="mingcute:loading-fill" />
            </span>
          ) : (
            'Login'
          )}
        </Button>
      </form>
    </FormProvider>
  );
};

export default RegisterForm;
