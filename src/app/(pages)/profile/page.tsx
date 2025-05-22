import ContainerProfile from '@/components/container/profile';
import MainLayout from '@/components/layouts';
import React from 'react';

const Profile = () => {
  return (
    <main>
      <MainLayout>
        <div className="pt-24 w-full">
          <ContainerProfile />
        </div>
      </MainLayout>
    </main>
  );
};

export default Profile;
