"use client";
import Image from "next/image";
import Link from "next/link";
import MovingCloudBG from "@/src/components/MovingCloudBG";
import ItemCard from "@/src/components/ItemCard";
import SearchBar from "@/src/components/SearchBar";
import { Undo2 } from "lucide-react";

export default function Home() {
  const data: { id: string; status: string; amount: number }[] = [
    { id: "Router", status: "Due 2025/10/11", amount: 7 },
    { id: "RJ45", status: "Due 2025/10/11", amount: 0 },
    { id: "Mac Mini", status: "Due 2025/10/08", amount: 0 },
  ];
  return (
    <main className="flex flex-col justify-start items-center gap-20 mt-5 pt-5">
      <div className="relative min-h-screen !gap !mt w-full flex flex-col justify-start items-center">
        <MovingCloudBG />
        <div className="flex flex-col justify-start items-center gap-20 mt-5">
          <div className="flex flex-col justify-start justify-items-center sm:justify-items-start items-center sm:items-start text-center gap-5 ">
            <h3 className="text-3xl sm:text-3xl md:text-4xl font-bold">
              <span className="">ระบบยืม-คืนสิ่งของ </span>
              <br></br>
              <span className="text-2xl font-semibold">การยืมของฉัน </span>
            </h3>
          </div>

          <SearchBar>
            <Link
              href="/borrow-return"
              className="absolute left-0 h-12 px-4 gap-2 rounded-full bg-[rgb(255,225,106)] border-black border flex items-center justify-center text-[rgb(1,51,82)] font-[400] text-[16px] hover:scale-90 hover:bg-black hover:text-white transition-all"
            >
              <Undo2></Undo2>
              ถอยหลัง
            </Link>
          </SearchBar>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-65 gap-y-25 pb-10 items-center">
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
