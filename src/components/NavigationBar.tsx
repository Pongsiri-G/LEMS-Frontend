"use client";

import React, { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Dropdown,
  Button,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  SharedSelection,
} from "@heroui/react";
import Image from "next/image";
import { useAuth } from "../contexts/authContext";
import { userRoles } from "../constants/user";

export function NavigationBar() {
  const [selectedKeys, setSelectedKeys] = useState("TH (ภาษาไทย)");

  const { user, isAuthenticated } = useAuth();

  const onSelect = (key: SharedSelection) => {
    setSelectedKeys(key.currentKey ?? "TH (ภาษาไทย)")
    console.log(key)
  }
  return (
    <Navbar
      maxWidth="full"
      className="border-b border-[1px] border-[rgba(0,0,0,0.045)] py-[1px] sm:px-[10px] md:px-[45px] px-[25px]"
    >
      <NavbarBrand className="!flex-none mr-3">
        <Link href="/" className="font-bold text-xl flex items-center">
          <Image
            src="/images/cnclogo.png"
            width={64}
            height={45}
            priority
            alt="logo"
          />
        </Link>
      </NavbarBrand>

      <NavbarContent justify="start" className="flex gap-5 items-center">
        <NavbarItem>
          <Link
            href="/borrow-return"
            className="text-foreground hover:text-primary transition hover:text-[rgba(27,160,240,1)]"
          >
            ยืม-คืนสิ่งของ
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            href="/"
            className="text-foreground hover:text-primary transition hover:text-[rgba(27,160,240,1)]"
          >
            คำร้อง
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link
            href="/"
            className="text-foreground hover:text-primary transition hover:text-[rgba(27,160,240,1)]"
          >
            จัดการสิ่งของ
          </Link>
        </NavbarItem>
        {user?.userRole === userRoles.ADMIN && (
          <NavbarItem>
            <Link
              href="/"
              className="text-foreground hover:text-primary transition hover:text-[rgba(27,160,240,1)]"
            >
              จัดการผู้ใช้
            </Link>
          </NavbarItem>
        )}
      </NavbarContent>

      {/* TODO: นำ user token มาเช็ก หากมี user token (already logged in) ให้โชว์แค่ profile หากไม่มีให้โชว์ปุ่ม login ไม่โชว์ทั้งคู่พร้อมกัน */}
      <NavbarContent justify="end">
        {!isAuthenticated || !user ? (
          <NavbarItem>
            <div className="flex items-center">
              <Link
                href="/login"
                className="rounded-full border-[1px] py-2 px-4 transition-all hover:scale-95 inline-flex items-center justify-center"
              >
                เข้าสู่ระบบ
              </Link>
            </div>
          </NavbarItem>
        ) : (
          <div>
            <NavbarItem>
              <Dropdown className="hover:scale-95">
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
            </NavbarItem>
            <NavbarItem>
              <Link href="/" className="flex items-center">
                <Image
                  src="/images/to-be-added-later"
                  alt="User Avatar"
                  width={60}
                  height={60}
                  className="rounded-full border-2 border-gray-300 hover:border-primary transition"
                />
              </Link>
            </NavbarItem>
          </div>
        )}
      </NavbarContent>
    </Navbar>
  )
}

export default NavigationBar;
