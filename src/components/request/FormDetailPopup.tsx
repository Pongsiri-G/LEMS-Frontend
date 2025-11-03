'use client'
import { CircleXIcon, Upload } from "lucide-react";
import { Button } from "@heroui/button";
import { useEffect, useRef, useState } from "react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, SharedSelection, Textarea } from "@heroui/react";
import { fetchItemDetail } from "@/src/utils/itemUtils";
import { apiClient } from "@/src/services/apiClient";
import { useToast } from "@/src/hook/ToastContext";
import { Item } from "@/src/types/item";
import { useRouter } from "next/navigation";
import { Renderable } from "@/src/hook/Renderable";


interface FormPopupProps {
  req: RequestForm
  onClose: () => void
  onSuccess?: () => void
}

const validStatus = [
    {
        status: "PENDING"
    },
    {
        status: "ACCEPTED"
    },
    {
        status: "REJECTED"
    },
    {
        status: "COMPLETED"
    },
]
const statusColor: Record<string, string> = {
    PENDING:  "#5cc7ff",
    ACCEPTED:  "#1cac6e",
    REJECTED:  "#f5365c",
    CANCELED: "#f5365c",
    COMPLETED:  "#0088ce",
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

export default function FormDetailPopup({req, onClose, onSuccess}: FormPopupProps) {
    const [imageURL, setImageURL] = useState<string>()
    const {showToast} = useToast()
    const [ selected, setSelected ] = useState<string>(req.request_status);
    const isSelectedValid = selected != req.request_status;
    const router = useRouter();
    const canRender = Renderable(["ADMIN"])
    const loadRequest = async () => {
        try {
            setImageURL(await fetchImage(req.request_image_url))
        } catch(error) {
            console.log(error)
            setImageURL("/images/image-placeholder.jpg")
        }
    }
    useEffect(() => {
        loadRequest()
    }, [])

    const onSelect = (key: SharedSelection) => {
      setSelected(key.currentKey ?? req.request_status)
      console.log(key)
    }

    return <div className="fixed inset-0 bg-black/75 flex justify-center items-center z-20 transition-all">
        <div className="flex justify-center items-center w-full h-full px-5 md:px-39 lg:px-30 pt-8 pb-8">
            <div className="bg-white rounded-2xl w-full h-full p-5 overflow-hidden flex flex-col">
                <div className="flex justify-end items-start">
                    <CircleXIcon className="text-black hover:scale-120 hover:text-[#d6665e] cursor-pointer transition-all" onClick={()=>{onClose()}}></CircleXIcon>
                </div>
                <div className="overflow-auto h-full w-full"> 
                    <p className="text-[20px] sm:text-[20px] md:text-[24px] font-bold flex justify-center">{`${req.request_type == "LOST" ? "ใบแจ้งของเสีย/หาย" : "ใบเบิกของ"}`}</p>
                    <p className="text-[14px] sm:text-[14px] md:text-[18px] flex justify-center">{`คำร้องหมายเลข ${req.request_id}`}</p>
                    <div className="flex flex-row px-10 gap-15 flex-wrap md:flex-nowrap">
                        <div className="flex flex-col gap-3">
                            <div>
                                <p>ภาพประกอบ</p>
                                <div className="flex justify-center items-center w-80 h-80 border-dashed border rounded-lg">
                                    <img src={imageURL} alt="" aria-hidden="true" className="w-70 h-70 object-contain "></img>
                                </div>
                            </div>
                            {req.request_type == "REQUEST"  && req.item_requested != undefined ? <div className="flex flex-col gap-3">
                                <div className="bg-[#ecf8ff] p-4 rounded-2xl">
                                    <span className="font-bold">ชื่อ: </span>
                                    <span>{req.request_item_name}</span>
                                </div>
                                <div className="bg-[#ecf8ff] p-4 rounded-2xl">
                                    <span className="font-bold">ประเภท: </span>
                                    <span>{req.item_requested.type}</span>
                                </div>
                                <div className="bg-[#ecf8ff] p-4 rounded-2xl">
                                    <span className="font-bold">เจ้าของคำร้อง: </span>
                                    <span>{req.created_by}</span>
                                </div>
                                <div className="bg-[#ecf8ff] p-4 rounded-2xl">
                                    <span className="font-bold">ราคาต่อหน่วย: </span>
                                    <span>{req.item_requested.price} </span>
                                    <span className="font-bold">บาท </span>
                                </div>
                                <div className="bg-[#ecf8ff] p-4 rounded-2xl">
                                    <span className="font-bold">จำนวน: </span>
                                    <span>{req.item_requested.quantity} </span>
                                    <span className="font-bold">ชิ้น </span>
                                </div>
                            </div> : ""}
                            {req.request_type == "LOST"  && req.item_id != undefined ? <div className="flex flex-col gap-3">
                                <div className="bg-[#ecf8ff] p-4 rounded-2xl">
                                    <span className="font-bold">จำนวนที่มีปัญหา: </span>
                                    <span>{req.quantity} </span>
                                    <span className="font-bold">ชิ้น </span>
                                </div>
                                <div className="flex justify-center items-center">
                                    <Button className={`h-10 rounded-3xl flex bg-[#ffe16a] justify-center items-center hover:scale-110`}
                                        onPress={async () => {
                                            router.push("/borrow-return/item/" + req.item_id + "/request/undefined")
                                        }}
                                    >
                                        ดูสิ่งของที่ถูกแจ้งเสีย
                                    </Button>
                                </div>
                            </div> : ""}
                        </div>
                        <div className="flex flex-col mt-10 gap-10 max-w-1000">
                            {req.request_type == "REQUEST" && req.item_requested != undefined ? <div className="flex flex-col gap-8">
                                <div>
                                    <p className="font-bold">รายละเอียดของที่ต้องการเบิก </p>
                                    <div className="bg-[#ecf8ff] p-4 rounded-2xl">
                                        <p>{req.item_requested.description} </p>
                                    </div>
                                </div>
                                <div>
                                    <p className="font-bold">สาเหตุ/เหตุผลที่ต้องการเบิก </p>
                                    <div className="bg-[#ecf8ff] p-4 rounded-2xl">
                                        <span>{req.request_description} </span>
                                    </div>
                                </div>
                            </div> : ""}
                            {req.request_type == "LOST" && req.item_id != undefined ? <div className="flex flex-col gap-8 w-full">
                                <div>
                                    <p className="font-bold">รายละเอียดปัญหา </p>
                                    <div className="bg-[#ecf8ff] p-4 rounded-2xl">
                                        <span>{req.request_description} </span>
                                    </div>
                                </div>
                            </div> : ""}
                            
                        </div>
                    </div>
                </div>
                {canRender && <div className="flex flex-row gap-5 justify-end mt-4">
                    <Dropdown className="hover:scale-95">
                        <DropdownTrigger>
                            <Button className={`capitalize w-35 h-10 bg-white justify-start `} variant="bordered" style={{ color: statusColor[selected] }}>
                            <span className="font-bold"></span>{selected}
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            disallowEmptySelection
                            aria-label="Single selection example"
                            selectedKeys={selected}
                            selectionMode="single"
                            variant="shadow"
                            onSelectionChange={onSelect}
                            className="w-35 overflow-auto max-h-45"
                        >
                            {validStatus!.map((i) => (
                                <DropdownItem key={i.status} style={{ color: statusColor[i.status] }}>{i.status}</DropdownItem>
                            ))}

                        </DropdownMenu>
                    </Dropdown>
                    <div className="flex justify-center items-center">
                        <Button className={` h-10 rounded-3xl ${isSelectedValid ? "bg-[#7ac272]" : "bg-[#9e9b9b] cursor-not-allowed"}  flex justify-center items-center`}
                            onPress={async () => {
                                    try {
                                        if (!isSelectedValid) return;                                          
                                        
                                        const reqBody = {
                                            request_id: req.request_id,
                                            status: selected
                                        }
                                        console.log(reqBody)

                                        await apiClient.post("/v1/admin/request/change-status", reqBody)

                                        if (onSuccess) {
                                            await onSuccess()
                                        }
                                        onClose()
                                        showToast("แก้ไขสถานะสำเร็จ!", "success")
                                    } catch (error) {
                                        console.log(error)
                                        showToast("เกิดข้อผิดพลาด! โปรดลองใหม่ภายหลัง", "error")
                                    }
                                }
                            }

                            disabled={!isSelectedValid}>
                            อัปเดตสถานะ
                        </Button>
                    </div>
                </div>}
            </div>
        </div>
    </div>
}