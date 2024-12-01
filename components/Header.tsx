import React from 'react'
import {Button} from './ui/button'
import { LogOut } from 'lucide-react';
import FileUploader from './FileUploader';
import Search from './Search';
import { logout } from '@/lib/actions/user.actions';
const Header = ({userId,accountId}: {userId: string,accountId: string}) => {
  return (
    <header className='header' >
       <Search />
       <div className='header-wrapper' >
        <FileUploader ownerId={userId} accountId={accountId}  />
        <form action={
          async () => { 
            'use server';
            await logout(); }
        } >
            <Button type='submit' className='sign-out-button' >
                <LogOut className='w-6' width={24} height={24}  />
            </Button>
        </form>
       </div>

    </header>
  )
}

export default Header
