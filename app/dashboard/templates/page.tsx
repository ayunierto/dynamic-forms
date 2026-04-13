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
import Link from 'next/link';

export default function Templates() {
  return (
    <>
      <SiteHeader title="Plantillas" />

      <PageContainer>
        <PageContainerHeader>
          <PageContainerLeftContent>
            <PageContainerTitle>Plantillas</PageContainerTitle>
            <PageContainerDescription>
              Administra tus plantillas para formularios dinámicos.
            </PageContainerDescription>
          </PageContainerLeftContent>

          <PageContainerRightContent>
            <Button asChild>
              <Link href={'/dashboard/templates/new'}>
                Crear Nueva Plantilla
              </Link>
            </Button>
          </PageContainerRightContent>
        </PageContainerHeader>

        <Card className="w-full">
          <CardContent>
            <p>Lista de plantillas</p>
          </CardContent>
        </Card>
      </PageContainer>
    </>
  );
}
