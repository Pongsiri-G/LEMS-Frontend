"use client";

import { Input } from "@heroui/react";

interface CustomInputProps {
  name?: string;
  label: string;
  type?: string;
  placeholder?: string;
  svgSrc: string;
  isRequired?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CustomInput({
  name,
  label,
  type = "text",
  placeholder,
  svgSrc,
  isRequired = true,
  value,
  onChange,
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
        value={value}
        onChange={onChange}
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
