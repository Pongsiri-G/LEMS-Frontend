"use client";
import Image from "next/image";
import MaximizeIcon from "./icon";
import { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient } from "../services/apiClient";
import { useParams } from "next/navigation";

export default function ItemCard({
  id,
  image,
  name,
  status,
  amount,
  setShowPopup,
  showPopup,
  setID,
}: {
  id: string;
  image: string
  name: string;
  status: string;
  amount: number;
  setShowPopup: Function;
  showPopup: boolean;
  setID: Function;
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
      <div className="flex flex-col items-start gap-2 w-[300px] h-[450px] flex-shrink-0 mt-5 z-10">
        <div
          className="w-full h-[300px] overflow-hidden rounded-[16px]"
          onClick={() => {}}
        >
          <div
            className="relative w-full h-[300px] overflow-hidden rounded-[16px]"
            onClick={() => {}}
          >
            <img
              src={imageURL!}
              alt="logo"
              className={`transition duration-300 ease-in-out hover:scale-105 cursor-pointer object-fit w-full h-full`}
              style={{
                objectFit: "cover",
                borderRadius: "16px",
              }}
            />

            <div className="absolute top-2 right-2 w-10 h-10 rounded-full bg-[rgb(255,246,246)] text-black flex items-center justify-center text-sm font-bold shadow-md">
              {amount}
            </div>
          </div>
        </div>
        <p className="text-lg font-semibold h-fit">{name}</p>
        <p
          className={`text-sm text-balance font-bold`}
          style={{
            color:
              status === "AVAILABLE"
                ? "rgba(28,172,110,1)"
                : status === "DISAPPEARED"
                ? "rgba(245,54,92,1)"
                : "rgb(0,109,165)",
          }}
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
          <Link
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
          </Link>
        </div>
      </div>
    )
  );
}
