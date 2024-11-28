"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { LayoutDashboard, Files, Images, CirclePlay, Grid2x2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { UserRound } from 'lucide-react';

const Sidebar = ({fullName, email, avatar}: {fullName: string, email: string, avatar: string}) => {
  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Documents", href: "/documents", icon: Files },
    { name: "Images", href: "/images", icon: Images },
    { name: "Media", href: "/media", icon: CirclePlay },
    { name: "Others", href: "/others", icon: Grid2x2 },
  ];

  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <Link href="/">
        <Image
          src="/profile.png"
          alt="logo"
          width={160}
          height={50}
          className="hidden h-auto lg:block mt-[-70px] mb-[-80px]"
        />
        <Image
          src="/apple-touch-icon.png"
          alt="logo"
          width={50}
          height={52}
          className="lg:hidden"
        />
      </Link>
      <nav className="sidebar-nav">
        <ul className="flex flex-1 flex-col gap-6">
          {navItems.map(({ name, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link href={href} key={href} className="lg:w-full" >
                <li
                  className={cn("sidebar-nav-item  ", pathname === href && "shad-active")}
                >
                  <Icon width={24} height={24} className={cn("nav-icon", pathname === href && "nav-icon-active")} />
                  <p className="hidden lg:block" >{name}</p>
                </li>
              </Link>
            );
          })}
        </ul>
      </nav>
      <Image src="/home.png" alt="Files" width={506} height={418} className="w-full mt-3 rounded-3xl "  />
      <div className="sidebar-user-info" >
        <Image src={avatar} alt="avatar" width={44} height={44} className="sidebar-user-avatar" />
        <div className="hidden lg:block" >
          <p className="subtitle-2 capitalize" >{fullName}</p>
          <p className="caption" >{email}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
