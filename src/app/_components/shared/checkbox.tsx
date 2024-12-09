"use client";
import { InputHTMLAttributes } from "react";

type TCheckBoxProps = InputHTMLAttributes<HTMLInputElement>;

export const CheckBox = ({ children, ...props }: TCheckBoxProps) => {
  return (
    <label>
      <input {...props} type="checkbox" />
      {"  "}
      {children}
    </label>
  );
};
