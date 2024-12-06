"use client";
import React, { useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import ProductCardSkeleton from "./_components/product-cart-skeleton";
import { ProductListing } from "./_components/product-listing";
import { listingPayload } from "../lib/constant";
import { Sorting } from "./_components/sorting";
import { useLoadMore, useProductList } from "@/hooks";

const Products = () => {
  const { fetchProducts, sortBy, ...productListing } = useProductList();
  const { loadMoreDecorator } = useLoadMore(fetchProducts);

  useEffect(() => {
    fetchProducts({ ...listingPayload, sortBy: sortBy });
  }, [fetchProducts, sortBy]);

  const data = productListing.products?.data?.body?.toShow;

  return (
    <div className="flex justify-center m-5 flex-wrap gap-3">
      <Sorting setSortBy={productListing.setSortBy} />

      <InfiniteScroll
        key={listingPayload.seName + listingPayload.sortBy}
        dataLength={data?.length || 0}
        next={loadMoreDecorator}
        hasMore={productListing.hasMore}
        loader={<ProductCardSkeleton />}
        scrollThreshold={0.8}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 mb-[32px]"
      >
        {productListing.loading ? (
          <ProductCardSkeleton />
        ) : (
          data?.map((item: any, index: number) => (
            <ProductListing key={index} {...item} />
          ))
        )}
      </InfiniteScroll>
    </div>
  );
};

export default Products;
