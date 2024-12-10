type TProductList = {
  body: {
    toShow: Array<{
      name: string;
      brandName: string;
      getProductImageOptionList: {
        imageName: string;
      }[];
    }>;
    currentPage: number;
    totalPages: number;
  };
};

export { type TProductList };
