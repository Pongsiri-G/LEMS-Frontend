"use client";
import Link from "next/link";
import MovingCloudBG from "../../components/MovingCloudBG";
import ItemCard from "../../components/ItemCard";
import SearchBar from "@/src/components/SearchBar";
import { History, Plus } from "lucide-react";
import { Button } from "@heroui/button";

import { useDisclosure } from "@heroui/modal";
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

  const deleteItem = async (itemID: string) => {
    const res = await apiClient.delete(`/v1/item/${itemID}`)
    fetchItem("", "", "")
  }


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
    <main className="flex flex-col justify-start items-center gap-10 mt-5 pt-5 mx-5">
      <div className="relative !gap !mt w-full flex flex-col justify-start items-center max-w-[1300px]">
        <MovingCloudBG />
        <div className="flex flex-col justify-start items-center gap-10 mt-5 w-full">
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
                    className="text-[16px] p-6 hover:scale-90 transition-all"
                    onPress={onOpen}
                  >
                    <Plus color="white" />
                    <span className="hidden lg:inline">เพิ่มสิ่งของ</span>
                  </Button>
                }
                onSearch={({ name, tag, status }) =>
                  fetchItem(name ?? "", tag ?? "", status ?? "")
                }
              >
                <div className="flex flex-col gap-4">
                  <Link href="/equipment-manage/all-borrow-log">
                    <div className="p-3 rounded-xl bg-primary flex items-center justify-center hover:scale-90 transition-all active:scale-100 text-white gap-3 w-full">
                      <History />
                      <p className="hidden lg:inline">ตรวจสอบประวัติการยืม</p>
                    </div>
                  </Link>
                </div>
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



          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4  lg:grid-cols-3 gap-x-10 gap-y-10 pb-10 items-center mt-5">
            {itemDetail?.map((index) => (
              <ItemCard
                key={index.itemID}
                item={index}
                prePage={"equipment-manage"}
                deleteItem={deleteItem}
                fetchItem={fetchItem}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
