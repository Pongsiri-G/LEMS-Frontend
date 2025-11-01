"use client"
import BackButton from "@/src/components/BackButton";
import LogTable from "@/src/components/borrow-history/LogTable";
import MovingCloudBG from "@/src/components/MovingCloudBG";
import { apiClient } from "@/src/services/apiClient";
import { BorrowLogAdmin, toBorrowLogAdmin } from "@/src/types/borrow-log";
import { Log, toLog } from "@/src/types/log";
import { getKeyValue, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { useEffect, useState } from "react";

const columns = [
  {
    key: "userName",
    label: "ชื่อผู้ใช้",
  },
  {
    key: "borrowID",
    label: "borrow id",
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
export default function AllBorrowLog() {
  const [log, setLog] = useState<BorrowLogAdmin[]>([])

  const fetchAllLog = async () => {
    const res = await apiClient.get("/v1/borrows")
    if (res.data !== null) {
      const newLog: BorrowLogAdmin[] = res.data.map((e: any) => {
        return toBorrowLogAdmin(e)
      })
      console.log(res.data)
      setLog(newLog)
    }
  }

  useEffect(() => {
    fetchAllLog()
  }, [])


  return <>
    <main className="flex flex-col justify-start items-center gap-10 mt-5 pt-5">
      <div className="relative !gap !mt w-full flex flex-col justify-center items-center">
        <MovingCloudBG />
        <LogTable data={log} column={columns} title="ระบบจัดการสิ่งของ" description="ตารางบันทึกประวัติการยืมคืนทั้งหมดในระบบ" />
      </div>
    </main>
  </>
}