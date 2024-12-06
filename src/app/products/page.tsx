"use client";
import React, { useEffect, useState } from "react";
import productService from "../_services/product.service";
import InfiniteScroll from "react-infinite-scroll-component";
import ProductCardSkeleton from "./_components/product-cart-skeleton";
import { ProductListing } from "./_components/product-listing";
import { listingPayload } from "../lib/constant";
import { Sorting } from "./_components/sorting";

const Products = () => {
  const [products, setProducts] = useState<any>([]);
  const [sortBy, setSortBy] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchProducts = async ({ loadMore = false, ...obj }) => {
    if (!loadMore) setLoading(true);

    try {
      const resp = await productService.getAll({
        ...obj,
        pageNo: obj.currentPage || 1,
      });

      if (!loadMore) {
        setProducts(resp);
      } else {
        setProducts((prev: any) => ({
          ...resp,
          data: {
            ...resp?.data,
            body: {
              ...resp?.data?.body,
              toShow: [...prev.data.body.toShow, ...resp?.data.body.toShow],
            },
          },
        }));
      }

      const currentPage = resp?.data?.body?.currentPage || 1;
      const totalPages = resp?.data?.body?.totalPages || 1;

      localStorage.setItem("cPage", currentPage.toString());

      setHasMore(currentPage < totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreHandler = () => {
    const nextPage = +(localStorage.getItem("cPage") || 1) + 1;
    fetchProducts({
      ...listingPayload,
      currentPage: nextPage,
      loadMore: true,
    });
  };

  useEffect(() => {
    fetchProducts({ ...listingPayload, sortBy });
  }, [sortBy]);

  const data = products?.data?.body?.toShow;

  return (
    <div className="flex justify-center m-5 flex-wrap gap-3">
      <Sorting setSortBy={setSortBy} />
      <InfiniteScroll
        key={listingPayload.seName + listingPayload.sortBy}
        dataLength={data?.length || 0}
        next={loadMoreHandler}
        hasMore={hasMore}
        loader={<ProductCardSkeleton />}
        scrollThreshold={0.8}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 mb-[32px]"
      >
        {loading ? (
          <ProductCardSkeleton />
        ) : (
          data?.map((item: any, index: number) => {
            return <ProductListing key={index} {...item} />;
          })
        )}
      </InfiniteScroll>
    </div>
  );
};

export default Products;
