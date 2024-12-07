"use client";
import React, { useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useLoadMore, useList } from "@/hooks";
import { listingPayload } from "@/app/lib/constant";
import ProductCardSkeleton from "./product-cart-skeleton";
import { Sorting } from "./sorting";
import { ProductListing } from "./product-listing";
import { TProductList } from "@/types/productList";

const ProductsList = () => {
  const { fetchProducts, sortBy, ...productListing } = useList();
  const { fetchNextProducts } = useLoadMore(fetchProducts);

  useEffect(() => {
    fetchProducts({ ...listingPayload, sortBy });
  }, [fetchProducts, sortBy]);

  const productListData = productListing.products?.data?.body
    ?.toShow as TProductList["body"]["toShow"];

  return (
    <div className="flex justify-center m-5 flex-wrap gap-3">
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
  );
};

export default ProductsList;
