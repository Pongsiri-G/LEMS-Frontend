"use client";
import Image from "next/image";
import Link from "next/link";
import MovingCloudBG from "@/src/components/MovingCloudBG";
import ItemCard from "@/src/components/ItemCard";
import SearchBar from "@/src/components/SearchBar";
import { ArrowLeft, Undo2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiClient } from "@/src/services/apiClient";
import ItemDetails from "@/src/components/item-details/ItemDetails";
import BackButton from "@/src/components/BackButton";
import { useWebSocketNotifications } from "@/src/hook/useWebSocketNotifications";

export default function Home() {
  const [itemDetail, setItemDetail] = useState<Item[]>()

  const param = useParams();

  useWebSocketNotifications();

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
  return (
    <main className="flex flex-col justify-start items-start gap-10 mt-5 pt-5">
      <MovingCloudBG />
      <div className="relative !gap !mt w-full flex flex-col justify-start items-center max-w-[1300px] mx-auto">
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

          <SearchBar>
          </SearchBar>

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
                setID={() => { }}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
