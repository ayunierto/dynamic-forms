'use client';

import { PageContainer } from '@/components/dashboard/page-container';
import { SiteHeader } from '@/components/dashboard/site-header';
import { Card, CardContent } from '@/components/ui/card';
import { NextPage } from 'next';

const DynamicForms: NextPage = ({}) => {
  return (
    <>
      <SiteHeader title="My Forms" />

      <PageContainer
        title="My Forms"
        description="Create and manage your forms here."
        actionButtonText="Create New Form"
        actionButtonOnClick={() => {
          console.log('Create New Form clicked');
        }}
      >
        <Card>
          <CardContent>Test card</CardContent>
        </Card>
      </PageContainer>
    </>
  );
};

export default DynamicForms;
