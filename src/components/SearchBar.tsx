import Link from "next/link";
import { Search } from "lucide-react";

import { ReactNode } from "react";

type UserButtonProps = {
  children?: ReactNode;
};


export default function SearchBar({ children }: UserButtonProps) {
  return (
    <div className="flex justify-center w-full mt-5">
      <div className="flex flex-col items-center w-full max-w gap-4">
        <div className="relative w-full flex items-center justify-center gap-6">
          {/* <Link
            href="/borrow-return/my-borrow"
            className="absolute left-0 h-12 px-4 rounded-full bg-[rgb(255,225,106)] border-black border flex items-center justify-center text-[rgb(1,51,82)] font-[400] text-[16px] hover:scale-90 hover:bg-black hover:text-white transition-all"
          >
            การยืมของฉัน
          </Link> */}
          {children ?? null}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="ค้นหา..."
              className="w-full h-12 pl-10 pr-4 border rounded-full text-start outline-none border-neutral-300 focus:border-neutral bg-background"
            />
          </div>
        </div>


        <button className="z-10 h-10 px-6 w-45 rounded-full  text-foreground font-[400] text-[16px] cursor-pointer hover:scale-90 transition-all flex items-center justify-center active:scale-100 border-neutral border-1 backdrop-blur-2xl">
          ค้นหา
        </button>
      </div>
    </div>
  );
}
