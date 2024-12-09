import { TFilterProps } from "@/types/product-list";
import { createContext } from "react";

export const FiltersConfig = createContext<TFilterProps>({} as TFilterProps);
