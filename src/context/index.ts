import { TFilterProps } from "@/types/product-list";
import { createContext } from "react";

export const FiltersConfigContext = createContext<TFilterProps>(
  {} as TFilterProps
);
