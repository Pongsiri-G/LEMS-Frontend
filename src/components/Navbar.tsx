"use client"
import { Button } from "@heroui/button";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, SharedSelection } from "@heroui/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function Navbar() {
  const pathname = usePathname();
  const [selectedKeys, setSelectedKeys] = useState("TH (ภาษาไทย)");
  const onSelect = (key: SharedSelection) => {
    setSelectedKeys(key.currentKey ?? "TH (ภาษาไทย)")
    console.log(key)
  }


  return <>
    <div className="flex justify-between fixed left-0 right-0 py-3 shadow-sm px-4 z-10 bg-background top-0">
      <div className="flex gap-8 items-center">
        <Image src={"/CNCLogo.svg"} alt="CNC Logo" width={60} height={60} />
        <button className={clsx("cursor-pointer hover:scale-95 transition-all", { "text-primary": pathname === "/borrow-return" })}>ยืม-คืนสิ่งของ</button>
        <button className="cursor-pointer hover:scale-95 transition-all">คำร้อง</button>
        <button className="cursor-pointer hover:scale-95 transition-all">จัดการสิ่งของ</button>
        <button className="cursor-pointer hover:scale-95 transition-all">จัดการผู้ใช้</button>
      </div>
      <div className="flex gap-7">
        <Dropdown>
          <DropdownTrigger>
            <Button className="capitalize" variant="bordered">
              {selectedKeys}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Single selection example"
            selectedKeys={selectedKeys}
            selectionMode="single"
            variant="flat"
            onSelectionChange={onSelect}
          >
            <DropdownItem key="TH (ภาษาไทย)">TH (ภาษาไทย) </DropdownItem>
            <DropdownItem key="EN (English)">EN (English) </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <div className="w-[40px] h-[40px] bg-neutral rounded-full"></div>
      </div>
    </div>
  </>
}