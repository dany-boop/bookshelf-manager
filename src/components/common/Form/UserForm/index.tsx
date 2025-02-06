import React, { FC, useEffect, useState } from 'react';
import { Input, NormalInput } from '@/components/ui/input';

import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { resetEditUserState, updateUser } from '@/redux/reducers/userSlice';
import { Icon } from '@iconify/react';
import { Button } from '@/components/ui/button';

interface UserFormProps {
  id?: string;
  username: string;
  email: string;
  password: string;
  photo_url?: string;
}

const userSchema = z.object({
  username: z
    .string()
    .nonempty('Username cannot be empty')
    .min(3, { message: 'Username must be at least 3 characters' }),
  email: z
    .string()
    .nonempty('Email cannot be empty')
    .email('email must be have @ something')
    .min(3, { message: 'email must be at least 3 characters' }),
  password: z.string().optional(),
  photo_url: z.any().optional(),
});

const EditUserForm: FC<UserFormProps> = ({ id, username, email, password }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { editUserState } = useSelector((state: RootState) => state.user);
  const [visible, setVisible] = useState(false);
  const [hasUserTyped, setHasUserTyped] = useState(false);
  const [initialPassword, setInitialPassword] = useState<string>(password);

  const togglePasswordVisibility = () => {
    setVisible((prev) => !prev);
    if (!hasUserTyped) {
      form.setValue('password', '');
    }
  };

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: username,
      email: email,
      password: '',
      photo_url: null,
    },
  });

  useEffect(() => {
    form.reset({ username, email, password: '' });
    setHasUserTyped(false);
    setInitialPassword(password);
  }, [id, username, email, password, form]);

  const onSubmit = (values: z.infer<typeof userSchema>) => {
    const formBody = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key === 'password' && !value) return;
      formBody.append(key, value as string);
    });

    if (id) formBody.append('userId', id);

    dispatch(updateUser({ userId: id, data: formBody })).then(() =>
      dispatch(resetEditUserState())
    );
  };

  useEffect(() => {
    return () => {
      dispatch(resetEditUserState());
    };
  }, [dispatch]);

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <h2 className="text-xl mb-5 text-center font-bold">Personal Info</h2>

          {/* Error Message */}
          {editUserState.error && (
            <div className="text-red-500">{editUserState.error}</div>
          )}
          <div className="space-y-3">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="username"
                      id="username"
                      name="username"
                      label="Username"
                      placeholder=""
                      className="w-ful border-gray-400 p-5 py-6 rounded-lg text-sm mt-10 focus:border-green-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      id="email"
                      name="email"
                      label="Email"
                      placeholder=""
                      className="w-ful border-gray-400 p-5 py-6 rounded-lg text-sm mt-10 focus:border-green-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="relative">
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        id="password"
                        name="password"
                        type={visible ? 'text' : 'password'}
                        label="Password"
                        placeholder=""
                        onChange={(e) => {
                          setHasUserTyped(true);
                          field.onChange(e);
                        }}
                        className="w-ful border-gray-400 p-5 py-6 rounded-lg text-sm mt-10 focus:border-green-500"
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute top-1/4 right-4 transform cursor-pointer text-slate-800 dark:text-slate-200 hover:bg-gray-400 p-0.5 rounded-full"
                    >
                      {visible ? (
                        <Icon icon="solar:eye-bold-duotone" width={25} />
                      ) : (
                        <Icon icon="iconamoon:eye-off-duotone" width={25} />
                      )}
                    </button>
                    <FormMessage>{editUserState.error}</FormMessage>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="photo_url"
              render={({ field: { onChange } }) => (
                <FormItem>
                  <FormControl>
                    <NormalInput
                      type="file"
                      accept="image/*"
                      onChange={(e) => onChange(e.target.files?.[0])}
                      className="mt-10"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-center justify-end space-x-4 mt-5">
            <Button
              type="submit"
              className="w-full mt-2 bg-gray-900 hover:bg-gray-800 dark:bg-gray-200 dark:hover:bg-gray-300 shadow-md hover:shadow-xl dark:text-slate-900 text-slate-50"
            >
              {editUserState.loading ? (
                <span className="animate-spin text-center ">
                  <Icon icon="mingcute:loading-fill" />
                </span>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EditUserForm;
