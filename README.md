[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/WaYwYwBk)
# 📂 โครงสร้างโปรเจกต์ (Project Structure)

โปรเจกต์นี้พัฒนาด้วย **Next.js** โดยใช้ **App Router** ซึ่งเป็นโครงสร้างที่ทันสมัยและนิยมใช้กันในปัจจุบัน มีการจัดระเบียบไฟล์และโฟลเดอร์อย่างเป็นระบบ ทำให้ง่ายต่อการพัฒนาและบำรุงรักษา

---

## 📁 โฟลเดอร์หลัก (Root Directory)

- **`.next`**: โฟลเดอร์ที่ Next.js สร้างขึ้นอัตโนมัติเพื่อเก็บไฟล์ผลลัพธ์จากการ build โปรเจกต์
- **`node_modules`**: โฟลเดอร์สำหรับเก็บ dependencies หรือไลบรารีทั้งหมดที่โปรเจกต์นี้ใช้งาน
- **`public`**: ใช้สำหรับเก็บไฟล์ static ต่างๆ เช่น รูปภาพ, font ซึ่งจะสามารถเข้าถึงได้โดยตรง
- **`src`**: โฟลเดอร์หลักที่เก็บซอร์สโค้ดทั้งหมดของแอปพลิเคชัน

---

## `src` — โฟลเดอร์ซอร์สโค้ด

เป็นหัวใจหลักของแอปพลิเคชัน ประกอบด้วยโฟลเดอร์ย่อยๆ ที่แบ่งตามหน้าที่อย่างชัดเจน

- **`app`**: โฟลเดอร์หลักของ **App Router** ใน Next.js ใช้สำหรับสร้างหน้าเว็บและ API routes
  - `layout.tsx`: ไฟล์ Layout หลักของแอปพลิเคชันสำหรับกำหนดโครงสร้างร่วมกัน เช่น Header, Footer
  - `page.tsx`: Component ของหน้าแรก (Homepage)
  - `globals.css`: ไฟล์สำหรับเขียน CSS แบบ global ที่จะมีผลกับทุกหน้าในโปรเจกต์
- **`components`**: 🧱 โฟลเดอร์สำหรับเก็บ UI Components ที่สามารถนำกลับมาใช้ซ้ำได้ เช่น Button, Card, Modal
- **`configs`**: ใช้เก็บไฟล์ตั้งค่าต่างๆ ของโปรเจกต์ เช่น การตั้งค่าการเชื่อมต่อ API
- **`constants`**: สำหรับเก็บค่าคงที่ (Constant values) ที่ใช้ในโปรเจกต์
- **`feature`**:โฟลเดอร์ที่ใช้สถาปัตยกรรม Feature-Sliced Design เพื่อแบ่งโค้ดตามขอบเขตของฟีเจอร์ (feature-based) โดยแต่ละ slice ที่สร้างจาก Redux Toolkit จะถูกจัดเก็บไว้ในโฟลเดอร์ของฟีเจอร์ที่ตัวเองสังกัดอยู่
- **`services`**: ใช้สำหรับจัดการ Logic ที่เกี่ยวข้องกับการติดต่อกับภายนอก เช่น การเรียกใช้ API
- **`store`**: 🗄️ โฟลเดอร์สำหรับจัดการ State ของแอปพลิเคชันด้วย Redux 
- **`types`**: สำหรับประกาศ TypeScript types และ interfaces
- **`utils`**: ใช้เก็บฟังก์ชันช่วยเหลือ (Utility functions) ที่สามารถใช้ซ้ำได้ทั่วทั้งโปรเจกต์

---

## ⚙️ ไฟล์ตั้งค่า (Configuration Files)

เป็นไฟล์ที่ใช้กำหนดค่าการทำงานต่างๆ ของโปรเจกต์และเครื่องมือที่เกี่ยวข้อง

- **`.gitignore`**: ระบุไฟล์หรือโฟลเดอร์ที่จะไม่ถูกนำขึ้น Git version control
- **`next.config.ts`**: ไฟล์ตั้งค่าหลักของโปรเจกต์ Next.js
- **`package.json`**: ระบุข้อมูลของโปรเจกต์, dependencies, และคำสั่ง script ต่างๆ
- **`pnpm-lock.yaml`**: Lock file ที่สร้างโดย `pnpm` เพื่อล็อกเวอร์ชันของ dependencies
- **`tailwind.config.js`**: ไฟล์ตั้งค่าสำหรับ Tailwind CSS Framework
- **`tsconfig.json`**: ไฟล์ตั้งค่าสำหรับ TypeScript Compiler
- **`eslint.config.mjs`**: ไฟล์ตั้งค่าสำหรับ ESLint (Code Linter)

---

# 📦 การจัดการแพ็กเกจ (Package Management)
โปรเจกต์นี้ใช้เครื่องมือ pnpm ในการจัดการ package 
- คำสั่งสำหรับ start project
  ```cli
  pnpm dev
  ```
- คำสั่งสำหรับติดตั้งแพ็กเกจทั้งหมดที่มีอยู่ในไฟล์ package.json
  ```cli
  pnpm install
  ```

# 🧸 UI Component Libraly (Hero UI)
- สามารถอ่านเพิ่มเติมได้ที่ [HERO UI](https://www.heroui.com/docs/components/button)