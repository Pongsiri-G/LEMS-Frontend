"use client";

import { Input } from "@heroui/react";

interface CustomInputProps {
  name?: string;
  label: string;
  type?: string;
  placeholder?: string;
  svgSrc: string;
  isRequired?: boolean;
}

export default function CustomInput({
  name,
  label,
  type = "text",
  placeholder,
  svgSrc,
  isRequired = true,
}: CustomInputProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="text-l ml-5 font-medium">
        {label}
      </label>
      <Input
        name={name}
        type={type}
        placeholder={placeholder}
        variant="bordered"
        radius="full"
        isRequired={isRequired}
        startContent={
          <img
            src={svgSrc}
            alt={`${label} icon`}
            className="w-5 h-5 opacity-80"
          />
        }
      />
    </div>
  );
}
