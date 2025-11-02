"use client"
import BackButton from "@/src/components/BackButton";
import { apiClient } from "@/src/services/apiClient";
import { BorrowLog, toBorrowLog } from "@/src/types/borrow-log";
import { Button, getKeyValue, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from "@heroui/react";
import { useEffect, useState } from "react";
import ShowImagePopup from "./ShowImagePopup";
interface LogTableProps<T> {
  column: { key: string, label: string }[]
  title: string
  description: string
  data: T[]
}

export default function LogTable<T>(props: LogTableProps<T>) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [targetImageURL, setTargetImageURL] = useState("")



  const handdleShowImageReturn = (url: string) => {
    setTargetImageURL(url)
    onOpen()
  }

  return (
    <div className="mt-5 w-full max-w-[1300px] px-10">
      <ShowImagePopup imageURL={targetImageURL} isOpen={isOpen} onOpenChange={onOpenChange} key={targetImageURL} />
      <BackButton />
      <h3 className="text-3xl sm:text-3xl md:text-4xl font-bold w-full text-center mt-5">
        <span className="">{props.title} </span>
      </h3>
      <div className="flex flex-col gap-6 w-full mt-4">
        <h3 className="w-full text-xl  text-center">
          {props.description}
        </h3>
        <Table aria-label="Example table with dynamic content" className="w-full">
          <TableHeader columns={props.column}>
            {props.column.map((column) => (
              <TableColumn key={column.key} className="text-md">{column.label}</TableColumn>
            ))}
          </TableHeader>
          <TableBody
            items={props.data}
            emptyContent={"ไม่มีประวัติที่สามารถแสดงได้."}>
            {(item) => (
              <TableRow key={(item as any).borrowID} className="hover:bg-neutral-100 transition-all cursor-default rounded-xl">
                {(columnKey) =>
                  <TableCell className="text-md">{
                    columnKey === "imageURL" ?
                      <>
                        <Button variant="bordered" onPress={() => {
                          handdleShowImageReturn((item as any).imageURL)
                        }}>ดูรูปภาพการคืน</Button>
                      </>
                      :
                      getKeyValue(item, columnKey)
                  }</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>

  )
}