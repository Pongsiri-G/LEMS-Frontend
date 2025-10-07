"use client";

import { Button } from "@heroui/button";
import { Modal, ModalContent, ModalBody } from "@heroui/modal";
import { Input } from "@heroui/input";
import { Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { useState, useRef } from "react";
import { Plus, Upload } from "lucide-react";
import ColorPickerPopup from "./ColorPickerPopup";

interface PopupProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onOpen: () => void;
}

export default function Popup(props: PopupProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [itemName, setItemName] = useState("");
  const [status, setStatus] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [requirement, setRequirement] = useState("");
  const [tag, setTag] = useState("เพิ่ม");
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
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

  const handleTagCreated = (newTag: string, color?: string) => {
    setTag(newTag);
    setIsColorPickerOpen(false);
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Handle form submission here
      console.log({
        itemName,
        status,
        quantity,
        description,
        requirement,
        tag,
        selectedImage
      });
      props.onOpenChange();
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
                            src={selectedImage}
                            alt="Preview"
                            className="w-full h-full object-cover rounded-lg"
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
                      <div className="grid grid-cols-2 gap-4">
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
                          <SelectItem key="UNAVAILABLE">
                            ไม่สามารถยืมได้
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
                            className="inline-flex items-center justify-center px-4 py-2 text-white bg-primary rounded-lg font-medium mb-0.5 text-base"
                            style={{ height: "40px" }}
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
                      <Select
                        label="ต้องใช้ร่วมกับ"
                        placeholder=""
                        selectedKeys={requirement ? [requirement] : []}
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
                      </Select>
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
                    <span className="text-sm px-3 py-1 bg-gray-200 rounded-full">
                      {tag}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <Button
                      className="bg-blue-400 text-white font-medium"
                      size="lg"
                      onPress={handleSubmit}
                    >
                      ยืนยัน
                    </Button>
                    <Button
                      className="bg-yellow-300 text-gray-800 font-medium"
                      size="lg"
                    >
                      เพิ่มของชิ้นอื่น
                    </Button>
                    <Button
                      className="bg-pink-400 text-white font-medium"
                      size="lg"
                      onPress={onClose}
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