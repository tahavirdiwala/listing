import {
  callListingApiConditonally,
  extractFacetsAndFilters,
  extractSlugName,
  filterProducts,
  pagination,
  sortProducts,
  updateRequiredFieldsToAppliedFilters,
} from "@/app/_services/filters";
import { SORT } from "@/app/lib/listing.constant";

export const getSlugResponse = async () => {
  const { otherParams } = extractSlugName([""]);

  const products = await callListingApiConditonally({
    storeId: 5,
    pageId: 3,
    customerId: 0,
    startIndex: 0,
    endIndex: 0,
    filterFacets: [],
    isBrand: false,
    pageSeName: "men",
  });

  const { filtersChips } = extractFacetsAndFilters({
    encodedFacets: otherParams ? otherParams[0] : null,
    encodedFilters: otherParams ? otherParams[1] : null,
    filterFacetUrl: null,
  });

  const appliedFilters = updateRequiredFieldsToAppliedFilters({
    filtersChips,
    rawFacetWithFiltersFromAPI: [],
    models: {
      brands: products.storeBrandProductBrandViewModel,
      sizes: products.storeBrandProductSizeViewModels,
      colors: products.storeBrandProductColorViewModels,
      priceRanges: products.storeBrandProductPriceRangeViewModels,
      gender: products.storeBrandProductGenderViewModels,
      productTypes: products.storeBrandProductProductTypeViewModels,
      categories: products.storeCategoryProductCategoryListViewModel,
    },
  });

  const { sortBy } = pagination(SORT.RELEVANCE, "", "");

  const sortedProducts = sortProducts({
    sortBy: sortBy,
    filtered: products.getlAllProductList,
    isUserLoggedIn: true,
  });

  const filteredProducts = filterProducts({
    originalProducts: sortedProducts,
    chips: appliedFilters,
    ignoreFilter: false,
    oldFacets: [],
    models: {
      brands: products.storeBrandProductBrandViewModel,
      sizes: products.storeBrandProductSizeViewModels,
      colors: products.storeBrandProductColorViewModels,
      priceRanges: products.storeBrandProductPriceRangeViewModels,
      gender: products.storeBrandProductGenderViewModels,
      productTypes: products.storeBrandProductProductTypeViewModels,
      categories: products.storeCategoryProductCategoryListViewModel,
    },
    isBrandPage: false,
    isUserLoggedIn: true,
  });

  const key = "facetSeName";

  const groupBrands = (filteredProducts.filterOptions || []).reduce(
    (acc: Record<string, any>, curr: any) => {
      (acc[curr[key]] = acc[curr[key]] || []).push(curr);
      return acc;
    },
    {}
  );

  return groupBrands;
};
