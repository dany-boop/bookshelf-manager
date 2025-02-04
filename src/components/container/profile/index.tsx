'use client';
import EditUserForm from '@/components/common/Form/UserForm';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { fetchUser } from '@/store/reducers/userSlice';
import { AppDispatch, RootState } from '@/store/store';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

type Props = {};

const ContainerProfile = (props: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  const { id, email, username, password, photo_url, loading } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    dispatch(fetchUser(userId));
  }, [dispatch, userId]);

  return (
    <main className="w-full pb-24 ">
      <div className="relative bg-[--bg-container] shadow-md pb-14 rounded-xl overflow-hidden ">
        <div className="bg-[--color-accent] transition-all duration-1000 ease-in-out w-full bg-cover h-64  shadow-inner">
          <Image
            src="/assets/cover-4.webp"
            alt="username page background"
            fill
            quality={100}
            className=""
          />
        </div>
        <div className="absolute flex top-48 left-10">
          <Avatar className=" h-28 w-28 shadow-md ">
            <>
              <AvatarImage src={photo_url} alt="User Picture" />
              <Icon
                icon="solar:camera-bold-duotone"
                width={100}
                className="opacity-0 hover:opacity-95 focus:opacity-95 hover:cursor-pointer transition-all duration-100 absolute z-30 bg-black/55  w-full h-full"
              />
            </>
          </Avatar>
          <h1 className="text-2xl font-bold my-auto ms-5 text-white  ">
            {username}
          </h1>
          <p></p>
        </div>
      </div>
      <div className="relative shadow-md bg-[--bg-container] pb-14 rounded-xl overflow-hidden mt-10 p-5">
        <EditUserForm
          id={userId}
          username={username}
          email={email}
          password={password}
        />
      </div>
    </main>
  );
};

export default ContainerProfile;
