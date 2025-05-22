'use client';
import { loginUser } from '@/redux/reducers/authSlice';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { LoginFormValues, loginSchema } from '@/schemas/login';
import { AppDispatch, RootState } from '@/redux/store';

const LoginForm = () => {
  const methods = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [visible, setVisible] = useState(false);

  const onSubmit = async (data: LoginFormValues) => {
    const result = await dispatch(loginUser(data));

    if (loginUser.fulfilled.match(result)) {
      toast.success('Login successful! Redirecting...');
      setTimeout(() => router.push('/dashboard'), 1500);
    } else {
      toast.error(result.payload || 'Login failed');
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
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
    </motion.div>
  );
};

export default LoginForm;
