"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Lock } from "lucide-react";
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-2.5 p-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Lock className="h-6 w-6" />
            </div>
            <span className="font-headline text-xl font-semibold text-sidebar-foreground">
              VaultLock
            </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex-1 p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
                className="justify-start"
              >
                <Link href={item.href}>
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </div>
  );
}
