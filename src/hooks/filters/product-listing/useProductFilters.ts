"use client";
import { brandsMapper } from "@/app/lib/constant";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const useProductFilters = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [brandsFilter, setBrandsFilter] = useState(() => {
        const params = new URLSearchParams(searchParams.toString());
        const initialBrands = { ...brandsMapper };

        const selectedBrands = params.get("brand")?.split("~") || [];
        selectedBrands.forEach((brand) => {
            if (brand in initialBrands) {
                initialBrands[brand] = true;
            }
        });

        return initialBrands;
    });

    const filtersUrl = Object.keys(brandsFilter)
        .filter((brand) => brandsFilter[brand])
        .map((item) => encodeURIComponent(item.toLowerCase()))
        .join("~");

    const temp = Object.keys(brandsFilter).filter((brand) => brandsFilter[brand]);

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());

        const updatedBrandsFilter = temp.reduce(
            (acc, curr) => {
                acc[curr] = true;
                return acc;
            },
            {} as { [key: string]: boolean }
        );

        setBrandsFilter((prev) => {
            const isDifferent = Object.keys(updatedBrandsFilter).some(
                (key) => prev[key] !== updatedBrandsFilter[key]
            );
            return isDifferent ? { ...prev, ...updatedBrandsFilter } : prev;
        });

        if (temp.length > 0) {
            params.set("brand", temp.join("~"));
        } else {
            params.delete("brand");
        }

        const newUrl = `?${params.toString()}`;
        if (window.location.search !== newUrl) {
            router.push(newUrl);
        }
    }, [router, searchParams, temp, setBrandsFilter]);

    return {
        brands: {
            filtersUrl,
            selectedBrands: brandsFilter,
            facetsUrl: filtersUrl.length > 0 ? "brand" : "",
            setSelectedBrand: setBrandsFilter,
        },
    };
};
