"use client";
import { CheckBox } from "@/components/shared/checkbox";
import { BrandsFilterContext } from "@/context";
import { brandsArray } from "@/app/lib/constant";
import { useSearchParams } from "next/navigation";
import { useContext, useMemo } from "react";
import { Button } from "@/components/shared/button";

export const BrandFilters = () => {
  const params = useSearchParams();
  const context = useContext(BrandsFilterContext);

  const selectedBrandsParams = useMemo(() => {
    if (params.get("brand") == null) return {};
    return (params.get("brand") || "").split("~").reduce((acc, curr) => {
      acc[curr] = true;
      return acc;
    }, {} as Record<string, boolean>);
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
        {brandsArray.map((item, index) => {
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
