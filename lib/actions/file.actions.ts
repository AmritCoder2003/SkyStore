"use server";
import { InputFile } from "node-appwrite/file";
import { ID, Models, Query } from "node-appwrite";
import { appwriteConfig } from "../appwrite/config";
import { getCurrentUser } from "./user.actions";
const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw new Error(message);
};
import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { getFileType, constructFileUrl, parseStringify } from "../utils";
import { revalidatePath } from "next/cache";

export const uploadFile = async ({
  file,
  ownerId,
  accountId,
  path,
}: UploadFileProps) => {
  const { storage, databases } = await createAdminClient();
  try {
    const inputFile = InputFile.fromBuffer(file, file.name);
    const bucketFile = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      inputFile
    );
    const fileDocument = {
      type: getFileType(bucketFile.name).type,
      name: bucketFile.name,
      url: constructFileUrl(bucketFile.$id),
      extension: getFileType(bucketFile.name).extension,
      size: bucketFile.sizeOriginal,
      owner: ownerId,
      accountId,
      users: [],
      bucketFileId: bucketFile.$id,
    };
    const newFile = await databases
      .createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.filesCollectionId,
        ID.unique(),
        fileDocument
      )
      .catch(async (error: unknown) => {
        await storage.deleteFile(appwriteConfig.bucketId, bucketFile.$id);
        handleError(error, "Failed to upload file");
      });
    revalidatePath(path);
    return parseStringify(newFile);
  } catch (error) {
    handleError(error, "Failed to upload file");
  }
};

const createQueries = (currentUser: Models.Document) => {
  const queries = [
    Query.or([
      Query.equal("owner", currentUser.$id),
      Query.contains("users", currentUser.email),
    ]),
  ];

  return queries;
};

export const getFiles = async () => {
  const { databases } = await createSessionClient();
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not found");
    const queries = createQueries(currentUser);
    //console.log({ queries, currentUser });
    const files = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      queries
    );
    //console.log({ files });
    return parseStringify(files);
  } catch (error) {
    handleError(error, "Failed to get files");
  }
};


export const renameFile = async ({fileId,name,extension,path}: RenameFileProps) => {
  const {databases} = await createAdminClient();
  try{
    const newName= `${name}`;
    const updatedFile= await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
      {name: newName}
    );
    revalidatePath(path);
    return parseStringify(updatedFile);
  }catch(error){
    handleError(error, "Failed to rename file")
  }
}

export const updateFileUsers = async ({fileId,emails,path}: UpdateFileUsersProps) => {
  const {databases} = await createAdminClient();
  try{
    const updatedFile= await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      fileId,
      {users: emails}
    );
    revalidatePath(path);
    return parseStringify(updatedFile);
  }catch(error){
    handleError(error, "Failed to update file users")
  }
}