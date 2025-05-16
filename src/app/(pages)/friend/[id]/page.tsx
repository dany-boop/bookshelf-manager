import React from 'react';
import ContainerFriendPage from '@/components/container/friend-container';
import MainLayout from '@/components/layouts';

const FriendPage = () => {
  return (
    <main>
      <MainLayout>
        <div className="pt-24 w-full">
          <ContainerFriendPage />
        </div>
      </MainLayout>
    </main>
  );
};

export default FriendPage;
