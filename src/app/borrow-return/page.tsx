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
import { useRoleGuard } from "@/src/hook/useRoleGuard";

export default function Home() {
  // const data: { id: string; status: string; amount: number }[] = [
  //   { id: "Nvidia RTX5090", status: "Available", amount: 10 },
  //   { id: "Router", status: "Available", amount: 7 },
  //   { id: "Raspberry Pi", status: "Disappeared", amount: 0 },
  //   { id: "RJ45", status: "In use - Due 2025/10/11", amount: 0 },
  //   { id: "360 Camera", status: "Available", amount: 1 },
  //   {
  //     id: "Fundmentals of Artificial Intelligence Books",
  //     status: "Available",
  //     amount: 13,
  //   },
  //   { id: "Mac Mini", status: "In use - Due 2025/10/08", amount: 0 },
  //   { id: "USB Hub", status: "Disappeared", amount: 0 },
  // ]; 

  const [itemDetail, setItemDetail] = useState<Item[]>()

  const param = useParams()

  const canRender = useRoleGuard(["USER", "ADMIN"])

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
        updatedAt: new Date(data[i]["updated_at"]),
      }
      items.push(item)
    }
    setItemDetail(items)
  }

  useEffect(() => {
    if (!canRender) return; 
    fetchItemDetail()
  }, [])

  if (!canRender) return null 
  
  return (
    <main className="flex flex-col justify-start items-center gap-10 pt-5 mt-5">
      <div className="relative !gap !mt w-full flex flex-col justify-start items-center max-w-[1500px]">
        <MovingCloudBG />
        <div className="flex flex-col justify-start items-center gap-10 mt-5">
          <div className="flex flex-col justify-start justify-items-center sm:justify-items-start items-center sm:items-start text-center gap-5 ">
            <h3 className="text-3xl sm:text-3xl md:text-4xl font-bold">
              <span className="">ระบบยืม-คืนสิ่งของ </span>
            </h3>
          </div>

          <SearchBar>
            <Link
              href="/borrow-return/my-borrow"
              className=""
            >
              <div className="p-3 rounded-xl bg-primary flex items-center justify-center hover:scale-90 transition-all active:scale-100 text-white w-fit gap-3">
                <BookCheck />
                <p className="">การยืมของฉัน</p>
              </div>
            </Link>
            <Link
              href="/borrow-return/my-borrow"
              className=""
            >
              <div className="p-3 rounded-xl bg-primary flex items-center justify-center hover:scale-90 transition-all active:scale-100 text-white w-fit gap-3">
                <History />
                <p className="">ตรวจสอบประวัติการยืม</p>
              </div>
            </Link>
          </SearchBar>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-65 gap-y-25 pb-10 items-center">
          {itemDetail?.map((index) => (
            <ItemCard
              key={index.itemID}
              id={index.itemID}
              image={index.itemPictureURL}
              name={index.itemName}
              amount={index.itemQuantity}
              status={index.itemStatus}
              setShowPopup={() => {}}
              showPopup={false}
              setID={() => {}}
            />
          ))}
        </div>
      </div>
    </div>
    </main>
  )
}
