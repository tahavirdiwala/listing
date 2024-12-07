import { listingPayload } from "@/app/lib/constant";

type TLoadMoreProps = (payload: object) => Promise<void>;

export const useLoadMore = (fetchProductList: TLoadMoreProps) => {
    const fetchNextProducts = () => {
        const nextPage = +(localStorage.getItem("cPage") || 1) + 1;
        fetchProductList({
            ...listingPayload,
            currentPage: nextPage,
            loadMore: true,
        });
    };

    return { fetchNextProducts };
};
