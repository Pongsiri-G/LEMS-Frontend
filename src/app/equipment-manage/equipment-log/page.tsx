"use client"
import BackButton from "@/src/components/BackButton";
import MovingCloudBG from "@/src/components/MovingCloudBG";
import { useWebSocketNotifications } from "@/src/hook/useWebSocketNotifications";
import { apiClient } from "@/src/services/apiClient";
import { Log, toLog } from "@/src/types/log";
import { getKeyValue, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { useEffect, useState } from "react";

const columns = [
  {
    key: "createAt",
    label: "สร้างเมื่อ",
  },
  {
    key: "logID",
    label: "log id",
  },
  {
    key: "logType",
    label: "ประเภทของ log",
  },
  {
    key: "message",
    label: "ข้อความ",
  },
  {
    key: "userID",
    label: "user id",
  },
  {
    key: "userName",
    label: "ชื่อผู้ใช้",
  },
];
export default function AllLog() {
  const [log, setLog] = useState<Log[]>([])

  useWebSocketNotifications();

  const fetchAllLog = async () => {
    const res = await apiClient.get("/v1/admin/logs")
    const newLog: Log[] = res.data.map((e: any) => {
      return toLog(e)
    })
    console.log(newLog)
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
              ตารางบันทึกประวัติการจัดการสิ่งของ
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
                  <TableRow key={item.logID} className="hover:bg-neutral-100 transition-all cursor-default rounded-xl">
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