"use client";

import { useEffect, useMemo, useState } from "react";
import { User, UserRole, UserStatus } from "@/src/types/user";
import { getUsers, UserQueryParams } from "@/src/services/userMgntService/queryService";
import { grantAdmin } from "@/src/services/userMgntService/commandService";

interface Props {
  open: boolean;
  onClose: () => void;
  onAfterGrant: () => void; // ให้หน้า parent รีโหลดตารางหลัก
}

export default function GrantAdminModal({ open, onClose, onAfterGrant }: Props) {
  const [list, setList] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);

  // ค้นหาในโมดัล
  const [searchInput, setSearchInput] = useState("");
  const [q, setQ] = useState("");

  // เลือกหลายคนด้วย Set
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const params: UserQueryParams = useMemo(
    () => ({
      role: UserRole.User,       // ต้องยังเป็น USER
      status: UserStatus.Active, // และ ACTIVE เท่านั้น
      q: q.trim() || undefined,  // ค้นหาด้วยชื่อ/อีเมล/เบอร์
      sort: "created_at desc",
    }),
    [q]
  );

  async function load() {
    setLoading(true);
    try {
      const data = await getUsers(params);
      setList(data);
    } finally {
      setLoading(false);
    }
  }

  // เปิดโมดัลเมื่อไร → รีเซ็ตและโหลดรอบแรก
  useEffect(() => {
    if (!open) return;
    setSelected(new Set());
    setSearchInput("");
    setQ("");
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // 🔧 สำคัญ: ให้โหลดใหม่เมื่อ q เปลี่ยน (มี debounce 300ms)
  useEffect(() => {
    if (!open) return; // โหลดเฉพาะตอนเปิดโมดัล
    const t = setTimeout(() => {
      load();
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, params]);

  const handleSearch = () => {
    setQ(searchInput); // แค่เซ็ต q — effect ด้านบนจะเป็นคนโหลดให้
  };

  const handleConfirm = async () => {
    if (selected.size === 0) {
      onClose();
      return;
    }
    setBusy(true);
    try {
      const ids = [...selected];
      const results = await Promise.allSettled(ids.map((id) => grantAdmin(id)));

      const failed = results
        .map((r, i) => ({ r, id: ids[i] }))
        .filter(({ r }) => r.status === "rejected")
        .map(({ id }) => id);

      if (failed.length > 0) {
        alert(
          `Grant สำเร็จ ${ids.length - failed.length}/${ids.length}\nที่พลาด: ${failed.join(", ")}`
        );
      }
      onClose();
      onAfterGrant(); // ให้หน้าหลักรีโหลดรายชื่อ Admin
    } finally {
      setBusy(false);
    }
  };

  const handleCancel = () => {
    setSelected(new Set()); // ล้างติ๊กทั้งหมด
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={handleCancel} />

      {/* modal card */}
      <div className="relative bg-white w-[95vw] max-w-4xl rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* header */}
        <div className="px-5 py-3 border-b bg-slate-50">
          <h3 className="font-semibold">เพิ่มผู้ดูแลระบบ</h3>
        </div>

        {/* search */}
        <div className="px-5 py-3 flex items-center gap-2 border-b">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="ค้นหาชื่อหรืออีเมล..."
            className="border rounded px-3 py-2 w-64"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            ค้นหา
          </button>
        </div>

        {/* list */}
        <div className="px-5 py-3 max-h-[60vh] overflow-auto">
          {loading ? (
            <p className="text-center text-gray-500 py-8">กำลังโหลด...</p>
          ) : (
            <table className="w-full">
              <thead className="bg-blue-100 sticky top-0 z-10">
                <tr className="text-left">
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3 text-right">เลือก</th>
                </tr>
              </thead>
              <tbody>
                {list.map((u) => (
                  <tr key={u.userId} className="border-t hover:bg-blue-50">
                    <td className="p-3">{u.userFullName}</td>
                    <td className="p-3">{u.userEmail}</td>
                    <td className="p-3">{u.userPhone}</td>
                    <td className="p-3 text-right">
                      <input
                        type="checkbox"
                        className="h-5 w-5"
                        checked={selected.has(u.userId)}
                        onChange={() => toggle(u.userId)}
                      />
                    </td>
                  </tr>
                ))}
                {list.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">
                      ไม่พบผู้ใช้ที่เป็น ACTIVE
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* footer */}
        <div className="px-5 py-4 flex items-center justify-between bg-slate-50 border-t">
          <div />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={busy}
              className="bg-rose-400 hover:bg-rose-500 text-white px-5 py-2 rounded disabled:opacity-60 disabled:cursor-not-allowed"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={busy || selected.size === 0}
              className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded disabled:opacity-60 disabled:cursor-not-allowed"
            >
              ยืนยัน
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
