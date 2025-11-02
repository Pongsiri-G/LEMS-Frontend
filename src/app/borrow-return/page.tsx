"use client";
import Image from "next/image";
import Link from "next/link";
import MovingCloudBG from "../../components/MovingCloudBG";
import ItemCard from "../../components/ItemCard";
import SearchBar from "@/src/components/SearchBar";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import { BookCheck, History } from "lucide-react";
import { apiClient } from "@/src/services/apiClient";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchItemDetail } from "@/src/utils/itemUtils";
import { useRoleGuard } from "@/src/hook/useRoleGuard";
import { Item } from "@/src/types/item";
import { useWebSocketNotifications } from "@/src/hook/useWebSocketNotifications";

export default function Home() {

  const [itemDetail, setItemDetail] = useState<Item[]>()

  // useWebSocketNotifications()
  
  const fetchItem = async (name: string, tag:string, status:string) => {
    const items = await fetchItemDetail(name, tag, status);
    setItemDetail(items);
  }

  const canRender = useRoleGuard(["USER", "ADMIN"])

  useEffect(() => {
    if (!canRender) return; 
    fetchItem("", "", "")
  }, [])

  if (!canRender) return null 
  
  return (
    <ProtectedRoute>
    <main className="flex flex-col justify-start items-center gap-10 pt-5 mt-5">
      <div className="relative !gap !mt w-full flex flex-col justify-start items-center max-w-[1500px]">
        <MovingCloudBG />
        <div className="flex flex-col justify-start items-center gap-10 mt-5">
          <div className="flex flex-col justify-start justify-items-center sm:justify-items-start items-center sm:items-start text-center gap-5 ">
            <h3 className="text-3xl sm:text-3xl md:text-4xl font-bold">
              <span className="">ระบบยืม-คืนสิ่งของ </span>
            </h3>
          </div>

          <SearchBar onSearch={({name, tag, status}) => fetchItem(name ?? "", tag ?? "", status ?? "")}>
            <div className="flex flex-row gap-2">
              <Link
                href="/borrow-return/my-borrow"
                className="h-12 w-40 px-4 rounded-full bg-primary flex items-center justify-center hover:scale-90 transition-all active:scale-100 text-white"
              >
                <div className="flex justify-center items-center gap-3">
                  <BookCheck />
                  <p className="sm:text-[14px]">การยืมของฉัน</p>
                </div>
              </Link>
              <Link
                href="/borrow-return/borrow-history"
                className=""
              >
                <div className="p-3 rounded-full bg-primary flex items-center justify-center hover:scale-90 transition-all h-12 w-40 active:scale-100 text-white w-fit gap-3">
                  <History />
                  <p className="sm:text-[14px]">ตรวจสอบประวัติการยืม</p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-25 pb-10 items-center">
            {itemDetail?.map((index) => (
              <ItemCard
                key={index.itemID}
                item={index}
                prePage={"borrow-return"}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
    </ProtectedRoute>
  );
}
