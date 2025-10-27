"use client"
import { useEffect, useState } from "react"
import clsx from "clsx"
import { X } from "lucide-react"
import CheckBox from "./CheckBox"
import { apiClient } from "@/src/services/apiClient"
import { Item, toItem } from "@/src/types/item"

export default function DropDownCheckBox({ isOpen, setSelectedItem, selectedItem }:
  {
    isOpen: boolean,
    setSelectedItem: (data: { id: string, name: string }[]) => void
    selectedItem: { id: string, name: string }[]
  }
) {
  const [item, setItem] = useState<Item[]>([])

  const fetchAllItem = async () => {
    const res = await apiClient.get("/v1/item/list")
    console.log(res.data)
    const newItem = res.data.map((e: any) => {
      return toItem(e)
    })
    setItem(newItem)
  }

  useEffect(() => {
    fetchAllItem()
  }, [])
  return <>
    <div className={clsx("transition-all bg-background absolute z-20 -top-[210px] px-3 w-full shadow-xs outline-solid outline-transparent tap-highlight-transparent border-medium border-default-200 data-[hover=true]:border-default-400 data-[open=true]:border-default-foreground data-[focus=true]:border-default-foreground rounded-medium flex-col items-start justify-center gap-0 motion-reduce:transition-none py-2 h-[200px] overflow-y-auto", {
      "opacity-0 scale-95 pointer-events-none": !isOpen
    })}>
      {

        item.map((element) => {
          return <div className="flex p-3 gap-3" key={element.itemID}>
            <CheckBox
              iconSize={15}
              item={element}
              addItem={(data: Item) => {
                setSelectedItem([...selectedItem, { id: data.itemID, name: data.itemName }])
              }}
              removeItem={(data: Item) => {
                let indexTarget = -1;
                for (let i = 0; i < selectedItem.length; i++) {
                  if (selectedItem[i].id === data.itemID) {
                    indexTarget = i
                    break
                  }
                }
                // const indexTarget = selectedItem.indexOf({ id: data.itemID, name: data.itemName })
                selectedItem.splice(indexTarget, 1)
                setSelectedItem([...selectedItem])
              }}
            />
            <p className="flex-1">{element.itemName}</p>
          </div>

        })
      }
    </div>
  </>
}