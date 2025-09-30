"use client";

import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
} from "@heroui/react";
import Image from "next/image";

export function NavigationBar() {
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
            href="/items"
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
        <NavbarItem>
          <Link
            href="/"
            className="text-foreground hover:text-primary transition hover:text-[rgba(27,160,240,1)]"
          >
            จัดการผู้ใช้
          </Link>
        </NavbarItem>
      </NavbarContent>

      {/* TODO: นำ user token มาเช็ก หากมี user token (already logged in) ให้โชว์แค่ profile หากไม่มีให้โชว์ปุ่ม login ไม่โชว์ทั้งคู่พร้อมกัน */}
      <NavbarContent justify="end">
        <NavbarItem>
          <div className="flex items-center">
            <Link
              href="/login"
              className="rounded-full border-black border-[1px] py-[11px] px-[22px] font-[400] text-[16px] hover:scale-90 transition-all text-[rgba(27,160,240,1)] hover:bg-black hover:text-white inline-flex items-center justify-center"
            >
              เข้าสู่ระบบ
            </Link>
          </div>
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
      </NavbarContent>
    </Navbar>
  );
}

export default NavigationBar;
