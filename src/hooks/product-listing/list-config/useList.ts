"use client";
import { useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import productService from "@/services/product.service";
import { type TProductList } from "@/types/product-list";
import { listingPayload } from "@/lib/listing.constant";

type TProductListProps = {
  initialData: TProductList;
  filtersUrl: string;
  facetsUrl: string;
};

export const useList = (props: TProductListProps) => {
  const [products, setProducts] = useState({ data: props?.initialData });
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const searchParams = useSearchParams();
  const [sortBy, setSortBy] = useState(() => searchParams.get("sort") || "");

  const fetchProducts = useCallback(async ({ loadMore = false, ...mapper }) => {
    if (!loadMore) setLoading(true);

    try {
      const response = await productService.getAll({
        ...mapper,
        pageNo: mapper.currentPage || 1,
      });

      if (!loadMore) {
        setProducts(response);
      } else {
        setProducts((prev) => {
          if (!prev) return response;
          return {
            ...response,
            data: {
              ...response?.data,
              body: {
                ...response?.data?.body,
                toShow: [
                  ...(prev.data.body.toShow || []),
                  ...(response?.data?.body?.toShow || []),
                ],
              },
            },
          };
        });
      }

      const currentPage = response?.data?.body?.currentPage || 1;
      const totalPages = response?.data?.body?.totalPages || 1;

      if (currentPage) {
        localStorage.setItem("cPage", currentPage.toString());
      }

      setHasMore(currentPage < totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const commonProductList = useCallback(
    (rest: object = {}) => {
      fetchProducts({
        ...listingPayload,
        sortBy,
        filtersUrl: props.filtersUrl,
        facetsUrl: props.facetsUrl,
        ...rest,
      });
    },
    [fetchProducts, props.facetsUrl, props.filtersUrl, sortBy]
  );

  return {
    products,
    sortBy,
    loading,
    hasMore,
    setSortBy,
    fetchProducts,
    commonProductList,
  };
};
