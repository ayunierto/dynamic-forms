'use client';

import { ChartAreaInteractive } from '@/components/chart-area-interactive';
import { DataTable } from '@/components/data-table';
import { SectionCards } from '@/components/section-cards';

import data from './data.json';
import { PageContainer } from '@/components/dashboard/page-container';
import { SiteHeader } from '@/components/dashboard/site-header';

export default function Page() {
  return (
    <>
      <SiteHeader title="Templates" />

      <PageContainer
        title="Templates"
        description="Create and manage your templates here."
        actionButtonText="Create New Template"
        actionButtonOnClick={() => {
          console.log('Create New Template clicked');
        }}
      >
        <SectionCards />

        <ChartAreaInteractive />

        <DataTable data={data} />
      </PageContainer>
    </>
  );
}
