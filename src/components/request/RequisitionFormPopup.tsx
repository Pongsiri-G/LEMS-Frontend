'use client'
import { CircleXIcon, Upload } from "lucide-react";
import { Button } from "@heroui/button";
import { useEffect, useRef, useState } from "react";
import { Input, Textarea } from "@heroui/react";
import { apiClient } from "@/src/services/apiClient";
import { useToast } from "@/src/hook/ToastContext";

type FormPopupStatus = "Edit" | "Create" | "View" | "Manage"

interface FormPopupProps {
  status: FormPopupStatus;
  onClose: () => void
}

export default function RequisitionFormPopup({status, onClose}: FormPopupProps) {
    const [ isReady, setIsReady ] = useState(false)
    const [ itemAmountInput, setItemAmountInput ] = useState("")
    const [ itemNameInput, setItemNameInput ] = useState("")
    const [ itemTypeInput, setItemTypeInput ] = useState("")
    const [ itemPriceInput, setItemPriceInput ] = useState("")
    const [ descriptionInput, setDescriptionInput ] = useState("")
    const [ reasonInput, setReasonInput ] = useState("")
    const [ isItemNameInputValid, setIsItemNameInputValid ] = useState(false)
    const [ isItemTypeInputValid, setIsItemTypeInputValid ] = useState(false)
    const [ isItemAmountInputValid, setIsItemAmountInputValid ] = useState(false)
    const [ isItemPriceInputValid, setIsItemPriceInputValid ] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [ selectedImage, setSelectedImage ] = useState<File | null>(null)
    const isFormValid = isItemAmountInputValid
                        && isItemNameInputValid
                        && isItemPriceInputValid
                        && isItemTypeInputValid
                        ;
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
                
                
                setIsReady(true)
            } catch(error) {
                console.log(error)
            }
        }
        loadItem()
    }, [])


    if (!isReady) return;
    {console.log(isFormValid)}

    return <div className="fixed inset-0 bg-black/75 flex justify-center items-center z-20 transition-all">
        <div className="flex justify-center items-center w-full h-full px-30 pt-3 pb-3">
            <div className="bg-white rounded-2xl w-full h-full justify-center items-center p-5 py-3">
                <div className="flex justify-end items-start">
                    <CircleXIcon className="text-black hover:scale-120 hover:text-[#d6665e] cursor-pointer transition-all" onClick={onClose}></CircleXIcon>
                </div>
                <p className="text-[20px] sm:text-[20px] md:text-[24px] font-bold flex justify-center">ใบเบิกของ</p>
                <div className="flex flex-col gap-4 px-15">
                    <div className="flex flex-row gap-15 mt-3">
                        <div className="flex flex-col">
                            <span className="text-[16px]">
                                ชื่อสิ่งของ
                                <span className="text-[#d13f3f]">*</span>
                            </span>
                            <Input className="w-150"
                                placeholder="GPU สุดแรงสุดเท่"
                                value={itemNameInput}
                                onChange={(e) => {
                                    setItemNameInput(e.target.value)
                                    setIsItemNameInputValid(e.target.value.length != 0)
                                }}
                                isRequired
                                type={"string"}
                                validate={(value) => {
                                    if (value.length == 0) return "กรุณากรอกชื่อสิ่งของที่ต้องการเบิก"
                                }}
                            >

                            </Input>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[16px]">
                                ประเภทสิ่งของ
                                <span className="text-[#d13f3f]">*</span>
                            </span>
                            <Input className="w-80"
                                placeholder="Electronics, Furniture, ..."
                                value={itemTypeInput}
                                onChange={(e) => {
                                    setItemTypeInput(e.target.value)
                                    setIsItemTypeInputValid(e.target.value.length != 0)
                                }}
                                isRequired
                                type={"string"}
                                validate={(value) => {
                                    if (value.length == 0) return "กรุณากรอกประเภทสิ่งของที่ต้องการเบิก"
                                }}
                            >

                            </Input>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[16px]">
                                จำนวน
                                <span className="text-[#d13f3f]">*</span>
                            </span>
                            <Input className="w-38"
                                placeholder="1,2,3"
                                value={itemAmountInput == "" ? "" : Number.parseInt(itemAmountInput).toLocaleString()}
                                onChange={(e) => {
                                    setItemAmountInput(e.target.value.replaceAll(",", ""))
                                    setIsItemAmountInputValid(
                                        !isNaN(Number(e.target.value.replaceAll(",", "")))
                                        && !(Number.parseInt(e.target.value) < 1)
                                        && e.target.value.length != 0
                                    )
                                }}
                                isRequired
                                type={"text"}
                                maxLength={4}
                                validate={(value) => {
                                    if (isNaN(Number(value.replaceAll(",", "")))) {
                                        setItemAmountInput("")
                                        return "โปรดกรอกตัวเลขเท่านั้น"
                                    }

                                    if (Number.parseInt(value) < 1) {
                                        return "กรุณาใส่จำนวนของที่ถูกต้อง"
                                    }

                                    if (value.length == 0) return "กรุณาระบุจำนวนที่ต้องการเบิก"
                                }}
                            >

                            </Input>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[16px]">
                                ราคาต่อหน่วย (บาท)
                                <span className="text-[#d13f3f]">*</span>
                            </span>
                            <Input className="w-35"
                                placeholder="1,299"
                                value={itemPriceInput == "" ? "" : Number.parseFloat(itemPriceInput).toLocaleString()}
                                onChange={(e) => {
                                    setItemPriceInput(e.target.value.replaceAll(",", ""))
                                    setIsItemPriceInputValid(
                                        !isNaN(Number(e.target.value.replaceAll(",", "")))
                                        && !(Number.parseInt(e.target.value) < 0)
                                        && e.target.value.length != 0
                                    )
                                }}
                                isRequired
                                maxLength={12}
                                type={"text"}
                                validate={(value) => {
                                    if (isNaN(Number(value.replaceAll(",", "")))) {
                                        setItemPriceInput("")
                                        return "โปรดกรอกตัวเลขเท่านั้น"
                                    }

                                    if (Number.parseInt(value) < 0) {
                                        return "ราคาสิ่งของต้องไม่เป็นเลขติดลบ"
                                    }
                                    if (value.length == 0) return "กรุณาระบุราคาสินค้าต่อชิ้น"

                                }}
                            >
                                
                            </Input>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <p className="text-[16px]">รายละเอียดของที่ต้องการเบิก</p>
                        <Textarea className="max-h-40 p-2 resize-none"
                            placeholder="เทคโนโลยีใหม่..."
                            value={descriptionInput}
                            onChange={(e) => setDescriptionInput(e.target.value)}
                            validate={(value) => {
                                if (value.length == 0) return null
                            }}
                            minRows={4}
                            maxRows={4}
                        >
                        </Textarea>
                    </div>
                    <div className="flex flex-col">
                        <p className="text-[16px]">สาเหตุ/เหตุผลที่ต้องการเบิก</p>
                        <Textarea className="max-h-40 p-2 resize-none"
                            placeholder="นำไปใช้ใน..."
                            value={reasonInput}
                            onChange={(e) => setReasonInput(e.target.value)}
                            validate={(value) => {
                                if (value.length == 0) return null
                            }}
                            minRows={3}
                            maxRows={3}
                        >
                        </Textarea>
                    </div>
                    <div className="flex items-center justify-center">
                        <div className="flex flex-col relative items-center justify-center gap-2 w-100 h-100">
                            <p>ตัวอย่างภาพของที่ต้องการเบิก</p>
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
                    <div className="flex flex-row justify-center gap-4 items-center">
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
                                            "request_type": "REQUEST",
                                            "request_description" : reasonInput,
  	                                        "image_url" : imgUrl,
                                            "item_requested": {
                                                "name": itemNameInput,
                                                "description": descriptionInput,
                                                "type": itemTypeInput,
                                                "quantity": Number.parseInt(itemAmountInput.replaceAll(",", "")),
                                                "price": Number.parseFloat(itemPriceInput.replaceAll(",", ""))
                                            }
                                        }
                                        console.log(reqBody)

                                        await apiClient.post("/v1/request", reqBody)

                                        onClose()

                                        showToast("ส่งคำร้องสำเร็จ", "success")
                                    } catch (error) {
                                        console.log(error)
                                        showToast("เกิดข้อผิดพลาด กรุณาลองใหม่ภายหลัง", "error")
                                    }
                                }
                            }

                            disabled={!isFormValid}>
                            ส่งใบคำร้อง
                            </Button>
                        {selectedImage && <a 
                                        href={URL.createObjectURL(selectedImage)}
                                        target="_blank"
                                        >
                            <Button className="bg-[#ffe16a]">ตรวจสอบภาพที่อัปโหลด</Button>
                        </a>}
                    </div>
                </div>
            </div>
        </div>
    </div>
}