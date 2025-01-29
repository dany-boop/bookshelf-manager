'use client';

import { usePathname, useRouter } from 'next/navigation';
import React, { FC, useState } from 'react';

import { Icon } from '@iconify/react';
import { ModeToggle } from '@/components/common/ThemeToggle';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/reducers/authSlice';
import { RootState } from '@/store/store';

type Props = {
  isScrolled: boolean;
  isSidebarOpen: boolean;
};
const TopBar: FC<Props> = ({ isScrolled, isSidebarOpen }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const user = useSelector((state: RootState) => state.auth.user);

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/auth/login');
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
        className={`fixed md:w-[82em] w-[26.6em]  z-40  transition-all duration-300 h-[4rem]  ${
          isSidebarOpen
            ? 'md:w-[calc(100%-18rem)] w-[calc(100%--0.5rem)]'
            : 'md:w-[calc(100%-4.5rem)] w-[calc(100%--0.5rem)]'
        }`}
      >
        <div
          className={`flex px-7 justify-between items-center h-full  transition-all duration-300 ease-in-out ${
            isScrolled
              ? 'mx-7 bg-stone-100/80 dark:bg-stone-900/80 shadow-md backdrop-filter backdrop-blur-md rounded-b-lg transform translate-y-0'
              : 'bg-stone-100 dark:bg-stone-900 shadow-none transform -translate-y-1'
          }`}
        >
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
              <ModeToggle />
            </div>
            <p className="my-auto">{user?.username}</p>
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
