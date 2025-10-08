"use client"
import { Button } from "@heroui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter()
  return <>
    <Button variant="bordered" className="w-fit hover:scale-95 transition-all bg-white" onPress={() => {
      router.back()
    }}>
      <div className="flex gap-3 items-center justify-center ">
        <ArrowLeft />
        <p>ย้อนกลับ</p>
      </div>
    </Button>
  </>
}