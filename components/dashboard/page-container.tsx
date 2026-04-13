import { Button } from '../ui/button';

interface PageContainerProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  actionButtonText?: string;
  actionButtonOnClick?: () => void;
}
export const PageContainer = ({
  title,
  description,
  children,
  actionButtonText,
  actionButtonOnClick,
}: PageContainerProps) => {
  return (
    <div className="flex flex-1">
      <div className="@container/main flex flex-1 flex-col p-4 lg:px-6 gap-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col">
            {title && <h2 className="text-lg font-semibold">{title}</h2>}

            {description && (
              <p className="text-muted-foreground text-sm">{description}</p>
            )}
          </div>

          <div>
            {actionButtonText && (
              <Button
                variant="default"
                size="default"
                onClick={actionButtonOnClick}
              >
                {actionButtonText}
              </Button>
            )}
          </div>
        </div>

        {children}
      </div>
    </div>
  );
};
