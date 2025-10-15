"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const cloudData = [
  { width: 500, height: 269, left: -150, top: 307, duration: 5 },
  { width: 288, height: 155, left: 173, top: 62, duration: 3 },
  { width: 560, height: 253, right: -173, top: 45, duration: 6 },
  { width: 383, height: 173, right: 510, top: 518, duration: 4 },
  { width: 383, height: 173, left: 310, top: 689, duration: 8 },
  { width: 383, height: 173, right: 310, top: 818, duration: 10 },
];

export default function MovingCloudBG() {
  const opacity = 30;
  const rowHeight = 900; // height of one cloud pattern
  const [repeatRows, setRepeatRows] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const pageHeight = document.body.scrollHeight;
      setRepeatRows(Math.ceil(pageHeight / rowHeight));
    };

    handleResize(); // initial calculation
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[radial-gradient(ellipse_at_center,_rgba(0,163,247,0.2)_0%,_rgba(0,163,247,0.08)_40%,_transparent_80%)] pointer-events-none">
      {Array.from({ length: repeatRows }).map((_, rowIndex) =>
        cloudData.map((cloud, index) => (
          <Image
            key={`${rowIndex}-${index}`}
            src="/images/cloud.png"
            alt="Cloud"
            width={cloud.width}
            height={cloud.height}
            className={`absolute animate-floatX z-0 opacity-${opacity}`}
            style={{
              top: `${cloud.top + rowIndex * rowHeight}px`, // shift each row down
              left: cloud.left ?? undefined,
              right: cloud.right ?? undefined,
              animationDuration: `${cloud.duration}s`,
            }}
          />
        ))
      )}
    </div>
  );
}