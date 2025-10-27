export const formatThaiDate = (dateString: string | null) => {
  if (!dateString) return "-"
  const iso = dateString.replace(" ", "T") + "Z" // แปลงให้เป็น ISO (UTC)
  const date = new Date(iso)
  return date.toLocaleString("th-TH", {
    timeZone: "Asia/Bangkok",
    dateStyle: "short",
    timeStyle: "medium",
  })
}
