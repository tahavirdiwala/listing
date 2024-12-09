"use client";
import { brandsArray } from "@/app/lib/constant";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

type TFilterProps = {
  selectedBrands: Record<string, boolean>;
  setSelectedBrand: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  handleResetFilters: () => void;
};

const Filters = (props: TFilterProps) => {
  const params = useSearchParams();

  const selectedBrandsParams = useMemo(() => {
    if (params.get("brand") == null) return {};
    return (params.get("brand") || "").split("~").reduce((acc, curr) => {
      acc[curr] = true;
      return acc;
    }, {} as typeof props.selectedBrands);
  }, [params, props]);

  /**
   * @param {React.ChangeEvent<HTMLInputElement>} event checked event for checkbox
   * @param {string} key specifying key for selectedBrand
   */
  const handleSelectBrand = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    props.setSelectedBrand((prev) => ({
      ...prev,
      [key]: event.target.checked,
    }));
  };

  const hasFilters = Object.keys(selectedBrandsParams).length === 0;

  return (
    <div className="w-[300px] border border-green">
      <div className="flex justify-between">
        <h2 className="p-2">Brand</h2>
        <button
          className={`border border-green p-2 ${
            hasFilters ? "cursor-not-allowed" : ""
          }`}
          onClick={props.handleResetFilters}
          disabled={hasFilters}
        >
          Reset Brands
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
