"use client"
import { useEffect, useState } from "react"
import clsx from "clsx"
import { X } from "lucide-react"
import CheckBox from "./CheckBox"
import { apiClient } from "@/src/services/apiClient"
import { Item, toItem } from "@/src/types/item"

export default function DropDownCheckBox({ isOpen, setSelectedItem, selectedItem, itemID }:
  {
    itemID: string | undefined
    isOpen: boolean,
    setSelectedItem: (data: { id: string, name: string }[]) => void
    selectedItem: { id: string, name: string }[]
  }
) {
  const [item, setItem] = useState<Item[]>([])
  const [checkMap, setCheckMap] = useState<{ id: string, check: boolean }[]>([])

  const generateCheckMap = (data: Item[]) => {
    const selectID: string[] = selectedItem.map((e) => e.id);
    const map = data.map((e) => ({
      id: e.itemID,
      check: selectID.includes(e.itemID)
    }));
    return map
  };

  useEffect(() => {
    if (item.length > 0) {
      const map = generateCheckMap(item);
      setCheckMap(map);
    }
  }, [selectedItem])


  const fetchAllItem = async () => {
    const res = await apiClient.get("/v1/item/list")
    if (res.data !== null) {
      const newItem: Item[] = res.data.map((e: any) => {
        return toItem(e)
      })
      const filtItem = newItem.filter((e) => {
        if (e.itemID !== itemID && e.itemStatus !== "IN-LAB ONLY" ) {
          return e
        }
      })
      setItem(filtItem)
      const map = generateCheckMap(filtItem);
      setCheckMap(map);
    }
  }

  useEffect(() => {
    fetchAllItem()
  }, [])
  return <>
    <div className={clsx("transition-all bg-background absolute z-20 -top-[210px] px-3 w-full shadow-xs outline-solid outline-transparent tap-highlight-transparent border-medium border-default-200 data-[hover=true]:border-default-400 data-[open=true]:border-default-foreground data-[focus=true]:border-default-foreground rounded-medium flex-col items-start justify-center gap-0 motion-reduce:transition-none py-2 h-[200px] overflow-y-auto", {
      "opacity-0 scale-95 pointer-events-none": !isOpen
    })}>
      {

        item.map((element, index) => {
          return <div className="flex p-3 gap-3" key={element.itemID}>
            <CheckBox
              checkMap={checkMap[index]}
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