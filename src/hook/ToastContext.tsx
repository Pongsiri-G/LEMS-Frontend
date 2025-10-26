"use client";

import { createContext, useContext, useState, ReactNode, useRef } from "react";
import clsx from "clsx";
import { Check, X } from "lucide-react";

type ToastType = "success" | "error";

interface Toast {
  message: string;
  type: ToastType;
  show: boolean
}

interface ToastContextProps {
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast>({ message: "", type: "success", show: false });
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = (message: string, type: ToastType = "success") => {
    if (timeout.current) {
      clearTimeout(timeout.current)
    }
    setToast({ message, type, show: true });
    timeout.current = setTimeout(() => setToast({ message, type, show: false }), 5000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {
        <div className={clsx("transition-all fixed bg-white right-5 bottom-5 flex gap-3 items-center p-3 rounded-xl shadow-xl z-50", {
          "translate-y-28": !toast?.show,
          "translate-y-0": toast?.show,
        })}>
          {
            toast?.type === "success" ?
              <div className="rounded-full bg-success w-fit p-3">
                <Check size={20} className="stroke-white" />
              </div>
              :
              <div className="rounded-full bg-error w-fit p-3">
                <X size={16} className="stroke-white stroke-3" />
              </div>
          }
          <p>{toast?.message}</p>
        </div>
      }
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
