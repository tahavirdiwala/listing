import { createContext } from "react";
import { TFilterProps } from "@/types/products/filters";

export const BrandsFilterContext = createContext<TFilterProps>(
  {} as TFilterProps
);
