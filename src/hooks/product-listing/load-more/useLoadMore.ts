"use client";

import { listingPayload } from "@/lib/listing.constant";

type TLoadMoreProps = {
  fetchProducts: (payload: object) => Promise<void>;
  sortBy: string;
  filtersUrl: string;
  facetsUrl: string;
};

export const useLoadMore = ({ fetchProducts, ...rest }: TLoadMoreProps) => {
  /**
   * fetch next product listing while scrolling
   */
  const fetchNextProducts = () => {
    const nextPage = +(localStorage.getItem("cPage") || 1) + 1;
    fetchProducts({
      ...listingPayload,
      ...rest,
      currentPage: nextPage,
      loadMore: true,
    });
  };

  return { fetchNextProducts };
};
