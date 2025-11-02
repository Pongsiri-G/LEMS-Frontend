"use client"
import clsx from "clsx";
import { Bell, NotebookTabs, Package, PackageOpen, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ReturnItemPopup from "./ReturnItemPopup";
import { apiClient } from "@/src/services/apiClient";
import { useParams } from "next/navigation";
import { Card, CardBody } from "@heroui/react";
import VerifyBorrowPopup from "./VerifyBorrowPopup";
import { Item } from "@/src/types/item";
import { useToast } from "@/src/hook/ToastContext";
import { RootState } from "@/src/store";
import { useSelector } from "react-redux";
import { BorrowQueue, ResponseBody } from "@/src/types";
// import { fs } from "node:fs"; // Removed because 'fs' is not available in the browser

export default function ItemDetails() {
  const [returnPopupOpen, setReturnPopupOpen] = useState(false)
  const [verifyPopupOpen, setVerifyPopupOpen] = useState(false)
  const [itemDetail, setItemDetail] = useState<Item>()
  const [itemTags, setItemTags] = useState<ItemTag[]>()
  const [childItems, setChildItems] = useState<Item[]>()
  const [imageURL, setImageURL] = useState<string>()
  const [allowBorrow, setAllowBorrow] = useState(true)
  const [childImageURL, setChildImageURL] = useState<string[]>()
  const [borrowID, setBorrowID] = useState("")
  const user = useSelector((state: RootState) => state.auth.user);
  const [queue, setQueue] = useState<BorrowQueue | null>(null)

  const param = useParams();
  const id = param.id;
  const prePage = param.prepage

  const { showToast } = useToast()

  const fetchFrontQueue = async () => {
    const res = await apiClient.get(`/v1/bq/front/${id}`)
    if (res.data === null) {
      return
    }
    if (user?.userId === res.data["user_id"]) {
      setAllowBorrow(true)
    } else {
      setAllowBorrow(false)
    }
    console.log(res.data)
    console.log("USER:", user?.userId)
    console.log(res.data["uesr_id"])
  }

  const fetchImage = async (imageURL: string): Promise<string> => {
    const url = `/v1/image`
    const res = await apiClient.post(url, {
      "url": imageURL
    }, { responseType: 'blob' })
    const blob = res.data as Blob
    const newimageURL: string = URL.createObjectURL(blob)
    return newimageURL
  }

  const fetchBorrowID = async () => {
    if (prePage === "my-borrow") {
      const res = await apiClient.get(`/v1/borrow-id/${id}`)
      setBorrowID(res.data)
    }
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
    console.log(item)
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

  const fetchMyQueue = async () => {
    const url = `/v1/bq/myqueue/${id}`
    await apiClient.get<BorrowQueue>(url).then((res) => {
          setQueue(res.data)
        })
  }

  const handleNotifyWhenAvailable = async (e: React.MouseEvent) => {
    e.preventDefault()

    const url = `/v1/bq/enqueue`
    await apiClient.post(url, {
      itemId: id,
    }).then(() => {
      fetchMyQueue()
      showToast("บันทึกสำเร็จ", "success")
    }).catch((err) => {
      showToast("เกิดข้อผิดพลาด กรุณาลองใหม่ภายหลัง", "error")
    })
  }

  const handleCancelNotification = async (e: React.MouseEvent) => {
    e.preventDefault()
    
    const url = `/v1/bq/${queue?.queue_id}`
    await apiClient.patch(url).then(() => {
      showToast("ยกเลิกคิวสำเร็จ", "success")
      setQueue(null)
    }).catch((err) => {
      showToast("เกิดข้อผิดพลาด กรุณาลองใหม่ภายหลัง", "error")
    })
  }

  useEffect(() => {
    fetchItemDetail()
    fetchItemTag()
    fetchChildItem()
    fetchBorrowID()
    fetchFrontQueue()
    fetchMyQueue()
  }, [])

  return <>
    <Card className="flex flex-col 2xl:flex-row gap-4 my-10 relative z-0 p-10">
      <VerifyBorrowPopup isOpen={verifyPopupOpen} closePopup={() => { setVerifyPopupOpen(false) }} itemName={itemDetail?.itemName} itemChild={childItems} itemID={itemDetail?.itemID} />
      <ReturnItemPopup isOpen={returnPopupOpen} closePopup={() => { setReturnPopupOpen(false) }} borrowID={String(borrowID)} />
      {prePage === "equipment-manage" || prePage === "request" ?
        <></>
        :
          <div className="fixed right-0 top-1/2 -translate-y-1/2 flex flex-col gap-3.5 translate-x-[195px]">
            {queue ? (
              <button
                className="rounded-full bg-error p-3 pr-10 flex gap-4 text-white hover:-translate-x-[165px] transition-all cursor-pointer active:scale-95 active:opacity-90"
                onClick={(e) => handleCancelNotification(e)}
              >
                <Bell className="stroke-white" />
                <p className="select-none">ยกเลิกการแจ้งเตือน</p>
              </button>
            ) : (
              <button
                className="rounded-full bg-primary p-3 pr-10 flex gap-4 text-white hover:-translate-x-[165px] transition-all cursor-pointer active:scale-95 active:opacity-90"
                onClick={(e) => handleNotifyWhenAvailable(e)}
              >
                <Bell className="stroke-white" />
                <p className="select-none">แจ้งเตือนเมื่อพร้อมให้ยืม</p>
              </button>
            )}
          <button disabled={itemDetail?.itemStatus === "UNAVAILABLE" && prePage !== "my-borrow"} className={clsx("rounded-full p-3 flex gap-4 text-white hover:-translate-x-[165px] transition-all  ", {
            "bg-error cursor-pointer active:scale-95 active:opacity-90": prePage === "my-borrow",
            "bg-neutral": ((itemDetail?.itemStatus === "UNAVAILABLE" || itemDetail?.itemStatus === "INLABONLY" || !allowBorrow) && prePage === "borrow-return"),
            "bg-primary cursor-pointer active:scale-95 active:opacity-90": itemDetail?.itemStatus === "AVAILABLE" && prePage === "borrow-return" && allowBorrow
          })} onClick={() => {
            if (itemDetail?.itemStatus === "INLABONLY") {
              return
            }
            if (prePage === "my-borrow") {
              setReturnPopupOpen(true)
            } else {
              if (!allowBorrow) {
                return
              }
              if (itemDetail?.itemStatus === "UNAVAILABLE") {
                return
              }
              setVerifyPopupOpen(true)
            }
          }}>
            {prePage === "my-borrow" ?
              <>
                <PackageOpen className="stroke-white" />
                <p className="select-none">คืนของชิ้นนี้</p>
              </>
              :
              <>
                <Package className="stroke-white" />
                <p className="select-none">ยืมของชิ้นนี้</p>
              </>
            }
          </button>
        </div>
      }
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
              <p className={clsx("font-bold py-2 px-4 rounded-full  text-white w-fit", {
                "bg-error": itemDetail?.itemStatus === "UNAVAILABLE",
                "bg-success": itemDetail?.itemStatus === "AVAILABLE",
                "bg-amber-400": itemDetail?.itemStatus === "INLABONLY",
              })}>{itemDetail?.itemStatus}</p>
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