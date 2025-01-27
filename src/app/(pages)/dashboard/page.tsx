import DashboardContainer from '@/components/container/dashboard';
import MainLayout from '@/components/layouts';
import React from 'react';

type Props = {};

const Dashboard = (props: Props) => {
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
