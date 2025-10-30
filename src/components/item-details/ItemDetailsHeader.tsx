import { Button } from "@heroui/button";
import ItemDetails from "./ItemDetails";
import Link from "next/link"
import MovingCloudBG from "../MovingCloudBG";
import { ArrowLeft } from "lucide-react";
import BackButton from "../BackButton";

export default function ItemDetailsHeader() {
  return <>
    <div className="w-full max-w-[1300px] mx-auto px-10 mt-9">
      <MovingCloudBG />
      <BackButton />
      <p className="text-4xl w-full text-center font-bold mt-6 relative z-0">รายละเอียดสิ่งของ</p>
      <ItemDetails />
    </div>
  </>
}