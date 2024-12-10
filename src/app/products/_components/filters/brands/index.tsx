"use client";
import { CheckBox } from "@/components/shared/checkbox";
import { BrandsFilterContext } from "@/context";
import { useSearchParams } from "next/navigation";
import { useContext, useMemo } from "react";
import { Button } from "@/components/shared/button";
import { getMapper } from "@/app/_common";

export const BrandFilters = () => {
  const params = useSearchParams();
  const context = useContext(BrandsFilterContext);

  const selectedBrandsParams = useMemo(() => {
    if (params.get("brand") == null) return {};
    return getMapper((params.get("brand") || "").split("~"), true);
  }, [params]);

  /**
   * @param {React.ChangeEvent<HTMLInputElement>} event checked event for checkbox
   * @param {string} key specifying key for selectedBrand
   */
  const handleSelectBrand = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    context.setSelectedBrand((prev) => ({
      ...prev,
      [key]: event.target.checked,
    }));
  };

  const hasFilters =
    Object.keys(selectedBrandsParams).length === 0 || context.loading;

  return (
    <>
      <div className="flex justify-between">
        <h2 className="p-2">Brand</h2>
        <Button
          name="Reset Brands"
          className={`bg-white border border-green p-2 ${
            hasFilters ? "cursor-not-allowed" : ""
          }`}
          onClick={context.handleResetFilters}
          disabled={Boolean(hasFilters)}
        />
      </div>
      <div className="flex flex-col p-2">
        {context.filterOptions.map((item, index) => {
          return (
            <CheckBox
              key={index}
              name={item}
              checked={Boolean(selectedBrandsParams[item])}
              onChange={(event) => handleSelectBrand(event, item)}
            />
          );
        })}
      </div>
    </>
  );
};
