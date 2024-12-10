"use client";
import React, { useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  useLoadMore,
  useList,
  useProductFilters,
} from "@/hooks/product-listing";
import { listingPayload } from "@/app/lib/constant";
import ProductCardSkeleton from "./product-card-skeleton";
import { Sorting } from "../sorting/sorting";
import { type TProductList } from "@/types/product-list";
import Filters from "../filters";
import { ProductListingCard } from "./product-listing-card";
import { BrandsFilterContext } from "@/context";

const ProductsList = ({ initialData }: { initialData: TProductList }) => {
  const {
    brands: { facetsUrl, filtersUrl, ...brands },
  } = useProductFilters();
  const { fetchProducts, sortBy, commonProductList, ...listing } = useList({
    initialData,
    filtersUrl,
    facetsUrl,
  });
  const { fetchNextProducts } = useLoadMore({
    fetchProducts,
    sortBy,
    filtersUrl,
    facetsUrl,
  });

  useEffect(() => {
    if (Object.keys(brands.selectedBrands).length === 0) {
      // for resetting all brands to initial state
      commonProductList();
    } else if (sortBy.length > 0 || filtersUrl.length > 0) {
      // for sorting & filters
      commonProductList();
    }
  }, [
    filtersUrl.length,
    brands.selectedBrands,
    commonProductList,
    sortBy.length,
  ]);

  const productListData = listing.products?.data?.body
    ?.toShow as TProductList["body"]["toShow"];

  return (
    <div className="flex justify-center m-[3rem] gap-5">
      <BrandsFilterContext.Provider
        value={{ ...brands, loading: listing.loading }}
      >
        <Filters />
      </BrandsFilterContext.Provider>

      <div className="flex justify-center border border-green w-[1500px] flex-wrap gap-3">
        <Sorting setSortBy={listing.setSortBy} />

        <InfiniteScroll
          key={listingPayload.seName + listingPayload.sortBy}
          dataLength={productListData?.length}
          next={fetchNextProducts}
          hasMore={listing.hasMore}
          loader={<ProductCardSkeleton />}
          scrollThreshold={0.8}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 mb-[32px]"
        >
          {listing.loading ? (
            <ProductCardSkeleton />
          ) : (
            productListData?.map((item, index) => (
              <ProductListingCard key={index} {...item} />
            ))
          )}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default ProductsList;
