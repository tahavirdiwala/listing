type TProductList = {
  body: {
    toShow: Array<{
      name: string;
      brandName: string;
    }>;
    currentPage: number;
    totalPages: number;
  };
};

export { type TProductList };
