import DashboardContainer from '@/components/container/dashboard';
import MainLayout from '@/components/layouts';
import React from 'react';

const Dashboard = () => {
  return (
    <main>
      <MainLayout>
        <div className="pt-24 w-full">
          <DashboardContainer />
        </div>
      </MainLayout>
    </main>
  );
};

export default Dashboard;
