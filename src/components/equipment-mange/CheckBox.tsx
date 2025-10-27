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
}
export default function CheckBox({ iconSize, item, addItem, removeItem }: CheckBoxProps) {
  const [check, setCheck] = useState(false)


  return <>
    <button
      onClick={() => {
        if (!check) {
          console.log("ADD")
          addItem(item)
        } else {
          console.log("REMOVE")
          removeItem(item)
        }
        setCheck(!check)
      }} className={clsx(`transition-colors rounded  p-1`, {
        "bg-primary border-1 border-primary cursor-pointer ": check,
        "border-1 border-neutral cursor-pointer": !check,
      })}>
      <Check size={iconSize} className={clsx("stroke-white", { "opacity-0": !check, "opacity-100": check })} />
    </button>
  </>
}