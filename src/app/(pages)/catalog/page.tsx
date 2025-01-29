import CatalogContainer from '@/components/container/catalog';
import MainLayout from '@/components/layouts';
import React from 'react';

type Props = {};

const Catalog = (props: Props) => {
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
