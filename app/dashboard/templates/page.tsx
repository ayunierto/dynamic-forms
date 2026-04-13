'use client';

import { PageContainer } from '@/components/dashboard/page-container';
import { SiteHeader } from '@/components/dashboard/site-header';
import { JsonEditor } from '@/components/editor/editor';
import { Card, CardContent } from '@/components/ui/card';

export default function Templates() {
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
        <Card>
          <CardContent>Test card</CardContent>
        </Card>

        <JsonEditor />
      </PageContainer>
    </>
  );
}
