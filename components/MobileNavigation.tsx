"use client"
import React,{ useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Link from 'next/link';
import { LayoutDashboard, Files, Images, CirclePlay, Grid2x2 , LogOut } from "lucide-react";
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react';
import Image from 'next/image'
import { Separator } from './ui/separator';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import FileUploader from './FileUploader';
import { logout } from '@/lib/actions/user.actions';
const MobileNavigation = ({ownerId,accountId,avatar,fullName,email}:{ownerId: string,accountId: string,avatar: string,fullName: string,email: string}) => {
  const [open , setOpen] = useState(false);
  const pathname = usePathname();
  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Documents", href: "/documents", icon: Files },
    { name: "Images", href: "/images", icon: Images },
    { name: "Media", href: "/media", icon: CirclePlay },
    { name: "Others", href: "/others", icon: Grid2x2 },
  ];
  return (
    <header className='mobile-header' >
      <Image src="/profile1.png" alt="logo" width={160} height={10} className='h-10 mt-2.5 ml-[-20px] '  />
      <Sheet open={open} onOpenChange={setOpen} >
        <SheetTrigger>
          <Menu className='h-auto' width={30} height={30} />
        </SheetTrigger>
        <SheetContent className='shad-sheet h-screen px-3 ' >
            <SheetTitle>
              <div className='header-user' >
                <Image src ={avatar} alt="avatar" width={44} height={44} 
                className='header-user-avatar'  />
                <div className='sm:hidden lg:block' >
                  <p className='subtitle-2 capitalize' >{fullName}</p>
                  <p className='caption' > {email} </p>
                </div>
              </div>
              <Separator className='mb-4 bg-light-200/20'  />
            </SheetTitle>
            <nav className='mobile-nav' >
              <ul className='mobile-nav-list' >
              {navItems.map(({ name, href, icon: Icon }) => {
                  const active = pathname === href;
                  return (
                    <Link href={href} key={href} className="lg:w-full" >
                      <li
                        className={cn("mobile-nav-item  ", pathname === href && "shad-active")}
                      >
                        <Icon width={24} height={24} className={cn("nav-icon", pathname === href && "nav-icon-active")} />
                        <p  >{name}</p>
                      </li>
                    </Link>
                  );
                })}
              </ul>
            </nav>
            <Separator className='my-5 bg-light-200/20'  />
            <div className='flex flex-col justify-between gap-5 pb-5 ' >
              <FileUploader />
                <Button type='submit' className='mobile-sign-out-button'
                onClick={async() => await logout() } >
                  <LogOut  width={24} height={24}  />
                  <p>Logout</p>
              </Button>
            </div>

        </SheetContent>
      </Sheet>
    </header>
  )
}

export default MobileNavigation
