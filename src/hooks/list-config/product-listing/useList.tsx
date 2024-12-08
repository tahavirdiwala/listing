"use client";
import productService from "@/app/_services/product.service";
import { type TProductList } from "@/types/productList";
import { AxiosResponse } from "axios";
import { useCallback, useState } from "react";

export const useList = () => {
  const [sortBy, setSortBy] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [products, setProducts] = useState<AxiosResponse<TProductList> | null>(
    null
  );

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

  return { products, sortBy, loading, hasMore, setSortBy, fetchProducts };
};
