'use client';

import * as React from 'react';

import { NavMain } from '@/components/dashboard/nav-main';
import { NavSecondary } from '@/components/dashboard/nav-secondary';
import { NavUser } from '@/components/dashboard/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  LayoutDashboardIcon,
  ListIcon,
  Settings2Icon,
  CircleHelpIcon,
  DatabaseIcon,
  FileChartColumnIcon,
  FileIcon,
  CommandIcon,
  Folder,
} from 'lucide-react';

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },

  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: <LayoutDashboardIcon />,
    },
    {
      title: 'Templates',
      url: '/dashboard/templates',
      icon: <ListIcon />,
    },
    {
      title: 'My forms',
      url: '/dashboard/my-forms',
      icon: <Folder />,
    },
  ],

  navSecondary: [
    {
      title: 'Get Help',
      url: '#',
      icon: <CircleHelpIcon />,
    },
    {
      title: 'Settings',
      url: '#',
      icon: <Settings2Icon />,
    },

    // {
    //   title: 'Search',
    //   url: '#',
    //   icon: <SearchIcon />,
    // },
  ],

  documents: [
    {
      name: 'Data Library',
      url: '#',
      icon: <DatabaseIcon />,
    },
    {
      name: 'Reports',
      url: '#',
      icon: <FileChartColumnIcon />,
    },
    {
      name: 'Word Assistant',
      url: '#',
      icon: <FileIcon />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <CommandIcon className="size-5!" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={data.navMain}
          quickCreateAction={() => console.log('quick-create-action')}
        />
        {/* <NavSection title="Dynamic Forms" items={data.documents} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
