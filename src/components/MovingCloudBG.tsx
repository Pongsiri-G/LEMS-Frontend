"use client";

import Image from "next/image";


export default function MovingCloudBG() {
  return (
    <div className="h-screen relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_rgba(0,163,247,0.2)_0%,_rgba(0,163,247,0.08)_40%,_transparent_80%)]">
      <Image
        src={"/images/cloud.png"}
        alt="Cloud"
        width={500}
        height={269}
        className="z-0 absolute -left-[150px] top-[307px] animate-floatX"
        style={{
          animationDuration: `5s`,
        }}
      />
      <Image
        src={"/images/cloud.png"}
        alt="Cloud"
        width={288}
        height={155}
        className="z-0 absolute left-[173px] top-[62px] animate-floatX"
        style={{
          animationDuration: `3s`,
        }}
      />
      <Image
        src={"/images/cloud.png"}
        alt="Cloud"
        width={560}
        height={253}
        className="z-0 absolute -right-[173px] top-[45px] animate-floatX"
        style={{
          animationDuration: `$6s`,
        }}
      />
      <Image
        src={"/images/cloud.png"}
        alt="Cloud"
        width={383}
        height={173}
        className="z-0 absolute right-[510px] top-[518px] animate-floatX"
        style={{
          animationDuration: `4s`,
        }}
      />
      <Image
        src={"/images/cloud.png"}
        alt="Cloud"
        width={383}
        height={173}
        className="z-0 absolute left-[310px] top-[689px] animate-floatX"
        style={{
          animationDuration: `8s`,
        }}
      />
      <Image
        src={"/images/cloud.png"}
        alt="Cloud"
        width={383}
        height={173}
        className="z-0 absolute right-[310px] top-[818px] animate-floatX"
        style={{
          animationDuration: `10s`,
        }}
      />
    </div>
  );
}
