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

type Props = {
  isSidebarOpen: boolean;
};
const TopBar: FC<Props> = ({ isSidebarOpen }) => {
  const router = useRouter();
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.auth.user);

  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'GET',
      });

      if (response.ok) {
        // Dispatch logout action to clear the Redux state
        dispatch(logout());
        router.push('/auth/login'); // Redirect to login page
      }
    } catch (error) {
      console.error('Error logging out', error);
    }
  };

  const handleFullScreenToggle = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
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
            <button>
              <Icon
                icon={`solar:${
                  isFullScreen
                    ? 'minimize-square-minimalistic-broken'
                    : 'maximize-square-minimalistic-broken'
                }`}
                width={25}
                className="text-[--color-accent]"
                onClick={handleFullScreenToggle}
              />
            </button>

            <div className="my-auto">
              <ModeToggle className="bg-transparent" />
            </div>
            <div className="my-auto">
              <Avatar className="md:h-8 md:w-8 h-6 w-6">
                {user?.photo_url ? (
                  <AvatarImage src={user?.photo_url} alt="User Picture" />
                ) : (
                  <Icon icon="solar:user-circle-outline" width={25} />
                )}
              </Avatar>
            </div>
            <div className="my-auto">
              <FriendList userId={user?.id} />
            </div>
            <button
              className=" bg-red-100 hover:bg-red-200 text-red-600 rounded-lg my-auto"
              onClick={handleLogout}
            >
              <Icon icon="lets-icons:sign-out-squre-duotone" width={30} />
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default TopBar;
