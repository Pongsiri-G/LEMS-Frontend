"use client"
import { useState } from "react";
import clsx from "clsx";
import { Paperclip, Upload, X } from "lucide-react";
import { Button } from "@heroui/button";
import { useToast } from "@/src/hook/ToastContext";
import { apiClient } from "@/src/services/apiClient";
import { headers } from "next/headers";
import { useRouter } from "next/navigation";

interface EditPopupProps {
  isOpen: boolean
  closePopup: () => void
  borrowID: string
}

export default function ReturnItemPopup({ isOpen, closePopup, borrowID }: EditPopupProps) {
  const [imageUrl, setImageUrl] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [dragFile, setDragFile] = useState(false)
  const { showToast } = useToast()
  const router = useRouter()

  const handdleReturn = async () => {
    try {
      if (imageUrl.trim() === "" || file === null) {
        showToast("กรุณาอัปโหลดภาพการคืนสิ่งของก่อนคืนของ", "error")
      } else {
        const formData = new FormData()
        formData.append("file", file)
        const uploadImage = await apiClient.post("/v1/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          }
        })
        const imageURL = uploadImage.data.url

        const res = await apiClient.post("/v1/borrow/return", {
          borrow_id: borrowID,
          image_url: imageURL
        })

        showToast(`คืนสำเร็จ`, "success")
        closePopup()
        router.replace("/borrow-return/my-borrow")
      }
    } catch (e: any) {
      showToast(e.response.data.message, "error")
      closePopup()
    } finally {
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files != null) {
      const file = event.target.files[0]
      if (file) {
        setFile(file)
        setImageUrl(URL.createObjectURL(file))
        console.log(URL.createObjectURL(file))
      }
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragFile(false)
    if (event.dataTransfer.files) {
      const file = Array.from(event.dataTransfer.files)[0]
      if (file) {
        setImageUrl(URL.createObjectURL(file))
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    console.log("Over")
    if (event.dataTransfer.types.includes("Files")) {
      setDragFile(true);
    }
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    console.log("Leave")
    setDragFile(false)
  };
  return <>
    <div className={clsx("bg-foreground/35 fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center z-10 transition-all", {
      "opacity-0 pointer-events-none": !isOpen
    })}>
      <div className={clsx("transition-all bg-white w-full h-fit max-w-[500px] max-h-[100vh] rounded-xl flex flex-col p-6 gap-3 relative", {
        "scale-90": !isOpen
      })}
      >
        <ul className=" list-disc list-inside">
          <p className="font-semibold">อัปโหลดรูปของที่คืน (เงื่อนไขดังนี้)</p>
          <li>
            ภาพควรให้เห็นชัดเจนว่าของอยู่ที่ไหน
          </li>
          <li>
            ถ้ามีของที่ต้องยืมด้วยกันจะคืนทั้งหมดโดยปริยาย
          </li>
          <li>
            กรุณาถ่ายภาพของที่ต้องคืนด้วยกันให้ครบหากมี
          </li>
        </ul>
        <div className="relative flex flex-col justify-center items-center w-full outline-dashed rounded-xl outline-neutral outline-[2px] px-5  gap-2  z-10 overflow-auto py-3.5"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          role="button"
          tabIndex={0}
        >
          {
            imageUrl == "" ?
              <div className={clsx("flex justify-center items-center flex-col gap-2 transition-all")}>
                <Upload size={70} className="stroke-neutral pointer-events-none" />
                <p><label htmlFor="upload-file" className="text-primary cursor-pointer"> คลิกเพื่อเลือกไฟล์ </label> หรือเลือกไฟล์มาวางที่นี่</p>
                {/* <p className="text-neutral pointer-events-none">รองรับไฟล์ Excel (.xlsx, .xls) เท่านั้น</p> */}
                <input id="upload-file" type="file" className=" hidden" onChange={handleFileUpload} />
              </div>
              :
              <div className="relative w-full">
                <button className="bg-white/70 p-2 rounded-full absolute top-2 right-2 cursor-pointer" onClick={() => { setImageUrl("") }}>
                  <X className="" />
                </button>
                <img src={imageUrl} alt="Upload preview" className="rounded-xl w-full" />
              </div>

          }
          <div className={clsx("flex justify-center items-center flex-col gap-2 transition-all absolute inset-0  pointer-events-none rounded-xl", {
            "backdrop-blur-md opacity-100 bg-foreground/5": dragFile,
            "opacity-0": !dragFile
          })}>
            <Paperclip size={50} className=" stroke-primary" />
            <p>วางไฟล์ที่นี่</p>
          </div>

        </div>
        <div className="w-full max-w-[500px] flex gap-5">
          <Button className="bg-primary text-white flex-1" onClick={() => { }} onPress={() => {
            handdleReturn()
          }}>
            <p>ยืนยัน</p>
          </Button>
          <Button variant="bordered" className="flex-1" onClick={() => { }} onPress={() => {
            closePopup()
          }}>
            <p>ยกเลิก</p>
          </Button>
        </div>
      </div>
    </div>
  </>
}