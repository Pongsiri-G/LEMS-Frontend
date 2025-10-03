import MovingCloudBG from "@/src/components/MovingCloudBG";
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main
      className="
        min-h-screen w-full
        grid place-items-center
        relative
      "
    >
      {/* เนื้อหา (login / register) */}
      <div className="relative z-10">{children}</div>
      <MovingCloudBG />
    </main>
  );
}
