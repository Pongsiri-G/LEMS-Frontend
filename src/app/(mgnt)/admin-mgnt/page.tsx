"use client";

import AdminTable from "@/src/components/user-mgnt/adminTable";
import GrantAdminModal from "@/src/components/user-mgnt/GrantAdminModal";

import { useEffect, useMemo, useState } from "react";
import { User, UserRole } from "@/src/types/user";
import { getUsers, UserQueryParams } from "@/src/services/userMgntService/queryService";
import { revokeAdmin } from "@/src/services/userMgntService/commandService";

export default function AdminsPage() {
  const [admins, setAdmins] = useState<User[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ค้นหาในหน้าหลัก (ไม่มีตัวกรอง status)
  const [searchInput, setSearchInput] = useState("");
  const [q, setQ] = useState("");

  const params: UserQueryParams = useMemo(
    () => ({
      role: UserRole.Admin,  
      q: q.trim() || undefined,
      sort: "created_at desc",
    }),
    [q] // มีแค่ q เพราะไม่ได้กรอง status
  );

  async function load() {
    setLoading(true);
    try {
      const data = await getUsers(params);
      setAdmins(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  async function handleRevoke(id: string) {
    setBusyId(id);
    try {
      await revokeAdmin(id);
      setAdmins(prev => prev.filter(u => u.userId !== id));
    } finally {
      setBusyId(null);
    }
  }

  // modal
  const [open, setOpen] = useState(false);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <>
      <div className="flex items-center justify-between gap-4 mb-4">
        <h1 className="text-2xl font-semibold">รายชื่อผู้ดูแลระบบ</h1>
      </div>

      {/* fillter */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex gap-2">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setQ(searchInput)}
            placeholder="ค้นหาชื่อหรืออีเมล..."
            className="border rounded px-3 py-2 w-64"
          />
          <button
            onClick={() => setQ(searchInput)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            ค้นหา
          </button>
        </div>
      </div>

      {/* ตารางแสดง ADMIN */}
      <AdminTable admins={admins} busyId={busyId} onRevoke={handleRevoke} />

      {/* ปุ่มเพิ่ม admin (กึ่งกลางใต้ตาราง) */}
      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full shadow"
        >
          เพิ่ม admin
        </button>
      </div>

      {/* โมดัลเพิ่ม admin */}
      <GrantAdminModal
        open={open}
        onClose={() => setOpen(false)}
        onAfterGrant={() => {
          setOpen(false);
          load(); // รีโหลดรายการ ADMIN หลังจาก grant สำเร็จ
        }}
      />
    </>
  );
}
