"use client";
import Image from "next/image";
import MaximizeIcon from "./icon";
import { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient } from "../services/apiClient";
import { useParams } from "next/navigation";
import { Card } from "@heroui/react";

export default function ItemCard({
  id,
  image,
  name,
  status,
  amount,
  prePage,
  borrowID
}: {
  id: string;
  image: string
  name: string;
  status: string;
  amount: number;
  prePage: string
  borrowID?: string
}) {
  const [itemTags, setItemTags] = useState<ItemTag[]>()
  const [imageURL, setImageURL] = useState<string>()


  const fetchImage = async (imageURL: string) => {
    const url = `/v1/image`
    const res = await apiClient.post(url, {
      "url": imageURL
    }, { responseType: 'blob' })
    const blob = res.data as Blob
    setImageURL(URL.createObjectURL(blob))
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
  useEffect(() => {
    fetchImage(image)
    fetchItemTag()
  }, [])
  const [isCardHovered, setIsCardHovered] = useState(false);
  return (
    true && (
      <Link href={`/borrow-return/item/${id}/${prePage}/${borrowID}`}>
        <div className="flex flex-col items-start gap-2 w-[300px] h-[450px] flex-shrink-0 mt-5 z-10">
          <Card className="flex flex-col items-start gap-2 w-[300px] h-[450px] flex-shrink-0 mt-5 z-10 hover:scale-95 transition-all">
            <div
              className="w-full h-[300px] overflow-hidden rounded-[0px]"
              onClick={() => { }}
            >
              <div
                className="relative w-full h-[300px] overflow-hidden rounded-[0px]"
                onClick={() => { }}
              >

                <img
                  src={imageURL!}
                  alt="logo"
                  className={`transition duration-300 ease-in-out hover:scale-105 cursor-pointer object-fit w-full h-full`}
                  style={{
                    objectFit: "cover",
                    borderTopRightRadius: "16px",
                    borderTopLeftRadius: "16px",
                  }}
                />


                <div className="absolute top-3 right-2 p-3 bg-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                  จำนวน {amount}
                </div>
                {prePage === "my-borrow" ?
                  <></>
                  :
                  <div className="absolute top-3 right-2 p-3 bg-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                    จำนวน {amount}
                  </div>
                }

              </div>
            </div>
            <div className="px-5 py-3 flex flex-col gap-3">
              <p className="text-lg font-semibold h-fit">{name}</p>
              <p
                className={`text-sm text-balance font-bold ${status === "AVAILABLE" ? "text-success" : "text-error"}`}
              >
                {(status[0] + status.slice(1).toLowerCase())}
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
                {/* <Link
                href={`/borrow-return/item/${id}`}
                className={`block cursor-pointer text-sm text-balance`}
                onClick={() => {
                }}
                onMouseEnter={() => {
                  setIsCardHovered(true);
                }}
                onMouseLeave={() => {
                  setIsCardHovered(false);
                }}
              >
                <MaximizeIcon isHovered={isCardHovered} />
              </Link> */}
              </div>
            </div>
          </Card>
        </div>
      </Link>
    )
  );
}
