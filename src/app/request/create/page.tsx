'use client'

import BackButton from "@/src/components/BackButton"
import MovingCloudBG from "@/src/components/MovingCloudBG"
import ProtectedRoute from "@/src/components/ProtectedRoute"
import RepairFormPopup from "@/src/components/request/RepairFormPopup"
import RequisitionFormPopup from "@/src/components/request/RequisitionFormPopup"
import { Card } from "@heroui/react"
import { useEffect, useState } from "react"


export default function RequestPage() {
    const [ showRepairModal, setShowRepairModal ] = useState(false)
    const [ showRequisitionModal, setShowRequisitionModal ] = useState(false)

    useEffect(() => {

    }, [])

    return (
    <ProtectedRoute>
        <main className="flex flex-col justify-start items-center gap-10 pt-5 mt-5">
            <div className="relative !gap !mt w-full flex flex-col justify-start items-center max-w-[1500px] md:max-w-[1300px]">
                <MovingCloudBG />
                <div className="flex flex-col justify-start w-full items-center gap-10 mt-5">
                    <div className="flex flex-col justify-start justify-items-center sm:justify-items-start items-center sm:items-start text-center gap-5 ">
                        <h3 className="text-3xl sm:text-3xl md:text-4xl font-bold">
                            <p className="mb-3 text-3xl sm:text-3xl md:text-4xl font-bold">ระบบคำร้องและแบบฟอร์ม</p>
                            <p className="flex justify-center items-center text-xl font-medium">สร้างคำร้องและแบบฟอร์ม</p>
                            <p className="flex justify-center items-center text-xl font-medium">เลือกประเภทคำร้อง/แบบฟอร์ม</p>
                        </h3>
                    </div>

                    <div className="w-full">
                        <BackButton />
                    </div>

                    <div className="flex flex-row gap-15 justify-center items-center">
                        <button onClick={() => setShowRepairModal(true)}>
                            <Card className="flex flex-col bg-[#e5f6ff] w-80 h-100 items-center gap-5 p-6 rounded-3xl z-10 shadow hover:scale-110 transition-all cursor-pointer">
                                <img src={"/images/fix.svg"} alt="repair icon image" width={150} height={150}></img>
                                <p className="text-[24px] text-[#006da5] font-bold">ใบแจ้งของเสีย/หาย</p>
                                <p className="text-[16px] text-[#006da5] font-normal">เพื่อทำการแจ้งอุปกรณ์หรือสิ่งของของห้องปฏิบัติการ
                                                                                        หายไป หรือเสียหาย เพื่อให้สมาชิกและอาจารย์ได้
                                                                                        รับทราบและหาแนวทางแก้ไข/หาย
                                </p>
                            </Card>
                        </button>
                        <div>
                            <button onClick={() => setShowRequisitionModal(true)}>
                                <Card className="flex flex-col bg-[#e5f6ff] w-80 h-100 items-center gap-5 p-6 rounded-3xl z-10 shadow hover:scale-110 transition-all cursor-pointer">
                                    <img src={"/images/requisition.svg"} alt="requisition icon image" width={150} height={150}></img>
                                    <p className="text-[24px] text-[#006da5] font-bold">ใบเบิกสิ่งของ</p>
                                    <p className="text-[16px] text-[#006da5] font-normal">เพื่อทำการขอเบิกอุปกรณ์และสิ่งของต่าง ๆ 
                                                                                            ที่จะนำมาใช้ให้เป็นประโยชน์กับการทำงาน การวิจัย 
                                                                                            และกิจกรรมต่าง ๆ ของ<br></br>ห้องปฏิบัติการ
                                    </p>
                                </Card>
                            </button>
                        </div>
                    </div>
                </div>
                {showRepairModal && !showRequisitionModal && <RepairFormPopup  status="Create" onClose={() => setShowRepairModal(false)}></RepairFormPopup>}
                {showRequisitionModal && !showRepairModal && <RequisitionFormPopup  status="Create" onClose={() => setShowRequisitionModal(false)}></RequisitionFormPopup>}
            </div>
        </main>
    </ProtectedRoute>
    )
}