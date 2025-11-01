'use client'
import { Item } from "@/src/types/item"
import clsx from "clsx"
import { Check } from "lucide-react"
import { useEffect, useState } from "react"

interface CheckBoxProps {
  iconSize: number,
  item: Item,
  addItem: (data: Item) => void,
  removeItem: (data: Item) => void
  checkMap: { id: string, check: boolean }
}
export default function CheckBox({ iconSize, item, addItem, removeItem, checkMap }: CheckBoxProps) {
  return <>
    <button
      onClick={() => {
        if (!checkMap.check) {
          addItem(item)
        } else {
          removeItem(item)
        }
      }} className={clsx(`transition-colors rounded  p-1 h-fit`, {
        "bg-primary border-1 border-primary cursor-pointer ": checkMap.check,
        "border-1 border-neutral cursor-pointer": !checkMap.check,
      })}>
      <Check size={iconSize} className={clsx("stroke-white", { "opacity-0": !checkMap.check, "opacity-100": checkMap.check })} />
    </button>
  </>
}