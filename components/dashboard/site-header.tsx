import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ToggleButtonTheme } from '../toggle-button-theme';

interface SiteHeaderProps {
  title: string;
  rightChildren?: React.ReactNode;
  leftChildren?: React.ReactNode;
}

export function SiteHeader({
  title,
  rightChildren,
  leftChildren,
}: SiteHeaderProps) {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 my-auto data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{title}</h1>
        {leftChildren}
        <div className="ml-auto flex items-center gap-4">
          {rightChildren}
          <ToggleButtonTheme />
        </div>
      </div>
    </header>
  );
}
