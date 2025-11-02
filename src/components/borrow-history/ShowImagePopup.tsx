"use client"
import { apiClient } from "@/src/services/apiClient"
import { Modal, ModalBody, ModalContent } from "@heroui/react"
import { useEffect, useState } from "react"

interface ShowImagePopupProps {
  imageURL: string
  isOpen: boolean
  onOpenChange: () => void
}

export default function ShowImagePopup(props: ShowImagePopupProps) {
  const [image, setImage] = useState("")

  const getImage = async (url: string) => {
    console.log("URL", url)
    if (url === "" || url === undefined || url === null) {
      return
    }
    const res = await apiClient.post("/v1/image", {
      "url": url
    }, { responseType: 'blob' })
    const blob = res.data as File
    setImage(URL.createObjectURL(blob))
  }

  useEffect(() => {
    if (props.imageURL !== "") {
      getImage(props.imageURL)
    }
  }, [props.imageURL])

  return <>
    <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange} className="p-3.5">
      <ModalContent>
        <ModalBody>
          {
            image === "" ?
              <>
                <p>ไม่พบข้อมูลรูปภาพการคืน</p>
              </>
              :
              <img
                className="rounded-2xl max-w-[500px] max-h-[500px] object-cover"
                src={image}
              />
          }
        </ModalBody>
      </ModalContent>
    </Modal>
  </>
}