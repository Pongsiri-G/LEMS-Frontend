"use client";
import { Button } from "@heroui/button";
import Image from "next/image";
import MovingCloudBG from "../components/MovingCloudBG";

export default function Home() {
  return (
    <main className="flex flex-col justify-start items-center gap-20 mt-20 pt-10">
      {
        // <>
        //   <Button
        //     className="bg-linear-to-tr from-pink-500 to-yellow-500 text-white shadow-lg outline-none"
        //     radius="full"
        //   >
        //     Button
        //   </Button>
        // </>
      }
      <div className="relative min-h-screen !gap !mt w-full flex flex-col justify-start items-center">
        <MovingCloudBG />
      </div>
    </main>
  );
}
