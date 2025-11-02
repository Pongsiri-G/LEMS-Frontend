"use client";
import Image from "next/image";
import MaximizeIcon from "./icon";
import { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient } from "../services/apiClient";
import { useParams } from "next/navigation";
import { Button, Card, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, useDisclosure } from "@heroui/react";
import { Ellipsis } from "lucide-react";
import { Item, PrePage } from "../types/item";
import { useToast } from "../hook/ToastContext";
import Popup from "./equipment-mange/CreatePopUp";

export default function ItemCard({
  item,
  prePage,
  borrowID,
  deleteItem,
  fetchItem,
}: {
  item: Item
  prePage: string
  borrowID?: string
  deleteItem?: (itemID: string) => void
  fetchItem?: (name: string, tag: string, status: string) => Promise<void>
}) {
  const [itemTags, setItemTags] = useState<ItemTag[]>()
  const [imageURL, setImageURL] = useState<string>()
  const { showToast } = useToast()
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const getStatusName = (name: string): string => {
    switch (name) {
      case "INLABONLY":
        return "InLabOnly"
      case "AVAILABLE":
        return "Available"
      case "UNAVAILABLE":
        return "UnAvailable"
      default:
        return ""
    }
  }


  const fetchImage = async (imageURL: string) => {
    const url = `/v1/image`
    const res = await apiClient.post(url, {
      "url": imageURL
    }, { responseType: 'blob' })
    const blob = res.data as Blob
    setImageURL(URL.createObjectURL(blob))
  }
  const fetchItemTag = async () => {
    const url = `/v1/tag/${item.itemID}`
    const res = await apiClient.get(url)
    const data = res.data
    const tags: ItemTag[] = data.map((element: any) => {
      return { id: element["id"], name: element["name"], color: element["color"] }
    })
    setItemTags([...tags])
  }
  useEffect(() => {
    fetchImage(item.itemPictureURL)
    fetchItemTag()
  }, [item])

  const [isCardHovered, setIsCardHovered] = useState(false);
  return (
    true && (
      <div className="flex flex-col items-start gap-2 w-full max-w-[300px] h-[450px] flex-shrink-0 mt-5 z-10">
        <Card className="flex flex-col items-start gap-2 w-full max-w-[300px] h-[450px] flex-shrink-0 mt-5 z-10 ">
          <div
            className="relative w-full h-[300px] overflow-hidden rounded-[0px] "
            onClick={() => { }}
          >

            <img
              key={imageURL}
              src={imageURL!}
              alt="logo"
              className={`transition duration-300 ease-in-out hover:scale-105 object-cover h-full w-full`}
              style={{
                borderTopRightRadius: "16px",
                borderTopLeftRadius: "16px",
              }}
            />
            <div className="absolute top-3 left-2 p-3 bg-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">
              จำนวน {item.itemCurrentQuantity}
            </div>
            {
              prePage === PrePage.EQUIPMENTMANAGE ?
                <div className="absolute top-3 right-2 p-3 bg-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                  <Dropdown>
                    <DropdownTrigger className="button-effect">
                      <Ellipsis className="outline-none" />
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Static Actions">
                      <DropdownItem key="delete" className="text-danger" color="danger" onPress={() => {
                        try {
                          deleteItem!(item.itemID)
                          showToast(`ลบข้อมูล ${name} สำเร็จ`, "success")
                        } catch (e: any) {
                          showToast("เกิดข้อผิดพลาดลบข้อมูลไม่สำเร็จ", "error")
                        }
                      }}>
                        Delete
                      </DropdownItem>
                      <DropdownItem key="copy" onPress={() => {
                        onOpen()
                      }}>Edit</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
                :
                <></>
            }
          </div>
          <div className="px-5 py-3 flex flex-col gap-3 w-full">
            <p className="text-lg font-semibold h-fit">{item.itemName}</p>
            <p
              className={`text-sm text-balance text-neutral`}
            >
              สถานะสิ่งของ: <span className={`${item.itemStatus === "AVAILABLE" ? "text-success" : item.itemStatus === "INLABONLY" ? "text-amber-400" : "text-error"}`}>{getStatusName(item.itemStatus)}</span>
            </p>
            <div className="flex items-center w-full">
              <div className="flex gap-2 flex-wrap flex-1">
                {itemTags?.map((tag, index) => (
                  <p
                    key={index}
                    className={`text-[rgba(255,255,255,1)] text-xs px-2 py-1 rounded-full whitespace-nowrap`}
                    style={{ background: tag.color }}
                  >
                    {tag.name}
                  </p>
                ))}
              </div>
            </div>
            <div className="w-full flex justify-end">
              <Link href={`/borrow-return/item/${item.itemID}/${prePage}/${borrowID}`}>
                <Button variant="bordered">รายละเอียด</Button>
              </Link>
            </div>
          </div>
        </Card>
        <Popup item={item} isOpen={isOpen} onOpen={onOpen} onOpenChange={onOpenChange} fetchItemDetails={() => {
          if (fetchItem !== undefined) {
            fetchItem("", "", "")
          }
        }} />
      </div>
    )
  );
}
