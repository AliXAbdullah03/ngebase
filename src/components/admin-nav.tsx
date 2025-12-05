'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import {
  Home,
  Truck,
  LogOut,
  User,
  PlusCircle,
  BarChart,
  Layers,
} from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const Logo = () => (
    <Link href="/admin" className="flex items-center gap-2 text-xl font-bold text-sidebar-primary">
        <Truck className="w-6 h-6" />
        <span className="group-data-[collapsible=icon]:hidden">NGE Admin</span>
    </Link>
)

export function AdminNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader className="flex items-center justify-between">
        <Logo />
        <SidebarTrigger className="md:hidden"/>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/admin'}
              tooltip="Dashboard"
            >
              <Link href="/admin">
                <BarChart />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith('/admin/shipments')}
              tooltip="Shipments"
            >
              <Link href="/admin/shipments">
                <Truck />
                <span>Shipments</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/admin/shipments/new'}
              tooltip="New Shipment"
            >
              <Link href="/admin/shipments/new">
                <PlusCircle />
                <span>New Shipment</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
           <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/admin/batch-status'}
              tooltip="Batch Status"
            >
              <Link href="/admin/batch-status">
                <Layers />
                <span>Batch Status</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <div className="flex items-center gap-3 p-2">
            <Avatar>
                <AvatarImage src="https://picsum.photos/seed/admin/40/40" data-ai-hint="person face" />
                <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden group-data-[collapsible=icon]:hidden">
                <p className="text-sm font-semibold truncate">Admin User</p>
                <p className="text-xs text-sidebar-foreground/70 truncate">admin@nge.com</p>
            </div>
        </div>
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Log Out">
                    <Link href="/">
                        <LogOut />
                        <span>Log Out</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
