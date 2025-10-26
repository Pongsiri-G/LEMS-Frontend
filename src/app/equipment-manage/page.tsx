"use client";
import Image from "next/image";
import Link from "next/link";
import MovingCloudBG from "../../components/MovingCloudBG";
import ItemCard from "../../components/ItemCard";
import SearchBar from "@/src/components/SearchBar";
import { ClipboardPlus, History, Plus, Search } from "lucide-react";
import { Button } from "@heroui/button";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import Popup from "@/src/components/equipment-mange/CreatePopUp";
import { useEffect, useState } from "react";
import { apiClient } from "@/src/services/apiClient";

export default function Home() {
  const [itemDetail, setItemDetail] = useState<Item[]>()
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const fetchItemDetail = async () => {
    const url = `/v1/item/list`
    const res = await apiClient.get(url)
    const data = res.data
    var response: Item[] = data
    var items: Item[] = []
    console.log(response[0])
    for (let i = 0; i < response.length; i++) {
      const item: Item = {
        itemID: data[i]["id"],
        itemName: data[i]["name"],
        itemDescription: data[i]["desc"],
        itemPictureURL: data[i]["picture_url"],
        itemStatus: data[i]["status"],
        itemQuantity: data[i]["quantity"],
        itemCurrentQuantity: data[i]["current_quantity"],
        createdAt: new Date(data[i]["created_at"]),
        updatedAt: new Date(data[i]["updated_at"])
      }
      items.push(item)
    }
    setItemDetail(items)
  }

  useEffect(() => {
    fetchItemDetail()
  }, [])

  const data: { id: string; status: string; amount: number }[] = [
    { id: "Nvidia RTX5090", status: "Available", amount: 10 },
    { id: "Router", status: "Available", amount: 7 },
    { id: "Raspberry Pi", status: "Disappeared", amount: 0 },
    { id: "RJ45", status: "In use - Due 2025/10/11", amount: 0 },
    { id: "360 Camera", status: "Available", amount: 1 },
    {
      id: "Fundmentals of Artificial Intelligence Books",
      status: "Available",
      amount: 13,
    },
    { id: "Mac Mini", status: "In use - Due 2025/10/08", amount: 0 },
    { id: "USB Hub", status: "Disappeared", amount: 0 },
  ];
  return (
    <main className="flex flex-col justify-start items-center gap-10 mt-5 pt-5">
      <div className="relative !gap !mt w-full flex flex-col justify-start items-center max-w-[1300px]">
        <MovingCloudBG />
        <div className="flex flex-col justify-start items-center gap-10 mt-5">
          <div className="flex flex-col justify-start justify-items-center sm:justify-items-start items-center sm:items-start text-center gap-5 ">
            <h3 className="text-3xl sm:text-3xl md:text-4xl font-bold">
              <span className="">ระบบจัดการสิ่งของ </span>
            </h3>
          </div>

          <div className="flex w-full justify-between items-start gap-5">
            <div className="flex flex-col gap-4">
              <Button
                as={Link}
                href="/equipment-manage/equipment-log"
                className="
            rounded-xl
            bg-primary  
            flex items-center justify-center
            text-white 
            hover:scale-90 
            transition-all gap-2
            p-6 text-[16px]
            w-fit
            "
              >
                <ClipboardPlus />
                <span className="hidden lg:inline">ดูบันทึกการจัดการสิ่งของ</span>
              </Button>
              <Link
                href="/borrow-return/my-borrow"
                className=""
              >
                <div className="p-3 rounded-xl bg-primary flex items-center justify-center hover:scale-90 transition-all active:scale-100 text-white gap-3 w-full">
                  <History />
                  <p className="">ตรวจสอบประวัติการยืม</p>
                </div>
              </Link>
            </div>
            <div className="flex-1 flex flex-col justify-center items-center gap-5">
              <div className="relative w-full max-w">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="ค้นหา..."
                  className="w-full h-12 pl-10 pr-4 border rounded-full text-start outline-none border-neutral-300 focus:border-neutral bg-background"
                />
              </div>
              <button className="z-10 h-10 px-6 w-45 rounded-full  text-foreground font-[400] text-[16px] cursor-pointer hover:scale-90 transition-all flex items-center justify-center active:scale-100 border-neutral border-1 backdrop-blur-2xl">
                ค้นหา
              </button>
            </div>
            <Button
              color="primary"
              className="text-[16px]
              p-6
            hover:scale-90 
            transition-all"
              onPress={onOpen}
            >
              <Plus color="white" />
              <span className="hidden lg:inline">เพิ่มสิ่งของ</span>
            </Button>
            <Popup isOpen={isOpen} onOpen={onOpen} onOpenChange={onOpenChange} />
          </div>



          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-25 pb-10 items-center">
            {itemDetail?.map((index) => (
              <ItemCard
                key={index.itemID}
                id={index.itemID}
                name={index.itemName}
                image={index.itemPictureURL}
                amount={index.itemQuantity}
                status={index.itemStatus}
                setShowPopup={() => { }}
                showPopup={false}
                setID={() => { } }
                />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
