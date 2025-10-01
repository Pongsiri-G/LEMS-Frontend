"use client";
import Image from "next/image";
import MaximizeIcon from "./icon";
import { useState } from "react";

export default function ItemCard({
  id,
  status,
  amount,
  setShowPopup,
  showPopup,
  setID,
}: {
  id: string;
  status: string;
  amount: number;
  setShowPopup: Function;
  showPopup: boolean;
  setID: Function;
}) {
  const data: { tag: string }[] = [
    { tag: "Electronic" },
    { tag: "Computer" },
    { tag: "Accessories" },
    { tag: "Gadget" },
  ];
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
            <Image
              src="/images/image-placeholder.jpg"
              width={300}
              height={300}
              priority
              alt="logo"
              className={`transition duration-300 ease-in-out hover:scale-105 cursor-pointer`}
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
        <p className="text-lg font-semibold h-fit">{id}</p>
        <p
          className={`text-sm text-balance font-bold`}
          style={{
            color:
              status === "Available"
                ? "rgba(28,172,110,1)"
                : status === "Disappeared"
                ? "rgba(245,54,92,1)"
                : "rgb(0,109,165)",
          }}
        >
          {status}
        </p>
        <div className="flex items-center w-full">
          <div className="flex gap-2 flex-wrap flex-1">
            {data.map((tag, index) => (
              <p
                key={index}
                className="bg-[rgba(27,160,240,0.1)] text-[rgba(27,160,240,1)] text-xs px-2 py-1 rounded-full whitespace-nowrap"
              >
                {tag.tag}
              </p>
            ))}
          </div>
          <button
            className={`block cursor-pointer text-sm text-balance`}
            onClick={() => {}}
            onMouseEnter={() => {
              setIsCardHovered(true);
            }}
            onMouseLeave={() => {
              setIsCardHovered(false);
            }}
          >
            <MaximizeIcon isHovered={isCardHovered} />
          </button>
        </div>
      </div>
    )
  );
}
