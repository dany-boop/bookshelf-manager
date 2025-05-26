'use client';
import EditUserForm from '@/components/common/forms/user-form';
import OptimizedImage from '@/components/common/image-loading';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { clearUserData, fetchUser } from '@/redux/reducers/userSlice';
import { AppDispatch, RootState } from '@/redux/store';
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
    dispatch(clearUserData());
    dispatch(fetchUser(userId));
  }, [dispatch, userId]);

  return (
    <main className="w-full pb-24 ">
      <div className="relative  shadow-md pb-14 rounded-xl overflow-hidden ">
        <div className=" w-full bg-cover h-64 shadow-inner overflow-hidden">
          <OptimizedImage
            src="/assets/login-background.jpg"
            alt="username page background"
            fill
            quality={100}
            loading="lazy"
            className="object-cover object-center"
          />

          {/* <Image quality={100} /> */}
        </div>
        <div className="absolute flex top-48 left-10">
          <Avatar className=" h-28 w-28 shadow-md ">
            <AvatarImage src={photo_url} alt="User Picture" />
          </Avatar>
          <h1 className="text-2xl font-bold my-auto ms-5 text-white  ">
            {username}
          </h1>
          <p></p>
        </div>
      </div>
      <div className="relative  pb-14 rounded-xl overflow-hidden mt-10 ">
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
