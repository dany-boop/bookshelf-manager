import ClientLoader from '@/app/use-loading-screen';
import LoadingScreen from '@/components/common/page-loading';
import ContainerProfile from '@/components/container/profile';
import MainLayout from '@/components/layouts';
import React from 'react';

const Profile = () => {
  return (
    <ClientLoader>
      <main>
        <MainLayout>
          <div className="pt-24 w-full">
            <ContainerProfile />
          </div>
        </MainLayout>
      </main>
    </ClientLoader>
  );
};

export default Profile;
