'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  MoreHorizontalIcon,
  FolderIcon,
  ShareIcon,
  Trash2Icon,
} from 'lucide-react';

interface NavSectionProps {
  items: Item[];
  title: string;
}

interface Item {
  name: string;
  url: string;
  icon: React.ReactNode;
  actions?: Action[];
}

interface Action {
  name: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export function NavSection({ items, title }: NavSectionProps) {
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                {item.icon}
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
            {item.actions && !isMobile && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction
                    showOnHover
                    className="rounded-sm data-[state=open]:bg-accent"
                  >
                    <MoreHorizontalIcon />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-24 rounded-lg"
                  side={isMobile ? 'bottom' : 'right'}
                  align={isMobile ? 'end' : 'start'}
                >
                  <DropdownMenuItem onSelect={() => console.log('clicked')}>
                    <FolderIcon />
                    <span>Open</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ShareIcon />
                    <span>Share</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive">
                    <Trash2Icon />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
