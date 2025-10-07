"use client";
import Image from "next/image";
import Link from "next/link";
import MovingCloudBG from "../../components/MovingCloudBG";
import ItemCard from "../../components/ItemCard";
import SearchBar from "@/src/components/SearchBar";
import { ClipboardPlus, Plus } from "lucide-react";
import { Button } from "@heroui/button";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import Popup from "@/src/components/equipment-mange/CreatePopUp";

export default function Home() {

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
    <main className="flex flex-col justify-start items-center gap-20 mt-5 pt-5">
      <div className="relative min-h-screen !gap !mt w-full flex flex-col justify-start items-center">
        <MovingCloudBG />
        <div className="flex flex-col justify-start items-center gap-20 mt-5">
          <div className="flex flex-col justify-start justify-items-center sm:justify-items-start items-center sm:items-start text-center gap-5 ">
            <h3 className="text-3xl sm:text-3xl md:text-4xl font-bold">
              <span className="">ระบบจัดการสิ่งของ </span>
            </h3>
          </div>

          <div className="flex w-full justify-between items-center px-10 mb-[-5rem]">
            <Button
              as={Link}
              href="/equipment-manage/equipment-log"
              radius="full"
              className="
            rounded-full
            bg-[rgb(255,225,106)] border-black border
            flex items-center justify-center
            text-[rgb(1,51,82)] font-[400] text-[16px]
            hover:scale-90 hover:bg-black hover:text-white
            transition-all gap-2
            px-4
            "
            >
              <ClipboardPlus />
              <span className="hidden lg:inline">ดูบันทึกการจัดการสิ่งของ</span>
            </Button>
            <Button
              color="primary"
              className="text-[16px]
            hover:scale-90 hover:bg-black hover:text-white
            transition-all"
              onPress={onOpen}
            >
              <Plus color="white" />
              <span className="hidden lg:inline">เพิ่มสิ่งของ</span>
            </Button>
            <Popup isOpen={isOpen} onOpen={onOpen} onOpenChange={onOpenChange} />
          </div>
          <SearchBar />



          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-65 gap-y-25 pb-10 items-center">
            {data.map((index) => (
              <ItemCard
                key={index.id}
                id={index.id}
                amount={index.amount}
                status={index.status}
                setShowPopup={() => { }}
                showPopup={false}
                setID={() => { }}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
