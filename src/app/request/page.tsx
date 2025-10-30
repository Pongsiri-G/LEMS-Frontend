'use client'

import MovingCloudBG from "@/src/components/MovingCloudBG"
import ProtectedRoute from "@/src/components/ProtectedRoute"
import { apiClient } from "@/src/services/apiClient"
import { Button } from "@heroui/button"
import { getKeyValue, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react"
import { AxiosResponse } from "axios"
import { FilePlusIcon, FilesIcon, PaperclipIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"


interface Row {
  id: string;
  status: string;
  create_date: string;
  update_date: string;
  form_type: string;
  title: string;
  attachment: string;
  owner: string;
}

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
    CANCELED: "#f5365c",
    COMPLETED:  "#0088ce",
}

export default function RequestPage() {
    const [ isReady, setIsReady ] = useState(false)
    const [ rows, setRows ] = useState<Row[]>([])
    const router = useRouter()

    useEffect(() => {
        const loadRequests = async () => {
            try {
                const response: AxiosResponse<RequestForm[]> = await apiClient.get("/v1/requests")

                const row = response.data.map((req) => ({
                    id: req.request_id,
                    status: req.request_status,
                    create_date: req.created_date,
                    update_date: req.updated_date,
                    form_type: req.request_type === "LOST" ? "ของเสีย/หาย" : "เบิกของ",
                    title: req.request_item_name,
                    attachment: req.request_image_url !== "" ? "yes" : "",
                    owner: req.created_by
                }))

                setRows(row)
                setIsReady(true)
            } catch(error) {
                console.log(error)
            }
            
        }
        loadRequests()
    }, [])

    if (!isReady) return;

    return (
    <ProtectedRoute>
        <main className="flex flex-col justify-start items-center gap-10 pt-5 mt-5">
            <div className="relative !gap !mt w-full flex flex-col justify-start items-center max-w-[1500px] md:max-w-[1300px]">
                <MovingCloudBG />
                <div className="flex flex-col justify-start w-full items-center gap-10 mt-5">
                    <div className="flex flex-col justify-start justify-items-center sm:justify-items-start items-center sm:items-start text-center gap-5 ">
                        <h3 className="text-3xl sm:text-3xl md:text-4xl font-bold">
                            <span className="">ระบบคำร้องและแบบฟอร์ม</span>
                        </h3>
                    </div>
                    <div className="flex flex-row w-full items-end justify-end gap-3">
                        <Button className="w-35 h-10 bg-[#ffe16a] hover:scale-95"
                            onPress={() => router.push("/request/my-submission")}
                        >
                            <FilesIcon color="black" />
                            <span className="hidden lg:inline text-black">คำร้องของฉัน</span>
                        </Button>
                        <Button className="w-35 h-10 bg-primary hover:scale-95"
                            onPress={() => router.push("/request/create")}
                        >
                            <FilePlusIcon color="white" />
                            <span className="hidden lg:inline text-white">เพิ่มสิ่งของ</span>
                        </Button>
                    </div>
                        <Table aria-label="Example table with dynamic content" className="w-full">
                            <TableHeader columns={columns}>
                                {columns.map((column) => (
                                <TableColumn key={column.key} className="text-md ">{column.label}</TableColumn>
                                ))}
                            </TableHeader>
                            <TableBody
                                items={rows}
                                emptyContent={"Nothing to display."}>
                                {(item) => (
                                    <TableRow key={item.id} className="hover:bg-neutral-100 transition-all cursor-default rounded-xl">
                                        {(columnKey) => <TableCell className="text-md">{
                                            columnKey === "attachment" && item.attachment === "yes" ? (
                                                <div className="flex border border-[#3d9ae2] rounded-full bg-[#bddbff] w-8 h-8 items-center justify-center">
                                                    <PaperclipIcon className="inline-block text-[#3d9ae2]" />
                                                </div>
                                                ) : columnKey === "status" ? (
                                                    // status column
                                                    <span
                                                        style={{
                                                        color: statusColor[item.status] || "inherit",
                                                        fontWeight: 600,
                                                        }}
                                                    >
                                                        {item.status}
                                                    </span>
                                                    ) : (
                                                getKeyValue(item, columnKey)
                                            )
                                        }
                                        </TableCell>}
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                </div>
            </div>
        </main>
    </ProtectedRoute>
    )
}