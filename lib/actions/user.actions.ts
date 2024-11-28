'use server'


import { createAdminClient, createSessionClient } from '@/lib/appwrite';
import { appwriteConfig } from '../appwrite/config';
import {Query , ID} from 'node-appwrite';
import { parseStringify } from '@/lib/utils';
import { cookies } from 'next/headers';
// ** create account flow **
// 1. User enters full name and email
// 2. Check if the user already exist using the email (we will use this identify if we will neet to create a new user document or not )
// 3. Send OTP to user's email
// 4. This will send a secret key for creating a session. The secret key
// 5. Create a new user document if the user is a new user
// 6. Return the user's accountId that will be used to complete the login flow
// 7. Verify OTP and authenticate to login



const getUserByEmail = async (email: string) => {
    const {databases} = await createAdminClient();
    const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [Query.equal('email', [email])]
    );
    return result.total>0 ? result.documents[0] : null
}

const handleError = (error: unknown, message: string) => {
    console.log(error,message);
    throw new Error(message)
}

export const sendEmailOtp = async ({email}: {email: string}) => {
    const {account} = await createAdminClient();
    try{
        const session = await account.createEmailToken(ID.unique(), email);
        return session.userId
    }catch(error){
        handleError(error, "Failed to send email OTP")
    }
}


export const createAccount = async ({fullName, email}:{fullName: string, email: string}) => {
    const existingUser = await getUserByEmail(email);
    
    const accountId = await sendEmailOtp({email})

    if(!accountId){
        throw new Error("Failed to send email OTP")
    }

    if(!existingUser){
        const {databases} = await createAdminClient();
        await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            ID.unique(),
            {
                fullName,
                email,
                accountId,
                avatar: 'https://images.unsplash.com/photo-1640951613773-54706e06851d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D',
            }
        )
        
    }
    return parseStringify({accountId});

}


export const verifySecret = async ({accountId,password}: {accountId: string, password: string}) => {
    
    try{
        const {account} = await createAdminClient();
        const session = await account.createSession(accountId, password);
        (await cookies()).set('appwrite-session', session.secret, {path: '/', httpOnly: true, secure: true, sameSite: 'strict'});
        return parseStringify({sessionId: session.$id});
    }catch(error){
        handleError(error, "Failed to verify OTP")
    }
}

export const getCurrentUser =async() =>{
    const {databases, account} = await createSessionClient();
    const result = await account.get();
    const user= await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [Query.equal('accountId', result.$id)]
    )
    if(user.total<=0){
        return null;
    }
    return parseStringify(user.documents[0]);

}
