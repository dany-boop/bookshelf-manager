import LoadingScreen from '@/components/common/page-loading';
import CatalogContainer from '@/components/container/catalog';
import MainLayout from '@/components/layouts';
import React from 'react';

const Catalog = () => {
  return (
    <main>
      <MainLayout>
        <div className="pt-24 w-full">
          <CatalogContainer />
        </div>
      </MainLayout>
    </main>
  );
};

export default Catalog;
