import { useState } from "react"

export default function SelectorCopyCat({ setPopupIsOpen, selectedItemName }: { setPopupIsOpen: (status: boolean) => void, selectedItemName: string[] }) {
  const [open, setOpen] = useState(false)
  return <>
    <button data-slot="trigger" className="relative px-3 w-full inline-flex shadow-xs outline-solid outline-transparent tap-highlight-transparent border-medium border-default-200 data-[hover=true]:border-default-400 data-[open=true]:border-default-foreground data-[focus=true]:border-default-foreground rounded-medium flex-col items-start justify-center gap-0 transition-colors motion-reduce:transition-none h-14 min-h-14 py-2" type="button" data-react-aria-pressable="true" id="react-aria9278939154-_r_p_" aria-labelledby="react-aria9278939154-_r_u_ react-aria9278939154-_r_q_ " aria-haspopup="listbox" aria-expanded="false"
      onClick={() => {
        setPopupIsOpen(!open)
        setOpen(!open)
      }}>
      <label data-slot="label" className="block absolute z-10 flex-shrink-0 subpixel-antialiased text-foreground-500 pointer-events-none group-data-[has-label-outside=true]:pointer-events-auto cursor-pointer  after:text-danger after:ms-0.5 will-change-auto origin-top-left rtl:origin-top-right !duration-200 !ease-out transition-[transform,color,left,opacity,translate,scale] motion-reduce:transition-none group-data-[filled=true]:text-default-600 group-data-[filled=true]:scale-85 text-small group-data-[filled=true]:-translate-y-[calc(50%_+_var(--heroui-font-size-small)/2_-_6px_-_var(--heroui-border-width-medium))] pe-2 max-w-full text-ellipsis overflow-hidden" id="react-aria9278939154-_r_q_">ต้องใช้ร่วมกับ: {
        selectedItemName.map((e, index) => {
          if (index != selectedItemName.length - 1) {
            return e + ", "
          } else {
            return e
          }
        })

      }</label>
      <svg fill="none" focusable="false" height="1em" role="presentation" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="1em" data-slot="selectorIcon" className={`absolute end-3 w-4 h-4 transition-transform duration-150 ease motion-reduce:transition-none rotate-${open ? "90" : "180"}`}>
        <path d="m6 9 6 6 6-6"></path>
      </svg>
    </button >
  </>
}