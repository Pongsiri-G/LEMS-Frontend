"use client";

import { authSelector } from "@/src/feature/authSlice";
import { User } from "@/src/types/user";
import { ShieldMinus } from "lucide-react";
import { useSelector } from "react-redux";

interface Props {
  admins: User[];
  busyId: string | null;
  onRevoke: (id: string) => void;
}

export default function AdminTable({ admins, busyId, onRevoke }: Props) {
  const { user } = useSelector(authSelector)
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* เลื่อนเฉพาะในตาราง */}
      <div className="h-[calc(80vh-200px)] overflow-auto">
        <table className="w-full">
          <thead className="bg-blue-100 sticky top-0 z-10">
            <tr className="text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {admins.map((u) => (
              <tr key={u.userId} className="border-t hover:bg-blue-50 transition-colors">
                <td className="p-3">{u.userFullName}</td>
                <td className="p-3">{u.userEmail}</td>
                <td className="p-3">{u.userPhone}</td>
                <td className="p-3 text-center">
                  <button
                    type="button"
                    onClick={() => onRevoke(u.userId)}
                    disabled={busyId === u.userId || user?.userId === u.userId}
                    className="inline-flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-red-500"
                    title="Revoke admin"
                  >
                    <ShieldMinus size={18} />
                    Revoke
                  </button>
                </td>
              </tr>
            ))}

            {admins.length === 0 && (
              <tr>
                <td colSpan={4} className="p-5 text-center text-gray-500">
                  ไม่พบผู้ดูแลระบบ
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
