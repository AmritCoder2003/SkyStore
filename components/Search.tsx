"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Input } from "./ui/input";
import { useSearchParams } from "next/navigation";
import { getFiles } from "@/lib/actions/file.actions";
import { Models } from "node-appwrite";
import Thumbnail from "./Thumbnail";
import FormattedDateTime from "./FormattedDateTime";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useDebounce } from "use-debounce";

const Search = () => {
  const [query, setQuery] = useState("");
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query") || "";
  const [result, setResult] = useState<Models.Document[]>([]);
  const router = useRouter();
  const path = usePathname();
  const [debouncedQuery] = useDebounce(query, 300);

  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fetchFiles = async () => {
      if (debouncedQuery.length === 0) {
        setOpen(false);
        setResult([]);
        return router.push(path.replace(searchParams.toString(), ""));
      }
      const files = await getFiles({ types: [], searchText: debouncedQuery });
      setResult(files.documents);
      setOpen(true);
    };
    fetchFiles();
  }, [debouncedQuery]);

  useEffect(() => {
    if (!searchQuery) {
      setQuery("");
    }
  }, [searchQuery]);
  const handleClickItem = ({ file }: { file: Models.Document }) => {
    setOpen(false);
    setResult([]);
    router.push(
      `/${file.type === "video" || file.type === "audio" ? "media" : file.type + "s"}?query=${query}`
    );
  };
  return (
    <div className="search">
      <div className="search-input-wrapper">
        <Image src="/search.png" alt="search" width={24} height={24} />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="search-input"
        />
        {open && (
          <ul className="search-result">
            {result.length > 0 ? (
              result.map((file) => (
                <li
                  className="flex items-center
              justify-between"
                  key={file.$id}
                  onClick={() => handleClickItem({ file })}
                >
                  <div className="flex cursor-pointer items-center gap-4">
                    <Thumbnail
                      className="size-9 min-w-9"
                      type={file.type}
                      extension={file.extension}
                      url={file.url}
                    />
                    <p className="subtitle-2 line-clamp-1 text-light-100">
                      {file.name}
                    </p>
                  </div>
                  <FormattedDateTime
                    date={file.$createdAt}
                    ClassName="caption line-clamp-1 text-light-200 "
                  />
                </li>
              ))
            ) : (
              <p className="empty-result"> No files found </p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Search;
