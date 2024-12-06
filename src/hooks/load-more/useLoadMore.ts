"use client";
import { listingPayload } from "@/app/lib/constant";

export const useLoadMore = (callback: (obj: object) => Promise<void>) => {
    const loadMoreDecorator = () => {
        const nextPage = +(localStorage.getItem("cPage") || 1) + 1;
        callback({
            ...listingPayload,
            currentPage: nextPage,
            loadMore: true,
        });
    };

    return { loadMoreDecorator }
}