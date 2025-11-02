import ItemDetailsHeader from "@/src/components/item-details/ItemDetailsHeader";
import { useWebSocketNotifications } from "@/src/hook/useWebSocketNotifications";
import Image from "next/image";

export default function BorrowReturnPage() {
  // useWebSocketNotifications();

  return <>
    <ItemDetailsHeader />
  </>
}