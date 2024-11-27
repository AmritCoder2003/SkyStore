'use client'
import React, { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

import Image from 'next/image'
import { CircleX } from 'lucide-react'
import { Button } from './ui/button'
import { verifySecret , sendEmailOtp } from '@/lib/actions/user.actions'
import { useRouter } from 'next/navigation'
const OTPModal = ({email, accountId,isOpen, onClose}: {email: string, accountId: string,isOpen: boolean,onClose: () => void}) => {

  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e:React.MouseEvent<HTMLButtonElement>)=> {
    e.preventDefault();
    setIsLoading(true);
    console.log({accountId, password});
    try{
      // Call API to verify OTP
      const sessionId= await verifySecret({accountId, password});
      if(sessionId){
        router.push('/')
      }
      console.log({ sessionId });
      
    }catch(error){
      console.log("Failed to verify OTP",error);
    }
    setIsLoading(false);
    
  }

  const handleResendOTP = async () => {
    await sendEmailOtp({email});
  }
  
  return (
    
    <AlertDialog open={isOpen} onOpenChange={(open)=>!open && onClose()} >
      
      <AlertDialogContent className='shad-alert-dialog' >
        <AlertDialogHeader className='relative flex justify-center ' >
          <AlertDialogTitle className='h2 text-center' >Enter your OTP
            <CircleX className='otp-close-button' size={20} color='red'  onClick={onClose} />
          </AlertDialogTitle>
          <AlertDialogDescription className='subtitle-2 text-center text-light-100' >
             We've sent a code to <span className='pl-1 text-brand ' > {email}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <InputOTP maxLength={6} value={password} onChange={setPassword} >
          <InputOTPGroup className='shad-otp' >
            <InputOTPSlot index={0} className='shad-otp-slot' />
            <InputOTPSlot index={1} className='shad-otp-slot' />
            <InputOTPSlot index={2} className='shad-otp-slot' />
            <InputOTPSlot index={3} className='shad-otp-slot' />
            <InputOTPSlot index={4} className='shad-otp-slot' />
            <InputOTPSlot index={5} className='shad-otp-slot' />
          </InputOTPGroup>
        </InputOTP>

        <AlertDialogFooter>

          <div className='flex w-full flex-col gap-4' >
            <AlertDialogAction onClick={handleSubmit} className='shad-submit-btn h-12' type='button' >
              Submit  { isLoading && <Image src='/loader.svg' width={24} height={24} alt='loader' className='ml-2 animate-spin' />}
            </AlertDialogAction>
            <div className='subtitle-2 mt-2 text-center text-light-100' >
              Didn't get a code?
              <Button type='button' variant='link'  className='pl-1 text-brand' onClick={handleResendOTP} >Click to resend</Button>
            </div>
          </div>
          
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

  )
}

export default OTPModal
