"use client";

import UserTable from "@/src/components/user-mgnt/UserTable";
import { User, UserStatus, UserRole } from "@/src/types/user";
import {
  getUsers,
  UserQueryParams,
} from "@/src/services/userMgntService/queryService";
import {
  acceptUser,
  rejectUser,
  activateUser,
  deactivateUser,
  deleteUser,
} from "@/src/services/userMgntService/commandService";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // filters
  const [searchInput, setSearchInput] = useState("");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<UserStatus | "ALL">("ALL");

  const params: UserQueryParams = useMemo(
    () => ({
      role: UserRole.User,
      status,
      q: q.trim() || undefined,
      sort: "created_at desc",
    }),
    [q, status]
  );

  async function load() {
    setLoading(true);
    try {
      const data = await getUsers(params);
      setUsers(data);
    } catch (e) {
      alert("โหลดข้อมูลล้มเหลว");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  // Search function
  const handleSearch = async () => {
    try {
      setLoading(true);
      const data = await getUsers({
        ...params,
        q: searchInput.trim() || undefined
      });
      setUsers(data);
      setQ(searchInput); // Update q state after successful search
    } catch (e) {
      alert("โหลดข้อมูลล้มเหลว");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Load when status changes
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  async function handleAction(
    fn: () => Promise<any>,
    id: string,
    cb: () => void
  ) {
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
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-semibold text-center">ระบบจัดการผู้ใช้</h1>
      <div className="flex items-center justify-between gap-4 mb-4">
        <h1 className="text-2xl font-semibold">รายชื่อผู้ใช้</h1>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex gap-2">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
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
        <select
          className="border rounded px-3 py-2"
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
        >
          <option value="ALL">All</option>
          <option value={UserStatus.Active}>Active</option>
          <option value={UserStatus.Pending}>Pending</option>
          <option value={UserStatus.Rejected}>Rejected</option>
          <option value={UserStatus.Deactivated}>Deactivated</option>
        </select>
      </div>

      <UserTable
        users={users}
        busyId={busyId}
        onAccept={(id) =>
          handleAction(() => acceptUser(id), id, () =>
            setUsers((prev) =>
              prev.map((u) =>
                u.userId === id
                  ? { ...u, userStatus: UserStatus.Active }
                  : u
              )
            )
          )
        }
        onReject={(id) =>
          handleAction(() => rejectUser(id), id, () =>
            setUsers((prev) =>
              prev.map((u) =>
                u.userId === id
                  ? { ...u, userStatus: UserStatus.Rejected }
                  : u
              )
            )
          )
        }
        onToggle={(id, status) =>
          handleAction(
            () =>
              status === UserStatus.Active
                ? deactivateUser(id)
                : activateUser(id),
            id,
            () =>
              setUsers((prev) =>
                prev.map((u) =>
                  u.userId === id
                    ? {
                        ...u,
                        userStatus:
                          status === UserStatus.Active
                            ? UserStatus.Deactivated
                            : UserStatus.Active,
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
