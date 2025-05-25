'use client';

import { useRouter } from 'next/navigation';
import React, { FC, useState } from 'react';

import { Icon } from '@iconify/react';
import { ModeToggle } from '@/components/common/theme-toggler';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/reducers/authSlice';
import { RootState } from '@/redux/store';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import FriendList from '@/components/common/friend-list';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type Props = {
  isSidebarOpen: boolean;
};
const TopBar: FC<Props> = ({ isSidebarOpen }) => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);

  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'GET',
      });

      if (response.ok) {
        dispatch(logout());
        router.push('/auth/login'); // Redirect to login page
      }
    } catch (error) {
      console.error('Error logging out', error);
    }
  };

  return (
    <>
      <header
        className={`fixed md:w-[82em] w-[26.6em] z-40 transition-all duration-300 h-[4rem]  ${
          isSidebarOpen
            ? 'md:w-[calc(100%-18rem)] w-[calc(100%--0.5rem)]'
            : 'md:w-[calc(100%-4.5rem)] w-[calc(100%--0.5rem)]'
        }`}
      >
        <div className="flex px-7 justify-between items-center h-full border-b border-1 bg-gray-100/80 dark:bg-gray-900/80  backdrop-filter backdrop-blur-md">
          <div className="text-xl"></div>
          <div className="flex gap-10 align-middle">
            <div className="my-auto">
              <ModeToggle className="bg-transparent" />
            </div>
            <div className="my-auto">
              <FriendList userId={user?.id} />
            </div>
            <div className="my-auto">
              <Popover>
                <PopoverTrigger>
                  <Avatar className="md:h-8 md:w-8 h-6 w-6">
                    {user?.photo_url ? (
                      <AvatarImage src={user?.photo_url} alt="User Picture" />
                    ) : (
                      <Icon icon="solar:user-circle-outline" width={25} />
                    )}
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className="max-w-44 flex-col gap-5 bg-gray-100/50 dark:bg-gray-900/50  backdrop-filter backdrop-blur-md">
                  <button
                    className="flex gap-6 align-center rounded-lg w-full hover:bg-slate-100 hover:dark:bg-slate-900  py-2 px-5"
                    onClick={() => router.push('/profile')}
                  >
                    <Icon icon="solar:user-bold-duotone" width={25} />
                    Profile
                  </button>
                  <button
                    className="flex gap-5 align-center rounded-lg w-full hover:bg-slate-100 hover:dark:bg-slate-900  py-2 px-5"
                    onClick={handleLogout}
                  >
                    <Icon
                      icon="lets-icons:sign-out-squre-duotone"
                      className=" text-red-600"
                      width={30}
                    />
                    Logout
                  </button>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default TopBar;
