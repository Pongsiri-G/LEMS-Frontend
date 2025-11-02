"use client";

import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalBody } from "@heroui/modal";
import { Input } from "@heroui/input";
import { Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { useState, useRef, useEffect } from "react";
import { Plus, Upload, UploadCloud, X } from "lucide-react";
import ColorPickerPopup from "./ColorPickerPopup";
import DropDownCheckBox from "./DropDownCheckBox";
import SelectorCopyCat from "./SelectorCopyCat";
import { apiClient } from "@/src/services/apiClient";
import { useToast } from "@/src/hook/ToastContext";
import { fetchItemDetail } from "@/src/utils/itemUtils";
import { Item, toItem } from "@/src/types/item";
import { Tag, toTag } from "@/src/types/Tag";

interface PopupProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onOpen: () => void;
  fetchItemDetails: () => void;
  item?: Item
}

export default function Popup(props: PopupProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [itemName, setItemName] = useState("");
  const [status, setStatus] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [requirement, setRequirement] = useState<{ id: string, name: string }[]>([]);
  const [oldRequirement, setOldRequirement] = useState<{ id: string, name: string }[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [oldTags, setOldTags] = useState<Tag[]>([]);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isOpenDropDown, setIsOpenDropDown] = useState(false)
  const [currentQuantity, setCurrentQuantity] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast()

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const updateTags = () => {
    try {
      const addTags = tags.filter((e, i) => {
        if (!oldTags.some(item => item.id === tags[i].id)) {
          return e
        }
      })
      console.log(addTags)
      addTags.forEach(async (e) => {
        // const res = await apiClient.post(`/v1/tag`, {
        //   name: e.name,
        //   color: e.color
        // })
        await apiClient.post(`/v1/tag/assign/${props.item?.itemID}/${e.id}`)
      })

      const removeTags = oldTags.filter((e, i) => {
        if (!tags.some(item => item.id === oldTags[i].id)) {
          return e
        }
      })
      // console.log("REMOVE", removeTags)
      removeTags.forEach(async (e) => {
        await apiClient.delete(`/v1/tag/unassign/${props.item?.itemID}/${e.id}`)
      })
    } catch (e: any) {
      throw e
    }
  }

  const updateRequirement = () => {
    try {
      const addRequireItem = requirement.filter((e, i) => {
        if (!oldRequirement.some(item => item.id === requirement[i].id)) {
          return e
        }
      })
      addRequireItem.forEach(async (e) => {
        await apiClient.post(`/v1/item/assign-item-set/${props.item?.itemID}/${e.id}`)
      })
      const removeRequireItem = oldRequirement.filter((e, i) => {
        if (!requirement.some(item => item.id === oldRequirement[i].id)) {
          return e
        }
      })
      removeRequireItem.forEach(async (e) => {
        await apiClient.post(`/v1/item/remove-item-set/${props.item?.itemID}/${e.id}`)
      })
    } catch (e: any) {
      throw e
    }
  }

  const handdleUpdate = async () => {
    try {
      if (props.item !== undefined) {
        if (parseInt(quantity) < currentQuantity) {
          throw Error("กรุณากรอกจำนวนสิ่งของไม่น้อยกว่า " + currentQuantity)
        }
        const newImage = await uploadImage()
        const res = await apiClient.put("/v1/item", {
          item_id: props.item.itemID,
          name: itemName,
          description: description || null,
          image_url: newImage || null,
          quantity: parseInt(quantity),
          status: status || null,
        })
        await updateTags()
        await updateRequirement()
        showToast("อัปเดตข้อมูลสำเร็จ", "success")
        props.fetchItemDetails()
        props.onOpenChange()
      }
    } catch (e: any) {
      if (e.data === undefined || e.data === null) {
        showToast("เกิดข้อผิดพลาด: " + e.message, "error")
        return
      }
      showToast("เกิดข้อผิดพลาด: " + e.data.message, "error")
    }
  }

  const initDataForUpdate = async () => {
    if (props.item !== undefined) {
      const currentItem = props.item
      setItemName(currentItem.itemName)
      setStatus(currentItem.itemStatus)
      setQuantity(String(currentItem.itemQuantity))
      setCurrentQuantity(currentItem.itemCurrentQuantity)
      setDescription(currentItem.itemDescription)

      const url = `/v1/image`
      const res = await apiClient.post(url, {
        "url": currentItem.itemPictureURL
      }, { responseType: 'blob' })
      const blob = res.data as File
      setSelectedImage(blob)

      const childItemRes = await apiClient.get(`/v1/item/child/${currentItem.itemID}`)
      const childItems: { id: string, name: string }[] = childItemRes.data.map((element: any) => {
        const newChild = toItem(element)
        return { id: newChild.itemID, name: newChild.itemName }
      })
      setRequirement([...childItems])
      setOldRequirement([...childItems])

      const tags = await apiClient.get(`/v1/tag/${currentItem.itemID}`)
      const targetTags: Tag[] = tags.data.map((e: any) => toTag(e))
      setTags([...targetTags])
      setOldTags([...targetTags])
    }
  }

  useEffect(() => {
    initDataForUpdate()
  }, [props.isOpen])

  useEffect(() => {
  }, [requirement])

  const clearForm = () => {
    if (props.item === undefined) {
      setItemName("")
      setStatus("")
      setQuantity("")
      setDescription("")
      setSelectedImage(null)
      setRequirement([])
      setTags([])
      setErrors({})
    }
  }

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!itemName.trim()) {
      newErrors.itemName = "กรุณากรอกชื่อสิ่งของ";
    }

    if (!status) {
      newErrors.status = "กรุณาเลือกสถานะสิ่งของ";
    }

    if (!quantity || parseInt(quantity) <= 0) {
      newErrors.quantity = "กรุณากรอกจำนวนสิ่งของที่ถูกต้อง";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const deleteTag = (id: string) => {
    const index = tags.findIndex(item => item.id === id);
    tags.splice(index, 1)
    setTags([...tags])
    console.log(tags)
  }



  const handleTagCreated = (newTag: string, color: string, id: string) => {
    if (tags.some((item) => item.id === id)) {
      throw Error("ไม่สามารถเลือก tag ซ้ำได้")
    }
    setTags([...tags, { name: newTag, color: color, id: id }]);
    setIsColorPickerOpen(false);
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

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const imageURL = await uploadImage()
        const tagsID = tags.map((e) => e.id)
        const prerequisite = requirement.map((e) => e.id)
        const payload = {
          name: itemName,
          description: description || null,
          image_url: imageURL || null,
          quantity: parseInt(quantity),
          status: status || null,
          prerequisite: prerequisite.length > 0 ? prerequisite : null,
          tags: tagsID.length > 0 ? tagsID : null,
        }
        console.log(payload)

        await apiClient.post("/v1/item", payload)
        props.fetchItemDetails()
        showToast(`เพิ่มข้อมูล ${itemName} สำเร็จ`, "success")
      } catch (e: any) {
        showToast(e.response?.data?.message || "เกิดข้อผิดพลาด", "error")
      }
    }
  };

  return (
    <>
      <Modal
        hideCloseButton={true}
        isOpen={props.isOpen}
        onOpenChange={props.onOpenChange}
        size="4xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="py-6">
                <div className="flex flex-col gap-4">
                  {/* Header */}
                  <h1 className="text-2xl font-bold">เพิ่มสิ่งของ</h1>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left Column - Image Upload */}
                    <div className="flex flex-col gap-4">
                      <div
                        onClick={handleClickUpload}
                        className="h-64 border-3 border-dashed border-gray-500 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        {selectedImage ? (
                          <img
                            src={URL.createObjectURL(selectedImage)}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <>
                            <UploadCloud className="w-10 h-10 text-primary" />
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
                      <Button
                        variant="flat"
                        className="bg-gray-300 text-gray-700"
                        onPress={handleClickUpload}
                      >
                        อัปโหลดรูปเพิ่ม
                      </Button>
                    </div>

                    {/* Right Column - Form Fields */}
                    <div className="flex flex-col gap-4">
                      {/* Item Name */}
                      <Input
                        label="ชื่อสิ่งของ"
                        placeholder=""
                        value={itemName}
                        onValueChange={setItemName}
                        isRequired
                        isInvalid={!!errors.itemName}
                        errorMessage={errors.itemName}
                        variant="bordered"
                      />

                      {/* Status and Quantity */}
                      <div className="flex gap-4 ">
                        <Select
                          label="สถานะสิ่งของ"
                          placeholder=""
                          selectedKeys={status ? [status] : []}
                          onSelectionChange={(keys) => setStatus(Array.from(keys)[0] as string)}
                          isRequired
                          isInvalid={!!errors.status}
                          errorMessage={errors.status}
                          variant="bordered"
                        >
                          <SelectItem key="AVAILABLE">
                            ยืมได้
                          </SelectItem>
                          <SelectItem key="IN-LAB ONLY">
                            ใช้ได้ภายในแลปเท่านั้น
                          </SelectItem>
                        </Select>

                        <div className="flex items-end gap-2">
                          <Input
                            label="จำนวน"
                            placeholder=""
                            value={quantity}
                            onValueChange={setQuantity}
                            isRequired
                            isInvalid={!!errors.quantity}
                            errorMessage={errors.quantity}
                            variant="bordered"
                            type="number"
                          />
                          <span
                            className="inline-flex items-center justify-center px-4 py-2 text-white bg-primary rounded-lg font-medium mb-0.5 text-base h-full"
                          >
                            หน่วย
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <Textarea
                        label="คำอธิบาย"
                        placeholder=""
                        value={description}
                        onValueChange={setDescription}
                        minRows={4}
                        variant="bordered"
                        classNames={{
                          input: "min-h-[120px]",
                        }}
                      />
                      <div className="relative">
                        <SelectorCopyCat
                          selectedItemName={requirement.map((e) => e.name)}
                          setPopupIsOpen={(status: boolean) => {
                            setIsOpenDropDown(status)
                          }} />
                        <DropDownCheckBox
                          itemID={props.item?.itemID}
                          isOpen={isOpenDropDown}
                          setSelectedItem={(data: { id: string, name: string }[]) => {
                            setRequirement([...data])
                          }}
                          selectedItem={requirement}
                        />
                      </div>
                      {/* <Select
                        label="ต้องใช้ร่วมกับ"
                        placeholder=""
                        selectedKeys={requirement ? requirement : []}
                        onSelectionChange={(keys) => setRequirement(Array.from(keys)[0] as string)}
                        variant="bordered"
                      >
                        <SelectItem key="none">
                          ไม่มี
                        </SelectItem>
                        <SelectItem key="item1">
                          สิ่งของ 1
                        </SelectItem>
                        <SelectItem key="item2">
                          สิ่งของ 2
                        </SelectItem>
                      </Select> */}
                    </div>
                  </div>


                  {/* Tag */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Tag:</span>
                    <Button
                      isIconOnly
                      size="sm"
                      color="primary"
                      className="rounded-full"
                      onPress={() => setIsColorPickerOpen(true)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    {
                      tags.map((element, index) => {
                        return (
                          <div className="flex items-center justify-center rounded-full p-2 gap-2" key={element.id}
                            style={{
                              backgroundColor: element.color
                            }}
                          >
                            <span
                              className="text-sm text-white flex gap-3"
                              key={index}
                            >
                              {element.name}
                            </span>
                            <button onClick={() => {
                              deleteTag(element.id)
                            }}>
                              <X className="stroke-white cursor-pointer" size={15} />
                            </button>
                          </div>
                        )

                      })
                    }
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 mt-4">
                    <Button
                      className="bg-primary text-white font-medium flex-1"
                      size="lg"
                      onPress={async () => {
                        if (props.item !== undefined) {
                          await handdleUpdate()
                        } else {
                          await handleSubmit()
                          props.onOpenChange()
                        }
                      }}
                    >
                      {props.item !== undefined ? "อัปเดตข้อมูล" : "ยืนยัน"}
                    </Button>
                    {
                      props.item !== undefined ?
                        <></>
                        :
                        <Button
                          className="bg-primary text-white font-medium flex-1"
                          size="lg"
                          onPress={async () => {
                            await handleSubmit()
                            clearForm()
                          }}
                        >
                          เพิ่มของต่อเนื่อง
                        </Button>
                    }
                    <Button
                      className=" text-foreground font-medium border-neutral border-1 bg-background flex-1"
                      size="lg"
                      onPress={() => {
                        clearForm()
                        onClose()
                      }}
                    >
                      ยกเลิก
                    </Button>
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Color Picker Popup */}
      <ColorPickerPopup
        isOpen={isColorPickerOpen}
        onOpenChange={() => setIsColorPickerOpen(false)}
        onTagCreated={handleTagCreated}
      />
    </>
  );
}