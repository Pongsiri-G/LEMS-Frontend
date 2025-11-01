'use client'

import CheckBox from "@/src/components/equipment-mange/CheckBox"
import MovingCloudBG from "@/src/components/MovingCloudBG"
import ProtectedRoute from "@/src/components/ProtectedRoute"
import FormDetailPopup from "@/src/components/request/FormDetailPopup"
import { apiClient } from "@/src/services/apiClient"
import { Button } from "@heroui/button"
import { getKeyValue, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react"
import { AxiosResponse } from "axios"
import { FilePlusIcon, FilesIcon, PaperclipIcon, ArrowUpFromLineIcon, CircleXIcon, XIcon } from "lucide-react"
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
    {
        key: "checkbox",
        label: ""
    },
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
    const [ requests, setRequests ] = useState<RequestForm[]>([])
    const [ selectedRequests, setSelectedRequests ] = useState<RequestForm[]>([])
    const [ showRequestDetailModal, setShowRequestDetailModal ] = useState(false)
    const [ showExportModal, setShowExportModal ] = useState(false)
    const [ reqToShow, setReqToShow ] = useState<RequestForm>()
    const [ showExportMode, setShowExportMode ] = useState(false)
    const router = useRouter()
    const [checkMap, setCheckMap] = useState<{ id: string, check: boolean }[]>([])
    const [renderKey, setRenderKey] = useState(0);

    const generateCheckMap = (data: RequestForm[]) => {
        const selectID: string[] = selectedRequests.map((e) => e.request_id);
        const map = data.map((e) => ({
        id: e.request_id,
        check: selectID.includes(e.request_id)
        }));
        return map
    };

    async function downloadFile(exportType: string) {
        try {
            
            const reqToExport = selectedRequests.map(i => i.request_id);

            const httpReq = {
                requests: reqToExport,
                export_type: exportType
            }
            
            const response = await apiClient.post("/v1/requests/export", httpReq, {
                responseType: "blob", 
            });
            

            const blob = new Blob([response.data], { type: response.data.type || "application/octet-stream" });
            const url = window.URL.createObjectURL(blob);

            
            const a = document.createElement("a");
            a.href = url;

            document.body.appendChild(a);
            a.click();

            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed:", error);
        }
    }

    const loadRequests = async (exportFilter?: boolean) => {
        try {
            const path = exportFilter ? "/v1/requests?status=ACCEPTED&type=REQUEST" : "/v1/requests"
            const response: AxiosResponse<RequestForm[]> = await apiClient.get(path)

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
            setRequests(response.data)
            setIsReady(true)
        } catch(error) {
            console.log(error)
        }
        
    }

    const addReq = (req: RequestForm) => {
        setSelectedRequests(prev => [...prev, req])
        setCheckMap((prev) =>
            prev.map((m) => (m.id === req.request_id ? { ...m, check: true } : m))
        );
        setRenderKey(k => (k + 1) % 100);
    }
    
    const removeReq = (req: RequestForm) => {
        setSelectedRequests(prev =>
            prev.filter(r => r.request_id !== req.request_id)
        )
        setCheckMap((prev) =>
            prev.map((m) => (m.id === req.request_id ? { ...m, check: false } : m))
        );
        setRenderKey(k => (k + 1) % 100);
    }

    const loadCheckMap = () => {
        if (requests.length > 0) {
            const map = generateCheckMap(requests);
            setCheckMap([...map]);
        }
    }
    
    useEffect(() => {
        loadRequests();
    }, []);

    useEffect(() => {
        loadCheckMap();
    }, [requests, selectedRequests])

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
                        {!showExportMode ? <Button className="w-35 h-10 bg-[#ffe16a] hover:scale-95"
                            onPress={async () => {
                                await loadRequests(true)
                                setShowExportMode(true)
                            }}
                        >
                            <ArrowUpFromLineIcon color="black" />
                            <span className="hidden lg:inline text-black">นำออกคำร้อง</span>
                        </Button> : ""}
                        {showExportMode ? <Button className={`w-45 h-10 bg-[#ffe16a] hover:scale-95 ${selectedRequests.length != 0 ? "bg-[#7ac272]" : "bg-[#9e9b9b] cursor-not-allowed"}`}
                            onPress={() => setShowExportModal(true)}
                            disabled={selectedRequests.length == 0}
                        >
                            <ArrowUpFromLineIcon color="black" />
                            <span className="hidden lg:inline text-black">export คำร้องที่เลือก</span>
                        </Button> : ""}
                        {showExportMode ? <Button className="w-40 h-10 bg-[#d6665e] hover:scale-95"
                            onPress={async () => {
                                await loadRequests()
                                generateCheckMap(requests)
                                setShowExportMode(false)
                            }}
                        >
                            <XIcon color="black" />
                            <span className="hidden lg:inline text-black">ยกเลิกการนำออก</span>
                        </Button> : ""}
                        <Button className="w-35 h-10 bg-[#ffe16a] hover:scale-95"
                            onPress={() => {router.push("/request/my-submission")}}
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
                        <Table aria-label="Example table with dynamic content" className="w-full" key={`${renderKey}`}>
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
                                        {(columnKey) => <TableCell className="text-md  cursor-pointer" onClick={() => {
                                            const selectedReq = requests.find((req) => req.request_id === item.id)
                                            if (selectedReq) {
                                                setReqToShow(selectedReq)
                                                setShowRequestDetailModal(true)
                                            }
                                        }}>{
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
                                                    ) : columnKey === "checkbox" && showExportMode ? (
                                                    // status column
                                                    <div onClick={(e)=>{e.stopPropagation()}}>
                                                        {(() => {
                                                            const req = requests.find((r) => r.request_id === item.id);
                                                            const mapEntry = checkMap.find((m) => m.id === item.id);

                                                            if (!req || !mapEntry) return null;

                                                            return (
                                                                    <CheckBox
                                                                        iconSize={16}
                                                                        req={req}
                                                                        addReq={addReq}
                                                                        removeReq={removeReq}
                                                                        checkMap={mapEntry}
                                                                    />
                                                            );
                                                            })()}
                                                    </div>
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
                {showRequestDetailModal && <FormDetailPopup onClose={()=>{ setShowRequestDetailModal(false) }} 
                onSuccess={async () => {
                    setIsReady(false)
                    await loadRequests()
                }}
                req={reqToShow!}></FormDetailPopup>}
                {showExportModal && <div>
                    <div className="fixed inset-0 bg-black/75 flex justify-center items-center z-20 transition-all">
                        <div className="flex justify-center items-center">
                            <div className="bg-white rounded-2xl w-75 h-45 p-5 overflow-hidden flex flex-col">
                                <div className="flex justify-end items-start">
                                    <CircleXIcon className="text-black hover:scale-120 hover:text-[#d6665e] cursor-pointer transition-all" onClick={()=>{setShowExportModal(false)}}></CircleXIcon>
                                </div>
                                <div className="flex flex-col gap-5 justify-center items-center h-full">
                                    <p>โปรดเลือกนามสกุลไฟล์ที่ต้องการนำออก</p>
                                    <Button className="w-45 h-10 bg-primary hover:scale-95"
                                        onPress={() => {downloadFile("XLS")}}
                                    >
                                        <img src={"/images/excel.png"} width={32} height={32}></img>
                                        <span className="hidden lg:inline text-white">นำออกเป็นไฟล์ Excel</span>
                                    </Button>

                                </div>
                            </div>
                        </div>  
                    </div>
                </div>
                }
            </div>
        </main>
    </ProtectedRoute>
    )
}