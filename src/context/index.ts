import { TFilterProps } from "@/types/product-list";
import { createContext } from "react";

export const BrandsFilterContext = createContext<TFilterProps>(
  {} as TFilterProps
);
