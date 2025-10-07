"use client";
import Image from "next/image";
import Link from "next/link";
import MovingCloudBG from "../../components/MovingCloudBG";
import ItemCard from "../../components/ItemCard";
import SearchBar from "@/src/components/SearchBar";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import { BookCheck } from "lucide-react";

export default function Home() {
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
    <ProtectedRoute>
      <main className="flex flex-col justify-start items-center gap-20 pt-5">
        <div className="relative !gap !mt w-full flex flex-col justify-start items-center">
          <MovingCloudBG />
          <div className="flex flex-col justify-start items-center gap-20 mt-5">
            <div className="flex flex-col justify-start justify-items-center sm:justify-items-start items-center sm:items-start text-center gap-5 ">
              <h3 className="text-3xl sm:text-3xl md:text-4xl font-bold">
                <span className="">ระบบยืม-คืนสิ่งของ </span>
              </h3>
            </div>

            <SearchBar>
              <Link
                href="/borrow-return/my-borrow"
                className="absolute left-0 h-12 px-4 rounded-full bg-primary flex items-center justify-center hover:scale-90 transition-all active:scale-100 text-white"
              >
                <div className="flex justify-center items-center gap-3">
                  <BookCheck />
                  <p className="">การยืมของฉัน</p>
                </div>
              </Link>
            </SearchBar>

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
    </ProtectedRoute>
  );
}
