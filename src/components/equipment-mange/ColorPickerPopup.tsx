"use client";

import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalBody, ModalHeader } from "@heroui/modal";
import { Input } from "@heroui/input";
import { useEffect, useState } from "react";
import { SketchPicker, ColorResult } from 'react-color';
import { v4 as uuidv4 } from "uuid";
import { apiClient } from "@/src/services/apiClient";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import { Tag, toTag } from "@/src/types/Tag";
import { Plus } from "lucide-react";
import { useToast } from "@/src/hook/ToastContext";

interface ColorPickerPopupProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onTagCreated?: (tag: string, color: string, id: string) => void;
}

export default function ColorPickerPopup(props: ColorPickerPopupProps) {
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedColor, setSelectedColor] = useState("#3B82F6");
  const [tagName, setTagName] = useState("");
  const [previewTag, setPreviewTag] = useState("");
  const [idTag, setIDTag] = useState("")
  const [toggleTagMode, setToggleTagMode] = useState(true)
  const { showToast } = useToast()

  const handleColorChange = (color: ColorResult) => {
    setSelectedColor(color.hex);
  };

  const fetchAllTag = async () => {
    const res = await apiClient.get("/v1/tags")
    const newTags = res.data.map((data: any) => toTag(data))
    setTags(newTags)
  }

  useEffect(() => {
    fetchAllTag()
  }, [])

  const handleTagNameChange = (value: string) => {
    setTagName(value);
    setPreviewTag(value);
  };

  const handleAddTag = async () => {
    if (tagName.trim()) {
      try {
        props.onTagCreated?.(tagName.trim(), selectedColor, idTag)
        setTagName("");
        setPreviewTag("");
        setSelectedColor("#3B82F6");
        props.onOpenChange();
      } catch (e: any) {
        showToast(e.message, "error")
      }
    }
  };

  const handleCreateTag = async () => {
    try {
      if (tagName.trim()) {
        const res = await apiClient.post("v1/tag", {
          name: tagName.trim(),
          color: selectedColor
        })
        setIDTag(res.data["id"])
        console.log("ID", res.data["id"])
        setTagName("");
        setPreviewTag("");
        setSelectedColor("#3B82F6");
        fetchAllTag()
        setToggleTagMode(true)
        showToast("สร้าง tag สำเร็จ", "success")
      }
    } catch (e: any) {
      showToast("สร้าง tag ไม่สำเร็จ" + e.data.response.message, "error")
    }
  };

  const handleCancel = () => {
    setTagName("");
    setPreviewTag("");
    setSelectedColor("#3B82F6");
    setToggleTagMode(true)
    props.onOpenChange();
  };

  return (
    <Modal
      hideCloseButton={true}
      isOpen={props.isOpen}
      onOpenChange={props.onOpenChange}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalBody className="py-6">
              {toggleTagMode ?
                <div className="flex flex-col gap-8">
                  <div className="text-center">
                    <h1 className="text-3xl font-bold text-primary mb-2">
                      เพิ่ม Tag สี
                    </h1>
                    <p className="text-gray-500">เพิ่ม Tag สีสำหรับจัดหมวดหมู่อุปกรณ์</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <p>เลือก Tag ที่ต้องการ</p>
                    <div className="flex flex-col gap-3">
                      <span className="text-sm">ตัวอย่าง Tag:</span>
                      <div className="flex items-center justify-center gap-3 p-6 bg-gray-50 rounded-xl min-h-[80px] border border-gray-200">
                        {previewTag ? (
                          <div className="flex items-center gap-3">
                            <div
                              className="w-4 h-4 rounded-full shadow-sm"
                              style={{ backgroundColor: selectedColor }}
                            />
                            <span
                              className="px-4 py-2 rounded-full text-sm font-semibold text-white shadow-lg transform hover:scale-105 transition-transform"
                              style={{ backgroundColor: selectedColor }}
                            >
                              {previewTag}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm italic">เลือก Tag เพื่อดูตัวอย่าง</span>
                        )}
                      </div>
                    </div>
                    <Dropdown className="w-full">
                      <DropdownTrigger>
                        <Button variant="bordered" className="w-full text-left">เลือก Tag</Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        className="w-full max-h-[300px] overflow-y-auto"
                      >
                        {
                          tags.map((e) => {
                            return (
                              <DropdownItem key={e.id} className="w-full" onPress={() => {
                                setSelectedColor(e.color)
                                handleTagNameChange(e.name)
                                setIDTag(e.id)
                              }}>
                                <div className="rounded-full p-3"
                                  style={{
                                    backgroundColor: e.color
                                  }}
                                >
                                  <p className="text-white">
                                    {e.name}
                                  </p>
                                </div>
                              </DropdownItem>
                            )
                          })
                        }
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                  <div className="flex flex-col gap-3">
                    <p>สร้าง Tag ใหม่</p>
                    <Button variant="bordered" onPress={() => {
                      handleTagNameChange("")
                      setSelectedColor("")
                      setToggleTagMode(!toggleTagMode)
                    }}>
                      <Plus className="stroke-neutral" />
                    </Button>
                  </div>
                  <div className="flex gap-5 mt-40">
                    <Button
                      color="primary"
                      className="font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex-1"
                      size="lg"
                      onPress={handleAddTag}
                      isDisabled={!tagName.trim()}
                    >
                      เพิ่ม Tag
                    </Button>
                    <Button
                      color="default"
                      variant="bordered"
                      className="font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex-1"
                      size="lg"
                      onPress={handleCancel}
                    >
                      ยกเลิก
                    </Button>
                  </div>

                </div>
                :
                <div className="flex flex-col gap-6 ">
                  <div className="text-center">
                    <h1 className="text-3xl font-bold text-primary mb-2">
                      สร้าง Tag สี
                    </h1>
                    <p className="text-gray-500">สร้าง Tag สีสำหรับจัดหมวดหมู่อุปกรณ์</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column - Color Picker */}
                    <div className="flex flex-col gap-4">
                      <div className="bg-gray-50 rounded-xl p-6 flex justify-center shadow-inner">
                        <SketchPicker
                          color={selectedColor}
                          onChange={handleColorChange}
                          disableAlpha={true}
                          presetColors={[
                            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
                            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
                            '#F8C471', '#82E0AA', '#F1948A', '#AED6F1', '#D2B4DE'
                          ]}
                        />
                      </div>

                      {/* Color Preview */}
                      <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                        <span className="text-sm font-semibold text-gray-700">สีที่เลือก:</span>
                        <div
                          className="w-8 h-8 rounded-full border-3 border-white shadow-lg ring-2 ring-gray-100"
                          style={{ backgroundColor: selectedColor }}
                        />
                        <span className="text-xs font-mono text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full">
                          {selectedColor.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Right Column - Tag Creation */}
                    <div className="flex flex-col gap-4">
                      {/* Tag Name Input */}
                      <Input
                        label="ชื่อ Tag"
                        placeholder="กรอกชื่อ Tag ที่ต้องการ"
                        value={tagName}
                        onValueChange={handleTagNameChange}
                        variant="bordered"
                        isRequired
                        classNames={{
                          input: "text-base",
                          inputWrapper: "border-2 hover:border-primary focus-within:border-primary"
                        }}
                      />

                      {/* Tag Preview */}
                      <div className="flex flex-col gap-3">
                        <span className="text-sm font-semibold text-gray-700">ตัวอย่าง Tag:</span>
                        <div className="flex items-center justify-center gap-3 p-6 bg-gray-50 rounded-xl min-h-[80px] border border-gray-200">
                          {previewTag ? (
                            <div className="flex items-center gap-3">
                              <div
                                className="w-4 h-4 rounded-full shadow-sm"
                                style={{ backgroundColor: selectedColor }}
                              />
                              <span
                                className="px-4 py-2 rounded-full text-sm font-semibold text-white shadow-lg transform hover:scale-105 transition-transform"
                                style={{ backgroundColor: selectedColor }}
                              >
                                {previewTag}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm italic">กรอกชื่อ Tag เพื่อดูตัวอย่าง</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <Button
                      color="primary"
                      className="font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                      size="lg"
                      onPress={handleCreateTag}
                      isDisabled={!tagName.trim()}
                    >
                      {/* <Tab className="w-4 h-4 mr-2" /> */}
                      สร้าง Tag
                    </Button>
                    <Button
                      color="default"
                      variant="bordered"
                      className="font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                      size="lg"
                      onPress={() => {
                        setTagName("");
                        setPreviewTag("");
                        setSelectedColor("#3B82F6");
                        setToggleTagMode(true)
                      }}
                    >
                      ยกเลิก
                    </Button>
                  </div>
                </div>
              }
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
