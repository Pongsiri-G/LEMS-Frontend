import { Button } from "@heroui/button";
import ItemDetails from "./ItemDetails";

export default function ItemDetailsHeader() {
  return <>
    <div className="w-full max-w-[1300px] mx-auto px-10">
      <Button variant="bordered">ย้อนกลับ</Button>
      <p className="text-4xl w-full text-center font-bold mt-6">ยืม-คืนสิ่งของ</p>
      <ItemDetails />
    </div>
  </>
}