"use client";
import React, { useState } from "react";
import { Models } from "node-appwrite";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Link from "next/link";
import { constructDownloadUrl } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

import {
  FolderPen,
  ListCollapse,
  Share2,
  Download,
  Trash2,
} from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { renameFile , updateFileUsers } from "@/lib/actions/file.actions";
import { usePathname } from "next/navigation";
import { FileDetails , ShareInput } from "./ActionsModalContent";

import { set } from "react-hook-form";
const actionDropdownItems = [
  {
    label: "Rename",
    icon: FolderPen,
    value: "rename",
  },
  {
    label: "Details",
    icon: ListCollapse,
    value: "details",
  },
  {
    label: "Share",
    icon: Share2,
    value: "share",
  },
  {
    label: "Download",
    icon: Download,
    value: "download",
  },
  {
    label: "Delete",
    icon: Trash2,
    value: "delete",
  },
];

const ActionDropdown = ({ file }: { file: Models.Document }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [action, setAction] = useState<ActionType | null>(null);
  const [name, setName] = useState<string>(file.name);
  const [isLoading, setIsLoading] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);
  const path = usePathname();
  const closeAllModals = () => {
    setIsModalOpen(false);
    setIsDropDownOpen(false);
    setAction(null);
    setName(file.name);
  };

  const handleAction = async (action: ActionType) => {
    if (!action) return;
    setIsLoading(true);
    let success = false;
    const actions = {
      rename: async () => {
        try {
          await renameFile({
            fileId: file.$id,
            name,
            extension: file.extension,
            path,
          });
          return true; 
        } catch (error) {
          console.error(error);
          return false;
        }
      },
      share: async () => {
        try {
          await updateFileUsers({
            fileId: file.$id,
            emails,
            path,
          });
          return true; 
        } catch (error) {
          console.error(error);
          return false;
        }
      }
    };
    success = await actions[action.value as keyof typeof actions]();
    if (success) {
      closeAllModals();
    }
    setIsLoading(false);
  };

  const handleRemoveUser = async (email: string) => {
    const newEmails= emails.filter((e) => e !== email);
    const success = await updateFileUsers({
      fileId: file.$id,
      emails: newEmails,
      path,
    })
    if(success){
      setEmails(newEmails);
    }
    closeAllModals();
  };

  const renderDialogContent = () => {
    if (!action) return null;
    const { label, value } = action;
    return (
      <DialogContent className="shad-dialog button ">
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className="text-center text-light-100">
            {label}
          </DialogTitle>
          {value === "rename" && (
            <Input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          )}
          {value === "details" && <FileDetails file={file} />}
          {value === "share" && (
            <ShareInput
              file={file}
              onInputChange={setEmails}
              onRemove={handleRemoveUser}
            />
          )}
        </DialogHeader>
        {["rename", "delete", "share"].includes(value) && (
          <DialogFooter className="flex flex-col gap-3 md:flex-row ">
            <Button onClick={closeAllModals} className="modal-cancel-button">
              Cancel
            </Button>
            <Button
              onClick={() => handleAction(action)}
              className="modal-submit-button"
            >
              <p className="capitalize">{value}</p>
              {isLoading && (
                <Image
                  src="/loader.svg"
                  width={24}
                  height={24}
                  alt="loader"
                  className="animate-spin"
                />
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    );
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DropdownMenu open={isDropDownOpen} onOpenChange={setIsDropDownOpen}>
        <DropdownMenuTrigger className="shad-no-focus">
          <Image
            src="/ellipsis-vertical.png"
            width={24}
            height={24}
            alt={file.name}
            className="shad-no-focus"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="max-w-[200px] truncate ">
            {file.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actionDropdownItems.map((item) => (
            <DropdownMenuItem
              className="shad-dropdown-item"
              onClick={() => {
                setAction(item);
                if (
                  ["rename", "share", "delete", "download", "details"].includes(
                    item.value
                  )
                ) {
                  setIsModalOpen(true);
                }
              }}
              key={item.value}
            >
              {item.value === "download" ? (
                <Link
                  href={constructDownloadUrl(file.bucketFileId)}
                  download={file.name}
                  className="flex items-center gap-2"
                >
                  <item.icon width={20} height={30} />
                  {item.label}
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <item.icon width={20} height={30} />
                  {item.label}
                </div>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {renderDialogContent()}
    </Dialog>
  );
};

export default ActionDropdown;
