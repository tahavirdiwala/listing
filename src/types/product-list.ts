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

type TFilterProps = {
  loading: boolean;
  selectedBrands: Record<string, boolean>;
  setSelectedBrand: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  handleResetFilters: () => void;
  brandsFilters: Array<string>;
};

export { type TProductList, type TFilterProps };
