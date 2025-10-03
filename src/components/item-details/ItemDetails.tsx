"use client"
import clsx from "clsx";
import { Bell, NotebookTabs, Package, PackageOpen, X } from "lucide-react";
import { useState } from "react";
import ReturnItemPopup from "./ReturnItemPopup";

export default function ItemDetails() {
  const [isBorrow, setIsBorrow] = useState(true)
  const [returnPopupOpen, setReturnPopupOpen] = useState(false)
  return <>
    <div className="flex flex-col 2xl:flex-row gap-4 my-12 ">
      <ReturnItemPopup isOpen={returnPopupOpen} closePopup={() => { setReturnPopupOpen(false) }} />
      <div className="fixed right-0 top-1/2 -translate-y-1/2 flex flex-col gap-3.5 translate-x-[195px]">
        <button className="rounded-full bg-primary p-3 flex gap-4 text-white  hover:-translate-x-[165px] transition-all cursor-pointer active:scale-95 active:opacity-90">
          <NotebookTabs className="stroke-white" />
          <p className="select-none">ดูรายละเอียดอุปกรณ์</p>
        </button>
        <button className="rounded-full bg-primary p-3 pr-10 flex gap-4 text-white hover:-translate-x-[165px] transition-all cursor-pointer active:scale-95 active:opacity-90">
          <Bell className="stroke-white" />
          <p className="select-none">แจ้งเตือนเมื่อพร้อมให้ยืม</p>
        </button>
        <button className={clsx("rounded-full p-3 flex gap-4 text-white hover:-translate-x-[165px] transition-all cursor-pointer active:scale-95 active:opacity-90", {
          "bg-primary": !isBorrow,
          "bg-error": isBorrow
        })} onClick={() => {
          if (isBorrow) {
            setReturnPopupOpen(true)
          }
        }}>
          {isBorrow ? <>
            <PackageOpen className="stroke-white" />
            <p className="select-none">คืนของชิ้นนี้</p>
          </> :
            <>
              <Package className="stroke-white" />
              <p className="select-none">ยืมของชิ้นนี้</p>
            </>}
        </button>
      </div>
      <div className="flex 2xl:flex-col flex-row gap-4 overflow-y-auto scrollbar-hide max-h-[500px]">
        <img src={"/CPU.jpg"} className="max-w-[200px] w-full rounded-xl" />
        <img src={"/GPU.jpg"} className="max-w-[200px] w-full rounded-xl" />
        <img src={"/Cooling.jpg"} className="max-w-[200px] w-full rounded-xl" />
        <img src={"/CPU.jpg"} className="max-w-[200px] w-full rounded-xl" />
        <img src={"/GPU.jpg"} className="max-w-[200px] w-full rounded-xl" />
        <img src={"/Cooling.jpg"} className="max-w-[200px] w-full rounded-xl" />
      </div>
      <div className="flex xl:flex-row flex-col flex-1 gap-5 h-fit">
        <img src={"/CPU.jpg"} className="xl:max-w-[500px] h-fit flex-1 rounded-xl" />
        <div className="flex-1 gap-6 flex flex-col">
          <p className="text-2xl font-bold">ชื่อ: Expensive NVIDIA GPU for AI Training</p>
          <div className="flex gap-4">
            <div className="flex-1 bg-neutral-second p-4 rounded-xl h-fit">
              <p className="text-neutral">จำนวนทั้งหมด</p>
              <p className="text-xl font-bold">10 ชิ้น</p>
            </div>
            <div className="flex-1 bg-neutral-second p-4 rounded-xl h-fit">
              <p className="text-neutral">จำนวนคงเหลือ</p>
              <p className="text-xl font-bold">5 ชิ้น</p>
            </div>
          </div>
          <div className="flex-1 bg-neutral-second p-4 rounded-xl h-fit">
            <p className="text-neutral">ต้องยืมร่วมกับ</p>
            <p className="text-xl font-bold">None</p>
          </div>
          <div className="flex gap-3 flex-col justify-center">
            <p className="text-neutral">คำอธิบาย: </p>
            <p className="line-clamp-5">แลป network แต่มี GPU ไว้เทรน AI เล่นทำไมก็ไม่รู้ แต่รวยแลป network แต่มี GPU ไว้เทรน AI เล่นทำไมก็ไม่รู้ แต่รวยแลป network แต่มี GPU ไว้เทรน AI เล่นทำไมก็ไม่รู้ แต่รวยแลป network แต่มี GPU ไว้เทรน AI เล่นทำไมก็ไม่รู้ แต่รวยแลป network แต่มี GPU ไว้เทรน AI เล่นทำไมก็ไม่รู้ แต่รวยแลป network แต่มี GPU ไว้เทรน AI เล่นทำไมก็ไม่รู้ แต่รวยแลป network แต่มี GPU ไว้เทรน AI เล่นทำไมก็ไม่รู้ แต่รวยแลป network แต่มี GPU ไว้เทรน AI เล่นทำไมก็ไม่รู้ แต่รวยแลป network แต่มี GPU ไว้เทรน AI เล่นทำไมก็ไม่รู้ แต่รวยแลป network แต่มี GPU ไว้เทรน AI เล่นทำไมก็ไม่รู้ แต่รวย</p>
          </div>
          <div className="flex md:flex-row flex-col gap-10">
            <div className="flex gap-3 flex-col justify-center">
              <p className="text-neutral">สถานะ: </p>
              <p className="font-bold py-2 px-4 rounded-full bg-success text-white w-fit">Available</p>
            </div>
            <div className="flex flex-col gap-3 flex-1 ">
              <p className="text-neutral">Tag: </p>
              <div className="flex gap-3 flex-wrap">
                <div className="flex gap-2 justify-center items-center bg-neutral rounded-full w-fit px-4 py-2">
                  <p className="text-white">tags</p>
                  <X className="stroke-white" />
                </div>
                <div className="flex gap-2 justify-center items-center bg-neutral rounded-full w-fit px-4 py-2">
                  <p className="text-white">tags</p>
                  <X className="stroke-white" />
                </div>
                <div className="flex gap-2 justify-center items-center bg-neutral rounded-full w-fit px-4 py-2">
                  <p className="text-white">tags</p>
                  <X className="stroke-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
}