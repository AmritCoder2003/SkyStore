"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter ,usePathname } from "next/navigation";
 const sortTypes = [
  {
    label: "Date created (newest)",
    value: "$createdAt-desc",
  },
  {
    label: "Created Date (oldest)",
    value: "$createdAt-asc",
  },
  {
    label: "Name (A-Z)",
    value: "name-asc",
  },
  {
    label: "Name (Z-A)",
    value: "name-desc",
  },
  {
    label: "Size (Highest)",
    value: "size-desc",
  },
  {
    label: "Size (Lowest)",
    value: "size-asc",
  },
];
const Sort = () => {
  const router = useRouter();
  const path = usePathname();
  const handleSort = (value: string) => {
    router.push(`${path}?sort=${value}`);
  }
  return (
    <Select onValueChange={handleSort} defaultValue={sortTypes[0].value} >
      <SelectTrigger className="sort-select">
        <SelectValue className="text-blue-900 " placeholder={sortTypes[0].label} />
      </SelectTrigger>
      <SelectContent className="sort-select-content" >
        {sortTypes.map((sort) => (
          <SelectItem className="shad-select-item"  key={sort.value} value={sort.value}>
            {sort.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default Sort;
