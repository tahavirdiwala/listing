import { brandsMapper } from "@/app/lib/constant";
import { useState } from "react";

export const useProductFilters = () => {
    const [brandsFilter, setBrandsFilter] = useState(brandsMapper);

    const filtersUrl = Object.keys(brandsFilter)
        .filter((brand) => brandsFilter[brand])
        .map((brand) => encodeURIComponent(brand.toLowerCase()))
        .join("~");

    return {
        brands: {
            selectedBrands: brandsFilter,
            filtersUrl,
            facetsUrl: filtersUrl.length > 0 ? "brand" : "",
            setSelectedBrand: setBrandsFilter
        }
    }
}