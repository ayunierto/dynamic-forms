'use client';

/**
 *
 * Optional props for header content. If provided, a header will be rendered above the main content.
 *
 * Example:
 * <PageContainer>
 *   <PageContainerHeader>
 *     <PageContainerLeftContent>
 *       <PageContainerTitle>Title</PageContainerTitle>
 *       <PageContainerDescription>Description</PageContainerDescription>
 *     </PageContainerLeftContent>
 *
 *     <PageContainerRightContent>
 *       <Button>Action</Button>
 *     </PageContainerRightContent>
 *   </PageContainerHeader>
 *   Main Content
 * </PageContainer>
 *
 */
export const PageContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="@container/main flex flex-1 flex-col py-3 px-4 lg:px-6 gap-4">
      {children}
    </div>
  );
};

export const PageContainerHeader = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-row justify-between items-center">{children}</div>
  );
};

export const PageContainerLeftContent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div>{children}</div>;
};

export const PageContainerRightContent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div>{children}</div>;
};

export const PageContainerTitle = ({ children }: { children: string }) => {
  return <h2 className="text-lg font-semibold">{children}</h2>;
};

export const PageContainerDescription = ({
  children,
}: {
  children: string;
}) => {
  return <p className="text-muted-foreground text-sm">{children}</p>;
};
