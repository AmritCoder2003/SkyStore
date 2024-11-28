import React from 'react'
import Image from 'next/image'
import {Button} from './ui/button'
import { LogOut } from 'lucide-react';
import FileUploader from './FileUploader';
import Search from './Search';
const Header = () => {
  return (
    <header className='header' >
       <Search />
       <div className='header-wrapper' >
        <FileUploader />
        <form>
            <Button type='submit' className='sign-out-button' >
                <LogOut className='w-6' width={24} height={24}  />
            </Button>
        </form>
       </div>

    </header>
  )
}

export default Header
