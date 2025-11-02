"use client"
import LogTable from "@/src/components/borrow-history/LogTable";
import MovingCloudBG from "@/src/components/MovingCloudBG";
import { apiClient } from "@/src/services/apiClient";
import { BorrowLog, toBorrowLog } from "@/src/types/borrow-log";
import { useEffect, useState } from "react";

const columns = [
  {
    key: "borrowID",
    label: "รหัสการยืม",
  },
  {
    key: "itemName",
    label: "ชื่อสิ่งของ",
  },
  {
    key: "borrowDate",
    label: "วันที่ยืม",
  },
  {
    key: "returnDate",
    label: "วันที่คืน",
  },
  {
    key: "borrowStatus",
    label: "สถานะการยืม",
  },
  {
    key: "imageURL",
    label: "รูปภาพการคืน",
  },
];

export default function BorrowHistory() {
  const [data, setData] = useState<BorrowLog[]>([])

  const fetchBorrowLog = async () => {
    const res = await apiClient.get("/v1/borrow/user")
    if (res.data !== null) {
      const borrowData: BorrowLog[] = res.data.map((element: any) => toBorrowLog(element))
      setData(borrowData)
    }
  }

  useEffect(() => {
    fetchBorrowLog()
  }, [])

  return <>
    <main className="flex flex-col justify-start items-center gap-10 mt-5 pt-5 mx-3.5">
      <div className="relative !gap !mt w-full flex flex-col justify-center items-center">
        <MovingCloudBG />
        <LogTable column={columns} title="ระบบยืมคืนสิ่งของ" description="ตารางบันทึกประวัติการยืมคืนสิ่งของ" data={data} />
      </div>
    </main>
  </>
}