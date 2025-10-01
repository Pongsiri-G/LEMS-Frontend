import Link from "next/link";
import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="flex justify-center w-full mt-5">
      <div className="flex flex-col items-center w-full max-w gap-4">
        <div className="relative w-full flex items-center justify-center">
          <Link
            href="/borrow-return/my-borrow"
            className="absolute left-0 h-12 px-4 rounded-full bg-[rgb(255,225,106)] border-black border flex items-center justify-center text-[rgb(1,51,82)] font-[400] text-[16px] hover:scale-90 hover:bg-black hover:text-white transition-all"
          >
            การยืมของฉัน
          </Link>
          <div className="relative w-1/2 max-w">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full h-12 pl-10 pr-4 border rounded-full text-start"
            />
          </div>
        </div>

        
        <button className="h-10 px-6 w-45 rounded-full bg-[rgb(0,163,247)] border-black border text-white font-[400] text-[16px] hover:scale-90 hover:bg-black transition-all flex items-center justify-center">
          ค้นหา
        </button>
      </div>
    </div>
  );
}
