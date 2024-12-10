"use client";
import { InputHTMLAttributes } from "react";

type TCheckBoxProps = InputHTMLAttributes<HTMLInputElement>;

export const CheckBox = (props: TCheckBoxProps) => {
  return (
    <label>
      <input {...props} type="checkbox" />
      {"  "}
      {props.name}
    </label>
  );
};
