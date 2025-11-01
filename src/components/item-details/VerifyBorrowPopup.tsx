"use client"
import { useState } from "react";
import clsx from "clsx";
import { Paperclip, Upload, X } from "lucide-react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { apiClient } from "@/src/services/apiClient";
import { useToast } from "@/src/hook/ToastContext";
import { useRouter } from "next/navigation";
import { Item } from "@/src/types/item";

interface VerifyBorrowPopup {
  isOpen: boolean
  closePopup: () => void
  itemName: string | undefined
  itemID: string | undefined
  itemChild: Item[] | undefined
}

export default function VerifyBorrowPopup({ isOpen, closePopup, itemName, itemID, itemChild }: VerifyBorrowPopup) {
  const { showToast } = useToast()
  const router = useRouter()

  const handdleBorrowItem = async () => {
    console.log({ ItemID: itemID })
    try {
      if (itemID !== undefined) {
        const res = await apiClient.post("/v1/borrow", {
          item_id: itemID
        })
        console.log(res.data)
        showToast(`ยืม ${itemName} สำเร็จ`, "success")
        router.replace("/borrow-return")
      }
    } catch (e: any) {
      showToast(e.response.data.message, "error")
    } finally {
      closePopup()
    }
  }

  return <>
    <div className={clsx("bg-foreground/35 fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center z-30 transition-all", {
      "opacity-0 pointer-events-none": !isOpen
    })}>
      <div className={clsx("transition-all bg-white w-full h-fit max-w-[500px] max-h-[100vh] rounded-xl flex flex-col p-6 gap-3 relative", {
        "scale-90": !isOpen
      })}
      >
        <p className="text-large font-bold">หากยืมอุปกรณ์ {itemName} จะยืมอุปกรณ์ต่อไปนี้โดยปริยาย</p>
        <div className="flex overflow-x-auto p-4 justify-center">
          {
            itemChild !== undefined && itemChild.length !== 0 ? itemChild.map((element) => {
              return (
                <Card className="py-4 max-w-[200px]" key={element.itemID}>
                  <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                    <h4 className="text-small">{element.itemName}</h4>
                  </CardHeader>
                  <CardBody className="overflow-visible py-2">
                    <img
                      alt="Card background"
                      className="object-cover rounded-xl"
                      src={element.itemPictureURL}
                      width={270}
                    />
                  </CardBody>
                </Card>
              )
            })
              :
              <div>
                ไม่พบอุปกรณ์ที่ต้องยืมร่วมกัน
              </div>
          }
        </div>
        <div className="w-full max-w-[500px] flex gap-5">
          <Button className="bg-primary text-white flex-1 hover:scale-95 active:scale-100 transition-all" onClick={() => { }} onPress={() => {
            handdleBorrowItem()
          }}>
            <p>ยืนยัน</p>
          </Button>
          <Button className="flex-1 hover:scale-95 active:scale-100 transition-all border border-neutral bg-white" onClick={() => { }} onPress={() => {
            closePopup()
          }}>
            <p>ยกเลิก</p>
          </Button>
        </div>
      </div>
    </div>
  </>
}