"use client"
import { Button } from "@heroui/button";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Button
        className="bg-linear-to-tr from-pink-500 to-yellow-500 text-white shadow-lg outline-none"
        radius="full"
      >
        Button
      </Button>
    </>
  );
}
