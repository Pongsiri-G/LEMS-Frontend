"use client";
import Image from "next/image";
import Link from "next/link";
import MovingCloudBG from "../../components/MovingCloudBG";
import ItemCard from "../../components/ItemCard";
import SearchBar from "@/src/components/SearchBar";

export default function Home() {
  const data: { id: string; status: string, amount: number}[] = [
    { id: "Nvidia RTX5090", status: "Available", amount: 10},
    { id: "Router", status: "Available", amount: 7 },
    { id: "Raspberry Pi", status: "Disappeared", amount: 0 },
    { id: "RJ45", status: "In use - Due 2025/10/11" , amount: 0},
    { id: "360 Camera", status: "Available", amount: 1 },
    { id: "Fundmentals of Artificial Intelligence Books", status: "Available" , amount: 13},
    { id: "Mac Mini", status: "In use - Due 2025/10/08" , amount: 0},
    { id: "USB Hub", status: "Disappeared" , amount: 0},
  ];
  return (
    <main className="flex flex-col justify-start items-center gap-20 mt-5 pt-5">
      <div className="relative min-h-screen !gap !mt w-full flex flex-col justify-start items-center">
        <MovingCloudBG />
        <div className="flex flex-col justify-start items-center gap-20 mt-5">
          <div className="flex flex-col justify-start justify-items-center sm:justify-items-start items-center sm:items-start text-center gap-5 ">
            <h3 className="text-3xl sm:text-3xl md:text-4xl font-bold">
              <span className="">ระบบยืม-คืนสิ่งของ </span>
              {/* <span className="text-[#00A3F7]">CNC </span> */}
            </h3>
          </div>

          <SearchBar />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-65 gap-y-25 pb-10 items-center">
            {/* <ItemCard id="test" setShowPopup={()=>{}} showPopup={false} setID={()=>{}}/> */}
            {data.map((index) => (
              <ItemCard
                key={index.id}
                id={index.id}
                amount={index.amount}
                status={index.status}
                setShowPopup={() => {}}
                showPopup={false}
                setID={() => {}}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
