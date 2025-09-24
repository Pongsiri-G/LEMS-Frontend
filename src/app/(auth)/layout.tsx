export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main
      className="
        min-h-screen w-full
        grid place-items-center
        white               /* พื้นหลังขาว */
        relative
      "
    >
      {/* รูปภาพพื้นหลัง */}
      <img
        src="/images/clound-bg.png"
        alt="background"
        className="absolute inset-0 w-full h-full object-cover opacity-70"
      />

      {/* เนื้อหา (login / register) */}
      <div className="relative z-10">{children}</div>
    </main>
  );
}
