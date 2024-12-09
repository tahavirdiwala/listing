"use client";
import { ButtonHTMLAttributes } from "react";

type TButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = (props: TButtonProps) => {
  return <button {...props}>{props.name}</button>;
};
