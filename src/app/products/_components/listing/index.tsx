"use client";
import React, { useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  useLoadMore,
  useList,
  useProductFilters,
} from "@/hooks/product-listing";
import { listingPayload } from "@/app/lib/constant";
import ProductCardSkeleton from "./product-cart-skeleton";
import { Sorting } from "../sorting/sorting";
import { type TProductList } from "@/types/productList";
import { ProductListing } from "./product-listing";
import Filters from "../filters";

const ProductsList = ({ initialData }: { initialData: TProductList }) => {
  const { brands } = useProductFilters();
  const { fetchProducts, sortBy, commonProductList, ...productListing } =
    useList({
      initialData,
      filtersUrl: brands.filtersUrl,
      facetsUrl: brands.facetsUrl,
    });
  const { fetchNextProducts } = useLoadMore({
    fetchProducts,
    sortBy,
    filtersUrl: brands.filtersUrl,
    facetsUrl: brands.facetsUrl,
  });

  useEffect(() => {
    if (Object.keys(brands.selectedBrands).length === 0) {
      commonProductList();
    } else if (sortBy.length > 0 || brands.filtersUrl.length > 0) {
      commonProductList();
    }
  }, [
    brands.filtersUrl.length,
    brands.selectedBrands,
    commonProductList,
    sortBy.length,
  ]);

  const productListData = productListing.products?.data?.body
    ?.toShow as TProductList["body"]["toShow"];

  return (
    <div className="flex justify-center m-[3rem] gap-5">
      <Filters
        selectedBrands={brands.selectedBrands}
        setSelectedBrand={brands.setSelectedBrand}
        handleResetFilters={brands.handleResetFilters}
      />

      <div className="flex justify-center border border-green w-[1500px] flex-wrap gap-3">
        <Sorting setSortBy={productListing.setSortBy} />

        <InfiniteScroll
          key={listingPayload.seName + listingPayload.sortBy}
          dataLength={productListData?.length || 0}
          next={fetchNextProducts}
          hasMore={productListing.hasMore}
          loader={<ProductCardSkeleton />}
          scrollThreshold={0.8}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 mb-[32px]"
        >
          {productListing.loading ? (
            <ProductCardSkeleton />
          ) : (
            productListData?.map((item, index: number) => (
              <ProductListing key={index} {...item} />
            ))
          )}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default ProductsList;
