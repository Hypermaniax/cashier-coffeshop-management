"use client";

import React, { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarFooter,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Coffee,
  LayoutDashboard,
  ShoppingCart,
  ClipboardList,
  LogOut,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { TooltipProvider } from "@/components/ui/tooltip";
import { logOut } from "@/app/(auth)/login/action";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/cashier/dashboard" },
  { title: "Kasir (POS)", icon: ShoppingCart, href: "/cashier" },
  { title: "Riwayat Order", icon: ClipboardList, href: "/cashier/history" },
];

function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <span>
      {time.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })}
    </span>
  );
}

export default function CashierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const handleLogout = async () => {
    const res = await logOut();
    if (res.success) {
      toast.success(res.message);
      redirect("/login");
    }
  };

  return (
    <TooltipProvider>
      <SidebarProvider>
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild>
                  <Link href="/cashier/dashboard">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 shrink-0">
                      <Coffee className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex flex-col gap-0.5 leading-none">
                      <span className="font-bold text-sm">Coffee Shop</span>
                      <span className="text-xs text-muted-foreground">
                        Kasir Panel
                      </span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => {
                    const isActive =
                      item.href === "/cashier"
                        ? pathname === "/cashier"
                        : pathname.startsWith(item.href);
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          tooltip={item.title}
                          className={cn(
                            isActive &&
                              "bg-amber-50 text-amber-700 font-semibold"
                          )}
                        >
                          <Link href={item.href}>
                            <item.icon
                              className={cn(
                                "h-4 w-4",
                                isActive ? "text-amber-600" : ""
                              )}
                            />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className="text-red-500 hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Keluar</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          {/* Sticky Header */}
          <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-2 border-b bg-background/95 backdrop-blur-sm px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <div className="h-4 w-px bg-border" />
              <span className="hidden sm:block text-sm font-medium text-muted-foreground">
                Selamat datang, Kasir 👋
              </span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 border border-amber-200">
              <Clock className="h-3 w-3" />
              <LiveClock />
            </div>
          </header>

          {/* Content area */}
          <div className="relative flex-1 min-h-0 overflow-auto">
            {/* Decorative background */}
            <div
              aria-hidden
              className="pointer-events-none fixed inset-0 z-0"
              style={{
                opacity: 0.04,
                backgroundImage: `radial-gradient(circle at 20% 50%, #d97706 0%, transparent 50%), radial-gradient(circle at 80% 20%, #b45309 0%, transparent 40%)`,
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none fixed inset-0 z-0"
              style={{
                opacity: 0.025,
                backgroundImage: `linear-gradient(#d97706 1px, transparent 1px), linear-gradient(90deg, #d97706 1px, transparent 1px)`,
                backgroundSize: "48px 48px",
              }}
            />
            <div className="relative z-10 ">{children}</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
