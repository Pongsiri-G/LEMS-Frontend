"use client"
import clsx from "clsx";
import { Bell, NotebookTabs, Package, PackageOpen, X } from "lucide-react";
import { useEffect, useState } from "react";
import ReturnItemPopup from "./ReturnItemPopup";
import { apiClient } from "@/src/services/apiClient";
import { useParams } from "next/navigation";
import { blob } from "node:stream/consumers";
import path from "node:path";
import { Card, CardBody } from "@heroui/react";
import VerifyBorrowPopup from "./VerifyBorrowPopup";
// import { fs } from "node:fs"; // Removed because 'fs' is not available in the browser

export default function ItemDetails() {
  const [isBorrow, setIsBorrow] = useState(false)
  const [returnPopupOpen, setReturnPopupOpen] = useState(false)
  const [verifyPopupOpen, setVerifyPopupOpen] = useState(false)
  const [itemDetail, setItemDetail] = useState<Item>()
  const [itemTags, setItemTags] = useState<ItemTag[]>()
  const [childItems, setChildItems] = useState<Item[]>()
  const [imageURL, setImageURL] = useState<string>()
  const [childImageURL, setChildImageURL] = useState<string[]>()

  const param = useParams();
  const id = param.id;

  const fetchImage = async (imageURL: string): Promise<string> => {
    const url = `/v1/image`
    const res = await apiClient.post(url, {
      "url": imageURL
    }, { responseType: 'blob' })
    const blob = res.data as Blob
    const newimageURL: string = URL.createObjectURL(blob)
    return newimageURL
  }

  const UpdateChildImageURL = async (items: Item[]) => {
    if (items !== undefined) {
      const newItems: Item[] = await Promise.all(
        items.map(async (e) => {
          e.itemPictureURL = await fetchImage(e.itemPictureURL)
          return e
        })
      )
      setChildItems([...newItems])
    }
  }

  const fetchItemDetail = async () => {
    const url = `/v1/item/${id}`
    const res = await apiClient.get(url)
    const data = res.data
    const item: Item = {
      itemID: data["id"],
      itemName: data["name"],
      itemDescription: data["desc"],
      itemPictureURL: data["picture_url"],
      itemStatus: data["status"],
      itemQuantity: data["quantity"],
      itemCurrentQuantity: data["current_quantity"],
      createdAt: new Date(data["created_at"]),
      updatedAt: new Date(data["updated_at"])
    }
    setImageURL(await fetchImage(item.itemPictureURL))

    setItemDetail(item)
  }

  const fetchItemTag = async () => {
    const url = `/v1/tag/${id}`
    const res = await apiClient.get(url)
    const data = res.data
    const tags: ItemTag[] = data.map((element: any) => {
      return { id: element["id"], name: element["name"], color: element["color"] }
    })
    setItemTags([...tags])
  }

  const fetchChildItem = async () => {
    const url = `/v1/item/child/${id}`
    const res = await apiClient.get(url)
    const data = res.data
    const items: Item[] = data.map((element: any) => {
      return {
        itemID: element["id"],
        itemName: element["name"],
        itemDescription: element["desc"],
        itemPictureURL: element["picture_url"],
        itemStatus: element["status"],
        itemQuantity: element["quantity"],
        itemCurrentQuantity: element["current_quantity"],
        createdAt: new Date(element["created_at"]),
        updatedAt: new Date(element["updated_at"])
      }
    })
    UpdateChildImageURL(items)
    setChildItems([...items])
  }

  useEffect(() => {
    fetchItemDetail()
    fetchItemTag()
    fetchChildItem()
  }, [])

  return <>
    <Card className="flex flex-col 2xl:flex-row gap-4 my-10 relative z-0 p-10">
      <VerifyBorrowPopup isOpen={verifyPopupOpen} closePopup={() => { setVerifyPopupOpen(false) }} itemName={itemDetail?.itemName} itemChild={childItems} />
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
          } else {
            setVerifyPopupOpen(true)
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
      {/* <div className="flex 2xl:flex-col flex-row gap-4 overflow-y-auto scrollbar-hide max-h-[500px]">
        <img src={"/CPU.jpg"} className="max-w-[200px] w-full rounded-xl" />
        <img src={"/GPU.jpg"} className="max-w-[200px] w-full rounded-xl" />
        <img src={"/Cooling.jpg"} className="max-w-[200px] w-full rounded-xl" />
        <img src={"/CPU.jpg"} className="max-w-[200px] w-full rounded-xl" />
        <img src={"/GPU.jpg"} className="max-w-[200px] w-full rounded-xl" />
        <img src={"/Cooling.jpg"} className="max-w-[200px] w-full rounded-xl" />
      </div> */}
      <div className="flex xl:flex-row flex-col flex-1 gap-5 h-fit">
        <img src={imageURL} className="xl:max-w-[500px] h-fit flex-1 rounded-xl" />
        <div className="flex-1 gap-6 flex flex-col">
          <p className="text-2xl font-bold">ชื่อ: {itemDetail?.itemName}</p>
          <div className="flex gap-4">
            <div className="flex-1 bg-neutral-second p-4 rounded-xl h-fit">
              <p className="text-neutral">จำนวนทั้งหมด</p>
              <p className="text-xl font-bold">{itemDetail?.itemQuantity} ชิ้น</p>
            </div>
            <div className="flex-1 bg-neutral-second p-4 rounded-xl h-fit">
              <p className="text-neutral">จำนวนคงเหลือ</p>
              <p className="text-xl font-bold">{itemDetail?.itemCurrentQuantity} ชิ้น</p>
            </div>
          </div>
          <div className="flex-1 bg-neutral-second p-4 rounded-xl h-fit">
            <p className="text-neutral">ต้องยืมร่วมกับ</p>
            <div className="text-xl font-bold flex flex-wrap">
              <ul className="list-disc list-inside">
                {
                  childItems !== undefined && childItems.length !== 0 ? childItems?.map((element) => {
                    return (
                      <li key={element.itemID} className="text-medium">
                        {element.itemName}
                      </li>
                    )
                  })
                    :
                    <p className="text-medium">ไม่มีอุปกรณ์ที่ต้องยืมเพิ่มเติม</p>
                }
              </ul>
            </div>
          </div>
          <div className="flex gap-3 flex-col justify-center">
            <p className="text-neutral">คำอธิบาย: </p>
            <p className="">{itemDetail?.itemDescription}</p>
          </div>
          <div className="flex md:flex-row flex-col gap-10">
            <div className="flex gap-3 flex-col justify-center">
              <p className="text-neutral">สถานะ: </p>
              <p className="font-bold py-2 px-4 rounded-full bg-success text-white w-fit">{itemDetail?.itemStatus}</p>
            </div>
            <div className="flex flex-col gap-3 flex-1 ">
              <p className="text-neutral">Tag: </p>
              <div className="flex gap-3 flex-wrap">
                {itemTags?.map((element) => {
                  return (
                    <div
                      key={element.id}
                      className={`flex gap-2 justify-center items-center  rounded-full w-fit px-4 py-2`}
                      style={{ backgroundColor: element.color }}>
                      <p className="text-white cursor-default font-bold">{element.name}</p>
                      {/* <X className="stroke-white" /> */}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  </>
}