type TFilterProps = {
  loading: boolean;
  selectedBrands: Record<string, boolean>;
  setSelectedBrand: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
  handleResetFilters: () => void;
  brandsFilters: Array<string>;
};

export { type TFilterProps };
