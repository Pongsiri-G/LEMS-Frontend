import RightNav from "@/src/components/user-mgnt/RightNav";
import type { ReactNode } from "react";

export default function MgmtLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full mx-auto px-4 py-10">
      {/* หัวข้ออยู่ตรงกลาง */}
      <h1 className="text-4xl font-semibold mb-6 text-center">ระบบจัดการผู้ใช้</h1>
      
      {/* Layout แบบ flex */}
      <div className="flex gap-4 items-start max-w-[1600px] mx-auto">
        {/* Main content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
        
        {/* Right sidebar*/}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky py-28">
            <RightNav />
          </div>
        </aside>
      </div>
    </div>
  );
}