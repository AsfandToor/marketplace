"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ElementType } from "react";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback } from "./avatar";

interface SidebarProps {
  title: string;
  items: { name: string; href: string; icon: ElementType }[];
}

export function Sidebar({ title, items }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="flex h-full w-64 flex-col bg-gray-800 text-white">
      <div className="flex h-16 items-center justify-center border-b border-gray-700">
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
      <nav className="flex-1 flex flex-col p-4 justify-between">
        <div className="space-y-2">
          {items.map((item) => (
            <Button
              key={item.name}
              asChild
              variant="ghost"
              className={cn(
                "w-full justify-start",
                pathname === item.href
                  ? "bg-gray-700 text-white hover:bg-gray-700 hover:text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              )}
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-5 w-5" />
                {item.name}
              </Link>
            </Button>
          ))}
        </div>
        <div className="space-y-5">
          <div className="flex items-center gap-x-5">
            <Avatar>
              <AvatarFallback className="bg-black">
                {
                  session?.user?.name[0]
                }
              </AvatarFallback>
            </Avatar>
            <p>{ session?.user.name }</p>
          </div>
          <Button
          className="w-full"
            onClick={async () => {
              await signOut({ callbackUrl: "/signin" });
            }}
          >
            Logout
          </Button>
        </div>
      </nav>
    </div>
  );
}
