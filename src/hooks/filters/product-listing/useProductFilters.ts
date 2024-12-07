"use client";
import { brandsMapper } from "@/app/lib/constant";
import { useState } from "react";

export const useProductFilters = () => {
    const [brandsFilter, setBrandsFilter] = useState(brandsMapper);

    const filtersUrl = Object.keys(brandsFilter)
        .filter((brand) => brandsFilter[brand])
        .map((item) => encodeURIComponent(item.toLowerCase()))
        .join("~")

    return {
        brands: {
            filtersUrl,
            selectedBrands: brandsFilter,
            facetsUrl: filtersUrl.length > 0 ? "brand" : "",
            setSelectedBrand: setBrandsFilter,
        },
    };
};


