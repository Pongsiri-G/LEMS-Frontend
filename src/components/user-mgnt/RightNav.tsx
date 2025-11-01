"use client";

import { useRouter, usePathname } from "next/navigation";
import { Users, Crown, FileText } from "lucide-react";

export default function RightNav() {
  const router = useRouter();
  const pathname = usePathname();

  const items = [
    { label: "รายชื่อผู้ใช้", icon: Users, href: "/user-mgnt" },
    { label: "จัดการสิทธิผู้ดูแล", icon: Crown, href: "/admin-mgnt" },
    { label: "ตรวจสอบบันทึก", icon: FileText, href: "/logs" },
  ];

  return (
    <div className="w-64">
      <div className="rounded-2xl border border-sky-200 bg-sky-50/60 shadow-sm p-3">
        <ul className="space-y-2">
          {items.map((item) => {
            const isActive = pathname?.startsWith(item.href);
            const Icon = item.icon;
            
            return (
              <li key={item.href}>
                <button
                  onClick={() => router.push(item.href)}
                  className={`w-full text-left flex items-center gap-2 rounded-xl px-3 py-2 transition ${
                    isActive
                      ? "bg-white shadow border border-sky-200 text-sky-700"
                      : "hover:bg-white/60 text-slate-700"
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}