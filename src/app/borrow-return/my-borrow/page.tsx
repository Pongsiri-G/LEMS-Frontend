"use client";
import Link from "next/link";
import MovingCloudBG from "@/src/components/MovingCloudBG";
import ItemCard from "@/src/components/ItemCard";
import SearchBar from "@/src/components/SearchBar";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchItemDetail } from "@/src/utils/itemUtils";
import BackButton from "@/src/components/BackButton";
import { useWebSocketNotifications } from "@/src/hook/useWebSocketNotifications";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store";
import { Item } from "@/src/types/item";

export default function Home() {
  const [itemDetail, setItemDetail] = useState<Item[]>()


  useWebSocketNotifications();

  const fetchItem = async (name: string, tag: string, status: string) => {
    const items = await fetchItemDetail(name, tag, status, "borrowed");
    setItemDetail(items);
  }

  useEffect(() => {
    fetchItem("", "", "")
  }, [])
  return (
    <main className="flex flex-col justify-start items-start gap-10 mt-5 pt-5">
      <MovingCloudBG />
      <div className="relative !gap !mt w-full flex flex-col justify-start items-center max-w-[1500px] mx-auto">
        <div className="w-full">
          <BackButton />
        </div>
        <div className="flex flex-col justify-start items-center gap-10 mt-5">
          <div className="flex flex-col justify-start justify-items-center sm:justify-items-start items-center sm:items-start text-center gap-5 ">
            <h3 className="text-3xl sm:text-3xl md:text-4xl ">
              <span className="font-bold">ระบบยืม-คืนสิ่งของ </span>
              <br></br>
              <span className="text-2xl">การยืมของฉัน </span>
            </h3>
          </div>

          <SearchBar onSearch={({ name, tag, status }) => fetchItem(name ?? "", tag ?? "", status ?? "")}>
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
            {itemDetail?.map((e, index) => (
              <ItemCard
                key={index}
                item={e}
                prePage="my-borrow"
                borrowID={"haha"}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
