'use client'

import BackButton from "@/src/components/BackButton"
import MovingCloudBG from "@/src/components/MovingCloudBG"
import ProtectedRoute from "@/src/components/ProtectedRoute"
import { Button } from "@heroui/button"
import { Card, getKeyValue, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react"
import { FilePlusIcon, FilesIcon, PaperclipIcon } from "lucide-react"
import { useEffect, useState } from "react"


const rows = [
    {
        id: "9999991",
        status: "NEW",
        create_date: "2025/09/10",
        update_date: "2025/09/12",
        form_type: "ของเสีย/หาย",
        title: "USB Hub",
        attachment: "",
        owner: "นรากร ธ."
    },
    {
        id: "4561888",
        status: "NEW",
        create_date: "2025/09/10",
        update_date: "2025/09/12",
        form_type: "ของเสีย/หาย",
        title: "USB Hub",
        attachment: "yes",
        owner: "นรากร ธ."

    }
]

const columns = [
    // {
    //     key: "id",
    //     label: "Form ID"
    // },
    {
        key: "status",
        label: "สถานะคำร้อง",
    },
    {
        key: "create_date",
        label: "วันสร้างคำร้อง",
    },
    {
        key: "update_date",
        label: "อัปเดตล่าสุด",
    },
    {
        key: "form_type",
        label: "ประเภทคำร้อง",
    },
    {
        key: "title",
        label: "",
    },
    {
        key: "attachment",
        label: "",
    },
    {
        key: "owner",
        label: "เจ้าของคำร้อง",
    },
]

const statusColor: Record<string, string> = {
    NEW:  "#c5ab45",
    PENDING:  "#5cc7ff",
    ACCEPTED:  "#1cac6e",
    REJECTED:  "#f5365c",
    COMPLETED:  "#0088ce",
}

export default function RequestPage() {
    const [ isReady, setIsReady ] = useState(false)

    useEffect(() => {

    }, [])

    return (
    <ProtectedRoute>
        <main className="flex flex-col justify-start items-center gap-10 pt-5 mt-5">
            <div className="relative !gap !mt w-full flex flex-col justify-start items-center max-w-[1500px]">
                <MovingCloudBG />
                <div className="flex flex-col justify-start w-full items-center gap-10 mt-5">
                    <div className="flex flex-col justify-start justify-items-center sm:justify-items-start items-center sm:items-start text-center gap-5 ">
                        <h3 className="text-3xl sm:text-3xl md:text-4xl font-bold">
                            <p className="mb-3 text-3xl sm:text-3xl md:text-4xl font-bold">ระบบคำร้อง </p>
                            <p className="flex justify-center items-center text-xl font-medium">สร้างคำร้องและแบบฟอร์ม</p>
                            <p className="flex justify-center items-center text-xl font-medium">เลือกประเภทคำร้อง/แบบฟอร์ม</p>
                        </h3>
                    </div>
                    <div className="flex flex-row w-full items-end justify-end">
                        <div className="w-full">
                            <BackButton />
                        </div>
                        <div className="flex flex-row w-70 gap-3">
                            <Button className="w-35 h-10 bg-[#ffe16a] hover:scale-95">
                                <FilesIcon color="black" />
                                <span className="hidden lg:inline text-black">คำร้องของฉัน</span>
                            </Button>
                            <Button className="w-35 h-10 bg-primary hover:scale-95">
                                <FilePlusIcon color="white" />
                                <span className="hidden lg:inline text-white">เพิ่มสิ่งของ</span>
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-row gap-15 justify-center items-center">
                        <Card className="flex flex-col bg-[#e5f6ff] w-80 h-100 items-center gap-5 p-6 rounded-3xl z-10 shadow hover:scale-95 transition-all cursor-pointer">
                            <img src={"/images/fix.svg"} width={150} height={150}></img>
                            <p className="text-[24px] text-[#006da5] font-bold">ใบแจ้งของเสีย/หาย</p>
                            <p className="text-[16px] text-[#006da5] font-normal">เพื่อทำการแจ้งอุปกรณ์หรือสิ่งของของห้องปฏิบัติการ
                                                                                    หายไป หรือเสียหาย เพื่อให้สมาชิกและอาจารย์ได้
                                                                                    รับทราบและหาแนวทางแก้ไข/หาย
                            </p>
                        </Card>
                        <Card className="flex flex-col bg-[#e5f6ff] w-80 h-100 items-center gap-5 p-6 rounded-3xl z-10 shadow hover:scale-95 transition-all cursor-pointer">
                            <img src={"/images/requisition.svg"} width={150} height={150}></img>
                            <p className="text-[24px] text-[#006da5] font-bold">ใบเบิกสิ่งของ</p>
                            <p className="text-[16px] text-[#006da5] font-normal">เพื่อทำการขอเบิกอุปกรณ์และสิ่งของต่าง ๆ 
                                                                                    ที่จะนำมาใช้ให้เป็นประโยชน์กับการทำงาน การวิจัย 
                                                                                    และกิจกรรมต่าง ๆ ของ<br></br>ห้องปฏิบัติการ
                            </p>
                        </Card>
                    </div>
                </div>
            </div>
        </main>
    </ProtectedRoute>
    )
}