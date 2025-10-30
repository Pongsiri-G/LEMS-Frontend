"use client"
import BackButton from "@/src/components/BackButton";
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
];
export default function AllBorrowLog() {
  const [log, setLog] = useState<BorrowLogAdmin[]>([])

  const fetchAllLog = async () => {
    const res = await apiClient.get("/v1/borrows")
    const newLog: BorrowLogAdmin[] = res.data.map((e: any) => {
      return toBorrowLogAdmin(e)
    })
    console.log(res.data)
    setLog(newLog)
  }

  useEffect(() => {
    fetchAllLog()
  }, [])


  return <>
    <main className="flex flex-col justify-start items-center gap-10 mt-5 pt-5">
      <div className="relative !gap !mt w-full flex flex-col justify-center items-center">
        <MovingCloudBG />
        <div className="mt-5 w-full max-w-[1300px] px-10">
          <BackButton />
          <h3 className="text-3xl sm:text-3xl md:text-4xl font-bold w-full text-center">
            <span className="">ระบบจัดการสิ่งของ</span>
          </h3>
          <div className="flex flex-col gap-6 w-full mt-4">
            <h3 className="w-full text-xl  text-center">
              ตารางบันทึกประวัติการยืมคืนทั้งหมดในระบบ
            </h3>
            <Table aria-label="Example table with dynamic content" className="w-full mb-11">
              <TableHeader columns={columns}>
                {columns.map((column) => (
                  <TableColumn key={column.key} className="text-md">{column.label}</TableColumn>
                ))}
              </TableHeader>
              <TableBody
                items={log}
                emptyContent={"ไม่มีประวัติที่สามารถแสดงได้."}>
                {(item) => (
                  <TableRow key={item.borrowID} className="hover:bg-neutral-100 transition-all cursor-default rounded-xl">
                    {(columnKey) => <TableCell className="text-md">{getKeyValue(item, columnKey)}</TableCell>}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </main>
  </>
}