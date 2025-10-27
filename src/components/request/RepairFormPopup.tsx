'use client'
import { CircleXIcon, Upload } from "lucide-react";
import { Button } from "@heroui/button";
import { useEffect, useRef, useState } from "react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, SharedSelection, Textarea } from "@heroui/react";
import { fetchItemDetail } from "@/src/utils/itemUtils";
import { apiClient } from "@/src/services/apiClient";
import { useToast } from "@/src/hook/ToastContext";

type FormPopupStatus = "Edit" | "Create" | "View" | "Manage"

interface FormPopupProps {
  status: FormPopupStatus;
  onClose: () => void
}

export default function RepairFormPopup({status, onClose}: FormPopupProps) {
    const [ isReady, setIsReady ] = useState(false)
    const [ item, setItem ] = useState<Item[]>([])
    const [ selected, setSelected ] = useState<string>("Choose an item");
    const [ itemID, setItemID ] = useState("")
    const [ brokenNumInput, setBrokenNumInput ] = useState("")
    const [ descriptionInput, setDescriptionInput ] = useState("")
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [ selectedImage, setSelectedImage ] = useState<File | null>(null)
    const isFormValid = selected !== "Choose an item" && Number.parseInt(brokenNumInput) >= 1;
    const {showToast} = useToast()

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setSelectedImage(file ?? null)
    };

    const handleClickUpload = () => {
        fileInputRef.current?.click();
    };

    const uploadImage = async (): Promise<string> => {
        if (selectedImage !== null) {
        const formData = new FormData()
        formData.append("file", selectedImage)
        const uploadImage = await apiClient.post("/v1/upload", formData, {
            headers: {
            "Content-Type": "multipart/form-data",
            }
        })
        return uploadImage.data.url
        }
        return ""
    }

    useEffect(() => {
        const loadItem = async () => {
            try {
                const items = await fetchItemDetail("", "", "")
                setItem(items)
                setIsReady(true)
            } catch(error) {
                console.log(error)
            }
        }
        loadItem()
    }, [])

    const onSelect = (key: SharedSelection) => {
      setSelected(key.currentKey ?? "Choose an item")
      const selectedItem = item.find(item => item.itemName === key.currentKey);
      if (selectedItem) {
        setItemID(selectedItem.itemID)
      }
      console.log(key)
    }

    if (!isReady) return;
    {console.log(isFormValid)}

    return <div className="fixed inset-0 bg-black/75 flex justify-center items-center z-20 transition-all">
        <div className="flex justify-center items-center w-full h-full px-30 pt-10 pb-8">
            <div className="bg-white rounded-2xl w-full h-full justify-center items-center p-5">
                <div className="flex justify-end items-start">
                    <CircleXIcon className="text-black hover:scale-120 hover:text-[#d6665e] cursor-pointer transition-all" onClick={onClose}></CircleXIcon>
                </div>
                <p className="text-[20px] sm:text-[20px] md:text-[24px] font-bold flex justify-center">ใบแจ้งของเสีย/หาย</p>
                <div className="flex flex-col gap-7 px-15">
                    <div className="flex flex-row gap-20 mt-8">
                        <div className="flex flex-col">
                            <span className="text-[16px]">
                                เลือกสิ่งของที่ต้องการแจ้งเสียหรือหาย
                                <span className="text-[#d13f3f]">*</span>
                            </span>
                            <Dropdown className="hover:scale-95">
                                <DropdownTrigger>
                                    <Button className="capitalize w-150 h-10 bg-white justify-start" variant="bordered">
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
                                    className="w-150 overflow-auto max-h-40"
                                >
                                    {item!.map((i) => (
                                        <DropdownItem key={i.itemName}>{i.itemName}</DropdownItem>
                                    ))}

                                </DropdownMenu>
                            </Dropdown>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[16px]">
                                จำนวนของที่มีปัญหา
                                <span className="text-[#d13f3f]">*</span>
                            </span>
                            <Input className=""
                                placeholder="1,2,3"
                                value={brokenNumInput}
                                onChange={(e) => setBrokenNumInput(e.target.value)}
                                isRequired
                                errorMessage="กรุณาใส่จำนวนของที่ถูกต้อง"
                                type={"number"}
                                validate={(value) => {
                                    if (Number.parseInt(value) < 1) {
                                        return "กรุณาใส่จำนวนของที่ถูกต้อง"
                                    }
                                    if (value.length == 0) return null
                                }}
                            >

                            </Input>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <p className="text-[16px]">รายละเอียดปัญหา</p>
                        <Textarea className="max-h-40 p-2 resize-none"
                            placeholder="คำอธิบาย"
                            value={descriptionInput}
                            onChange={(e) => setDescriptionInput(e.target.value)}
                            validate={(value) => {
                                if (value.length == 0) return null
                            }}
                            minRows={3}
                            maxRows={5}
                        >
                        </Textarea>
                    </div>
                    <div className="flex items-center justify-center">
                        <div className="flex flex-col relative items-center justify-center gap-2 w-100 h-100">
                            <p>ตัวอย่างภาพของที่เสียหรือหาย</p>
                        <div
                            onClick={handleClickUpload}
                            className="h-90 w-90 border-3 border-dashed border-gray-500 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                            {selectedImage ? (
                            <img
                                src={URL.createObjectURL(selectedImage)}
                                alt="Preview"
                                className="w-full h-full object-cover rounded-lg object-scale-down"
                            />
                            ) : (
                            <>
                                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mb-4">
                                <div className="w-16 h-20 bg-blue-300 rounded-lg flex items-center justify-center">
                                    <Upload className="w-10 h-10 text-primary" />
                                </div>
                                </div>
                                <p className="text-gray-700 font-medium">
                                Click to upload
                                </p>
                            </>
                            )}
                            <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            />
                        </div>
                        </div>
                    </div>
                    <div className="flex justify-center items-center">
                        <Button className={`w-50 h-10 rounded-3xl ${isFormValid ? "bg-[#7ac272]" : "bg-[#9e9b9b] cursor-not-allowed"}  flex justify-center items-center`}
                            onPress={async () => {
                                    try {
                                        if (!isFormValid) return; 
        
                                        console.log("Submit form");
                                        
                                        let imgUrl = ""
                                        if (selectedImage) {
                                            imgUrl = await uploadImage()
                                        }
                                        
                                        const reqBody = {
                                            "item_id": itemID,
                                            "request_type": "LOST",
                                            "request_description" : descriptionInput,
  	                                        "image_url" : imgUrl,
                                        }
                                        console.log(reqBody)

                                        await apiClient.post("/v1/request", reqBody)

                                        onClose()

                                        showToast("ส่งคำร้องสำเร็จ", "success")
                                    } catch (error) {
                                        console.log(error)
                                    }
                                }
                            }

                            disabled={!isFormValid}>
                            ส่งใบคำร้อง
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
}