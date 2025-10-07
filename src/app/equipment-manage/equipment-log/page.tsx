"use client"
import MovingCloudBG from "@/src/components/MovingCloudBG";
import { Button, getKeyValue, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
const rows = [
  {
    log_id: "1",
    user_id: "Tony Reichert",
    log_type: "CEO",
    log_message: "Active",
    created_at: "Active",
  },
  {
    log_id: "2",
    user_id: "Tony Reichert",
    log_type: "CEO",
    log_message: "Active",
    created_at: "Active",
  },
  {
    log_id: "3",
    user_id: "Tony Reichert",
    log_type: "CEO",
    log_message: "Active",
    created_at: "Active",
  },
  {
    log_id: "4",
    user_id: "Tony Reichert",
    log_type: "CEO",
    log_message: "Active",
    created_at: "Active",
  },
];

const columns = [
  {
    key: "log_id",
    label: "Log ID",
  },
  {
    key: "user_id",
    label: "User ID",
  },
  {
    key: "log_type",
    label: "Log Type",
  },
  {
    key: "log_message",
    label: "Log message",
  },
  {
    key: "created_at",
    label: "Create at",
  },
];
export default function EquipmentLog() {
  return <>
    <main className="flex flex-col justify-start items-center gap-20">
      <div className="relative !gap !mt w-full flex flex-col justify-center items-center">
        <MovingCloudBG />
        <div className="mt-5 w-full max-w-[1300px] px-10">
          <Button as={Link} href="/equipment-manage" variant="bordered" className="w-fit hover:scale-95 transition-all">
            <div className="flex gap-3 items-center justify-center">
              <ArrowLeft />
              <p>ย้อนกลับ</p>
            </div>
          </Button>
          <h3 className="text-3xl sm:text-3xl md:text-4xl font-bold w-full text-center">
            <span className="">ระบบจัดการสิ่งของ </span>
          </h3>
          <div className="flex flex-col gap-6 w-full mt-4">
            <h3 className="w-full text-xl  text-center">
              ตารางบันทึกประวัติการจัดการสิ่งของ
            </h3>
            <Table aria-label="Example table with dynamic content" className="w-full">
              <TableHeader columns={columns}>
                {columns.map((column) => (
                  <TableColumn key={column.key} className="text-md">{column.label}</TableColumn>
                ))}
              </TableHeader>
              <TableBody
                items={rows}
                emptyContent={"No logs to display."}>
                {(item) => (
                  <TableRow key={item.log_id} className="hover:bg-neutral-100 transition-all cursor-default rounded-xl">
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