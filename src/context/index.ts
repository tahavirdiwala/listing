import { createContext } from "react";
import { TFilterProps } from "@/types/product-list";

export const BrandsFilterContext = createContext<TFilterProps>(
  {} as TFilterProps
);
