import { Button } from "@heroui/button";
import ItemDetails from "./ItemDetails";
import Link from "next/link"
import MovingCloudBG from "../MovingCloudBG";
import { ArrowLeft } from "lucide-react";

export default function ItemDetailsHeader() {
  return <>
    <div className="w-full max-w-[1300px] mx-auto px-10 mt-9">
      <MovingCloudBG />
      <Button as={Link} href="/borrow-return" className="w-fit hover:scale-95 transition-all bg-background border-1 border-neutral">
        <div className="flex gap-3 items-center justify-center">
          <ArrowLeft />
          <p>ย้อนกลับ</p>
        </div>
      </Button>
      <p className="text-4xl w-full text-center font-bold mt-6 relative z-0">รายละเอียดสิ่งของ</p>
      <ItemDetails />
    </div>
  </>
}