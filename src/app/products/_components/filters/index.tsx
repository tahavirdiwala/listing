<<<<<<< Updated upstream
"use client";
import { brandsArray } from "@/app/lib/constant";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

type TFilterProps = {
  selectedBrands: Record<string, boolean>;
  setSelectedBrand: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
};

const Filters = (props: TFilterProps) => {
  const params = useSearchParams();

  const selectedBrandsParams = useMemo(() => {
    return (params.get("brand") || "").split("~").reduce((acc, curr) => {
      acc[curr] = true;
      return acc;
    }, {} as typeof props.selectedBrands);
  }, [params, props]);

  const handleSelectBrand = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    props.setSelectedBrand((prev) => ({
      ...prev,
      [key]: e.target.checked,
    }));
  };

  const handleResetFilters = () => {
    props.setSelectedBrand({});
  };
=======
import { BrandFilters } from "./brands";
>>>>>>> Stashed changes

  return (
    <div className="w-[300px] border border-green">
      <div className="flex justify-between">
        <h2 className="p-2">Brand</h2>
        <button className="p-2" onClick={handleResetFilters}>
          Reset
        </button>
      </div>
      <div className="flex flex-col p-2">
        {brandsArray.map((item, index) => {
          return (
            <label key={index}>
              <input
                type="checkbox"
                checked={Boolean(selectedBrandsParams[item])}
                name={"brand"}
                onChange={(event) => handleSelectBrand(event, item)}
              />
              {"  "}
              {item}
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default Filters;
