export const formatThaiDate = (dateString: string | null) => {
  if (!dateString) return "-";

  const date = new Date(dateString.replace(" ", "T"));

  return date.toLocaleString("th-TH", {
    timeZone: "Asia/Bangkok",
    dateStyle: "short",
    timeStyle: "medium",
  });
};