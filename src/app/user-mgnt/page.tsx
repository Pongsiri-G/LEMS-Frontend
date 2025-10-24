"use client";

import UserTable from "@/src/components/user-mgnt/UserTable";
import { User, UserStatus } from "@/src/types/user";
import {
  getAllUsers,
  acceptUser,
  rejectUser,
  deactivateUser,
  deleteUser
} from "@/src/services/userMgntService/userMgntService";

import { useState, useEffect } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllUsers()
      .then(setUsers)
      .catch(() => alert("โหลดข้อมูลล้มเหลว"))
      .finally(() => setLoading(false));
  }, []);

  async function handleAction(fn: () => Promise<any>, id: string, cb: () => void) {
    setBusyId(id);
    try {
      await fn();
      cb();
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาด");
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-semibold mb-4">จัดการผู้ใช้</h1>

      <UserTable
        users={users}
        busyId={busyId}
        onApprove={(id) =>
          handleAction(() => acceptUser(id), id, () =>
            setUsers((prev) =>
              prev.map((u) =>
                u.userId === id ? { ...u, userStatus: UserStatus.Active } : u
              )
            )
          )
        }
        onReject={(id) =>
          handleAction(() => rejectUser(id), id, () =>
            setUsers((prev) => prev.filter((u) => u.userId !== id))
          )
        }
        onToggle={(id, status) =>
          handleAction(() => deactivateUser(id), id, () =>
            setUsers((prev) =>
              prev.map((u) =>
                u.userId === id
                  ? {
                      ...u,
                      userStatus:
                        status === UserStatus.Active ? UserStatus.Deactivated : UserStatus.Active,
                    }
                  : u
              )
            )
          )
        }
        onDelete={(id) =>
          handleAction(() => deleteUser(id), id, () =>
            setUsers((prev) => prev.filter((u) => u.userId !== id))
          )
        }
      />
    </div>
  );
}