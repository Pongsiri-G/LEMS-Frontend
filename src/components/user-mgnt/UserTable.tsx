"use client";

import { CheckCircle2, XCircle, Power, Trash2 } from "lucide-react";
import { User, UserStatus } from "@/src/types/user";

interface Props {
  users: User[];
  busyId: string | null;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onToggle: (id: string, status: UserStatus) => void;
  onDelete: (id: string) => void;
}

export default function UserTable({
  users,
  busyId,
  onAccept,
  onReject,
  onToggle,
  onDelete,
}: Props) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* กำหนดให้เลื่อนเฉพาะภายใน table */}
      <div className="max-h-[480px] overflow-auto">
        <table className="w-full">
          <thead className="bg-blue-100 sticky top-0 z-10">
            <tr className="text-left">
              <th className="p-3">Status</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Role</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u.userId}
                className="border-t hover:bg-blue-50 transition-colors"
              >
                <td className="p-3 font-medium">{u.userStatus}</td>
                <td className="p-3">{u.userFullName}</td>
                <td className="p-3">{u.userEmail}</td>
                <td className="p-3">{u.userPhone}</td>
                <td className="p-3">{u.userRole}</td>

                <td className="p-3 text-center">
                  <div className="flex gap-2 justify-center">
                    {/* ถ้ายัง Pending → แสดงปุ่ม Approve / Reject */}
                    {u.userStatus === UserStatus.Pending ? (
                      <>
                        <button
                          onClick={() => onAccept(u.userId)}
                          disabled={busyId === u.userId}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1"
                        >
                          <CheckCircle2 size={18} /> Approve
                        </button>

                        <button
                          onClick={() => onReject(u.userId)}
                          disabled={busyId === u.userId}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded flex items-center gap-1"
                        >
                          <XCircle size={18} /> Reject
                        </button>
                      </>
                    ) : u.userStatus !== UserStatus.Rejected && (
                      // ถ้าไม่ใช่ Pending และไม่ใช่ Reject → แสดงปุ่ม Toggle ON/OFF
                      <button
                        onClick={() => onToggle(u.userId, u.userStatus)}
                        disabled={busyId === u.userId}
                        className={`flex items-center gap-1 px-3 py-1 rounded text-white ${
                          u.userStatus === UserStatus.Active
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-gray-400 hover:bg-gray-500"
                        }`}
                      >
                        <Power size={18} />
                        {u.userStatus === UserStatus.Active ? "ON" : "OFF"}
                      </button>
                    )}

                    {/* ปุ่ม Delete */}
                    <button
                      onClick={() => onDelete(u.userId)}
                      disabled={busyId === u.userId}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1"
                    >
                      <Trash2 size={18} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="p-5 text-center text-gray-500">
                  ไม่มีผู้ใช้ในระบบ
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
