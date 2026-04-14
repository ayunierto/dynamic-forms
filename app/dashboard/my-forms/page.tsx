'use client';

import {
  PageContainer,
  PageContainerDescription,
  PageContainerHeader,
  PageContainerLeftContent,
  PageContainerRightContent,
  PageContainerTitle,
} from '@/components/dashboard/page-container';
import { SiteHeader } from '@/components/dashboard/site-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { NextPage } from 'next';

const DynamicForms: NextPage = ({}) => {
  return (
    <>
      <SiteHeader title="Mis formularios" />

      <PageContainer>
        <PageContainerHeader>
          <PageContainerLeftContent>
            <PageContainerTitle>Mis formularios</PageContainerTitle>
            <PageContainerDescription>
              Aquí puedes ver y gestionar todos tus formularios.
            </PageContainerDescription>
          </PageContainerLeftContent>

          <PageContainerRightContent>
            <Button variant="default" className="cursor-pointer">
              Crear nuevo formulario
            </Button>
          </PageContainerRightContent>
        </PageContainerHeader>
        <Card>
          <CardContent>Test card</CardContent>
        </Card>
      </PageContainer>
    </>
  );
};

export default DynamicForms;
