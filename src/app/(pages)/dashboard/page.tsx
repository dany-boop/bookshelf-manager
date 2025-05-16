import ClientLoader from '@/app/use-loading-screen';
import DashboardContainer from '@/components/container/dashboard';
import MainLayout from '@/components/layouts';
import React from 'react';

const Dashboard = () => {
  return (
    // <ClientLoader>
    <main>
      <MainLayout>
        <div className="pt-24 w-full">
          <DashboardContainer />
        </div>
      </MainLayout>
    </main>
    // </ClientLoader>
  );
};

export default Dashboard;
