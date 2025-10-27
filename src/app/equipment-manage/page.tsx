"use client";
import Image from "next/image";
import Link from "next/link";
import MovingCloudBG from "../../components/MovingCloudBG";
import ItemCard from "../../components/ItemCard";
import SearchBar from "@/src/components/SearchBar";
import { BookCheck, ClipboardPlus, History, Plus, Search } from "lucide-react";
import { Button } from "@heroui/button";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import Popup from "@/src/components/equipment-mange/CreatePopUp";
import { useEffect, useState } from "react";
import { apiClient } from "@/src/services/apiClient";
import { Item } from "@/src/types/item";
import { fetchItemDetail } from "@/src/utils/itemUtils";

export default function Home() {
  const [itemDetail, setItemDetail] = useState<Item[]>()
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const fetchItem = async (name: string, tag: string, status: string) => {
    const items = await fetchItemDetail(name, tag, status);
    setItemDetail(items);
  }

  // const fetchItemDetail = async () => {
  //   const url = `/v1/item/list`
  //   const res = await apiClient.get(url)
  //   const data = res.data
  //   var response: Item[] = data
  //   var items: Item[] = []
  //   console.log(response[0])
  //   for (let i = 0; i < response.length; i++) {
  //     const item: Item = {
  //       itemID: data[i]["id"],
  //       itemName: data[i]["name"],
  //       itemDescription: data[i]["desc"],
  //       itemPictureURL: data[i]["picture_url"],
  //       itemStatus: data[i]["status"],
  //       itemQuantity: data[i]["quantity"],
  //       itemCurrentQuantity: data[i]["current_quantity"],
  //       createdAt: new Date(data[i]["created_at"]),
  //       updatedAt: new Date(data[i]["updated_at"])
  //     }
  //     items.push(item)
  //   }
  //   setItemDetail(items)
  // }

  useEffect(() => {
    fetchItem("", "", "")
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
            <div className="flex-1 flex flex-col justify-center items-center gap-5">
              <SearchBar
                rightChildren={
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
                }
                onSearch={({ name, tag, status }) => fetchItem(name ?? "", tag ?? "", status ?? "")}
                children={
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
                      href="/equipment-manage/all-borrow-log"
                      className=""
                    >
                      <div className="p-3 rounded-xl bg-primary flex items-center justify-center hover:scale-90 transition-all active:scale-100 text-white gap-3 w-full">
                        <History />
                        <p className="">ตรวจสอบประวัติการยืม</p>
                      </div>
                    </Link>
                  </div>

                }>
              </SearchBar>
              {itemDetail?.length === 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-65 gap-y-25 pb-10 items-center">
                  <div></div>
                  <div className="flex flex-col justify-center items-center gap-5 col-span-1 sm:col-span-2 lg:col-span-3 z-10">
                    <img
                      src="/images/item_not_found.png"
                      alt="No items found"
                      width={500}
                      height={500}
                    ></img>
                  </div>
                </div>
              )
              }
            </div>
            <Popup isOpen={isOpen} onOpen={onOpen} onOpenChange={onOpenChange} fetchItemDetails={() => {
              fetchItem("", "", "")
            }} />
          </div>



          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-25 pb-10 items-center">
            {itemDetail?.map((index) => (
              <ItemCard
                key={index.itemID}
                id={index.itemID}
                name={index.itemName}
                image={index.itemPictureURL}
                amount={index.itemQuantity}
                status={index.itemStatus}
                prePage={"equipment-manage"}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
