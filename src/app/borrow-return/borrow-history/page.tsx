"use client"
import BackButton from "@/src/components/BackButton";
import MovingCloudBG from "@/src/components/MovingCloudBG";
import { apiClient } from "@/src/services/apiClient";
import { BorrowLog } from "@/src/types/borrow-log";
import { formatThaiDate } from "@/src/utils/FormatDate";
import { getKeyValue, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
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
];
export default function BorrowHistory() {
  const [borrowLog, setBorrowLog] = useState<BorrowLog[]>([])

  const fetchBorrowLog = async () => {
    const res = await apiClient.get("/v1/borrow/user")
    const data = res.data
    const borrowData: BorrowLog[] = res.data.map((element: any) => {
      return {
        borrowID: element["borrow_id"],
        itemName: element["item_name"],
        borrowDate: formatThaiDate(element["borrow_date"]),
        returnDate: formatThaiDate(element["return_date"]),
        borrowStatus: element["borrow_status"],
      }
    })
    console.log(borrowData)
    setBorrowLog(borrowData)
  }

  useEffect(() => {
    fetchBorrowLog()
  }, [])

  return <>
    <main className="flex flex-col justify-start items-center gap-10 mt-5 pt-5">
      <div className="relative !gap !mt w-full flex flex-col justify-center items-center">
        <MovingCloudBG />
        <div className="mt-5 w-full max-w-[1300px] px-10">
          <BackButton />
          <h3 className="text-3xl sm:text-3xl md:text-4xl font-bold w-full text-center">
            <span className="">ระบบยืมคืนสิ่งของ </span>
          </h3>
          <div className="flex flex-col gap-6 w-full mt-4">
            <h3 className="w-full text-xl  text-center">
              ตารางบันทึกประวัติการจัดยืมคืนสิ่งของ
            </h3>
            <Table aria-label="Example table with dynamic content" className="w-full">
              <TableHeader columns={columns}>
                {columns.map((column) => (
                  <TableColumn key={column.key} className="text-md">{column.label}</TableColumn>
                ))}
              </TableHeader>
              <TableBody
                items={borrowLog}
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