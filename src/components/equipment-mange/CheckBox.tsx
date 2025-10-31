'use client'
import { Item } from "@/src/types/item"
import clsx from "clsx"
import { Check } from "lucide-react"
import { useEffect, useState } from "react"

interface CheckBoxProps {
  iconSize: number,
  item?: Item,
  req?: RequestForm,
  addItem?: (data: Item) => void,
  addReq?: (data: RequestForm) => void,
  removeItem?: (data: Item) => void
  removeReq?: (data: RequestForm) => void
}
export default function CheckBox({ iconSize, item, addItem, removeItem, req, addReq, removeReq}: CheckBoxProps) {
  const [check, setCheck] = useState(false)


  return <>
    <button
      onClick={() => {
        if (!check) {
          console.log("ADD")
          if (item && addItem) {
            addItem(item)
          }
          if (req && addReq) {
            addReq(req)
          }
        } else {
          console.log("REMOVE")
          if (item && removeItem) {
            removeItem(item)
          }
          if (req && removeReq) {
            removeReq(req)
          }
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