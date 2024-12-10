import {
  BRAND_FACET_SENAME,
  CATEGORY_FACET_SENAME,
  COLOR_FACET_SENAME,
  CUSTOM_BRAND_FACET_ID,
  CUSTOM_CATEGORY_FACET_ID,
  CUSTOM_COLOR_FACET_ID,
  CUSTOM_GENDER_FACET_ID,
  CUSTOM_MAX_PRICE_POSSIBLE,
  CUSTOM_PRICE_RANGE_ID,
  CUSTOM_PRODUCT_TYPE_FACET_ID,
  CUSTOM_SIZE_FACET_ID,
  GENDER_FACET_SENAME,
  IN_STOCK,
  PRICE_RANGE_FACET_SENAME,
  PRODUCT_TYPE_FACET_SENAME,
  SIZE_FACET_SENAME,
  Sort,
  TAGS,
} from "@/lib/constant";
import axios, { AxiosRequestConfig } from "axios";
import { access, readFile, writeFile } from "fs/promises";

const IS_AND_FACETS: any = [];

const brandPath = (pageId: number) => {
  return `/src/json/brands/brand_${pageId}.json`;
};

const categoryPath = (pageId: number) => {
  return `/src/json/categories/${pageId}.json`;
};

const axiosInterceptorInstance = axios.create({
  baseURL: `https://www.corporategear.com/api`,
});

export const checkCategoryFileExist = async ({
  isBrand,
  pageId,
}: {
  isBrand: boolean;
  pageId: number;
}) => {
  const path = isBrand ? brandPath(pageId) : categoryPath(pageId);

  const possibleFilePath = process.cwd() + path;

  return await access(possibleFilePath)
    .then(() => true)
    .catch(() => false);
};

export const saveProductsToJSON = async ({
  seName,
  isBrand,
  pageId,
  JSONtoSave,
}: {
  seName: string;
  pageId: number;
  JSONtoSave: any;
  isBrand: boolean;
}) => {
  try {
    const path = isBrand ? brandPath(pageId) : categoryPath(pageId);

    const filePath = process.cwd() + path;

    await writeFile(
      filePath,
      JSON.stringify({
        success: true,
        errors: {},
        otherData: null,
        data: JSONtoSave,
      })
    );
  } catch (error) {
    console.log(error);
  }
};

export const SendAsync = <T>(
  request: AxiosRequestConfig & { next?: { revalidate: number } }
): Promise<T> => {
  return new Promise((resolve, reject) => {
    axiosInterceptorInstance
      .request(request)
      // eslint-disable-next-line
      .then(({ data, errors }: any) => {
        if (data?.success) {
          resolve(data?.data);
        } else {
          reject(data?.errors);
          throw new Error(errors);
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const getStaticProductListingData = async ({
  pageId,
  isBrand,
}: {
  pageId: number;
  isBrand: boolean;
}): Promise<any> => {
  const path = isBrand ? brandPath(pageId) : categoryPath(pageId);

  const listingFile = await readFile(process.cwd() + path, "utf-8");

  if (!listingFile)
    throw new Error(
      `Listing file not found for ${isBrand ? "brandId" : "categoryId"} =>` +
      pageId
    );
  const listingData: { data: any } = JSON.parse(listingFile);

  if (!listingData)
    throw new Error(
      `Listing file is empty for ${isBrand ? "brandId" : "categoryId"} => ` +
      pageId
    );
  return listingData.data;
};

export const fetchBrandProducts = async (filterRequest: any): Promise<any> => {
  const url = `/StoreProductFilter/GetFilterByBrandByCatcheWithJson.json`;
  const res = await SendAsync<any>({
    url: url,
    method: "POST",
    data: filterRequest,
  });

  return res;
};

export const fetchCategoryProducts = async (
  filterRequest: any
): Promise<any> => {
  const url = `/StoreProductFilter/GetFilterByCategoryByCatcheWithJson.json`;

  const res = await SendAsync<any>({
    url: url,
    method: "POST",
    data: filterRequest,
  });

  return res;
};

export const callListingApiConditonally = async (payload: any) => {
  try {
    const {
      storeId,
      pageId,
      isBrand,
      customerId,
      filterFacets,
      startIndex,
      endIndex,
      pageSeName,
    } = payload;

    const fileExist = await checkCategoryFileExist({
      pageId,
      isBrand,
    });

    if (fileExist) {
      const storedProducts = await getStaticProductListingData({
        pageId,
        isBrand,
      });

      if (storedProducts.getlAllProductList.length !== 0) {
        return storedProducts;
      }
    }

    let response: null = null;

    if (isBrand) {
      response = await fetchBrandProducts({
        storeID: storeId,
        brandId: pageId,
        customerId,
        pageStartindex: startIndex,
        pageEndindex: endIndex,
        filterOptionforfaceteds: filterFacets,
      });
    } else {
      response = await fetchCategoryProducts({
        storeID: storeId,
        categoryId: pageId,
        customerId,
        pageStartindex: startIndex,
        pageEndindex: endIndex,
        filterOptionforfaceteds: filterFacets,
      });
    }

    if (!response)
      throw new Error("No response found for categoryId => " + pageId);

    await saveProductsToJSON({
      pageId,
      seName: pageSeName,
      isBrand,
      JSONtoSave: response,
    });

    return response;
  } catch (error) {
    console.log(error);
  }
};

const peelToNumber = (numberWithChars: string) => {
  return numberWithChars
    .replace("and", "-")
    .replace("And", "-")
    .replace("AND", "-")
    .replaceAll("$", "")
    .replaceAll(" ", "")
    .replaceAll("and", "")
    .replaceAll("above", "");
};

export const rangeExtractorFromArr = (
  filters: any,
  predefined: string | null = null
) => {
  if (predefined) {
    const min = peelToNumber(predefined).split("-")[0];
    const max = peelToNumber(predefined).split("-")[1];

    return {
      min: Math.floor(+min),
      max: Math.round(+(max || CUSTOM_MAX_PRICE_POSSIBLE)),
    };
  }

  if (filters.length === 0) {
    console.error("No price Min and Max found");
    return {
      min: 0,
      max: 0,
    };
  }

  const firstElement = filters[0];
  const lastElement = filters[filters.length - 1];

  const min = peelToNumber(firstElement.filterSeName).split("-")[0];
  const max = peelToNumber(lastElement.filterSeName).split("-")[1];

  return {
    min: Math.floor(+min),
    max: Math.round(+(max || CUSTOM_MAX_PRICE_POSSIBLE)),
  };
};

export const rangeExtractorFromStr = (seName: string) => {
  const [firstElement, lastElement] = seName.replace("and", "-").split("-");

  const min = peelToNumber(firstElement);
  const max = peelToNumber(lastElement);

  return {
    // min: 0,
    min: Math.floor(+min),
    max: Math.round(+(max || CUSTOM_MAX_PRICE_POSSIBLE)),
  };
};

const extractMinMax = (
  appliedMinMax: string | undefined,
  minMaxArr: any
): { min: number; max: number } => {
  if (!appliedMinMax) return { max: CUSTOM_MAX_PRICE_POSSIBLE, min: 0 };

  const { max: allowedMax, min: allowedMin } = rangeExtractorFromArr(minMaxArr);

  const { max: appliedMax, min: appliedMin } =
    rangeExtractorFromStr(appliedMinMax);

  return {
    max: allowedMax >= appliedMax ? appliedMax : allowedMax,
    min: allowedMin <= appliedMin ? appliedMin : allowedMin,
  };
};

export function customSort(a: any, b: any, isBrandPage: boolean) {
  if (isBrandPage) {
    if (
      a.facetSeName === PRODUCT_TYPE_FACET_SENAME &&
      b.facetSeName === GENDER_FACET_SENAME
    )
      return 0;
    if (
      a.facetSeName === GENDER_FACET_SENAME &&
      b.facetSeName === PRODUCT_TYPE_FACET_SENAME
    )
      return -1;
    if (
      a.facetSeName === GENDER_FACET_SENAME ||
      b.facetSeName === PRODUCT_TYPE_FACET_SENAME
    )
      return -1;
    return 1;
  }

  if (
    !isBrandPage &&
    (a.facetSeName === BRAND_FACET_SENAME ||
      b.facetSeName === BRAND_FACET_SENAME)
  )
    return -1;

  return 1;
}

export const specialConditionHandler = (
  uniqueAppliedFacets: any,
  isBrandPage: boolean
) => {
  if (uniqueAppliedFacets.length >= 2) return true;

  if (isBrandPage) {
    return uniqueAppliedFacets.length !== 1;
  }

  // false means not to update count
  // true means update count

  return !uniqueAppliedFacets.includes(BRAND_FACET_SENAME);
};

const modifyBooleanOutput = (
  {
    uniqueAppliedFacets,
    isBrandPage,
    facetSeName,
  }: {
    uniqueAppliedFacets: any;
    isBrandPage: boolean;
    facetSeName: any;
  },
  originalResult: boolean
) => {
  if (isBrandPage && uniqueAppliedFacets?.length === 1) {
    if (
      (uniqueAppliedFacets[0] === GENDER_FACET_SENAME &&
        facetSeName === PRODUCT_TYPE_FACET_SENAME) ||
      (uniqueAppliedFacets[0] === PRODUCT_TYPE_FACET_SENAME &&
        facetSeName === GENDER_FACET_SENAME)
    )
      return false;
  }

  return originalResult;
};

export const DONT_UPDATE_COUNT_ON_APPLYING_FILTER = (
  isBrandPage: boolean,
  ignoreThisCondition: boolean
): any => {
  if (isBrandPage) {
    if (ignoreThisCondition) return [];
    return ["gender", "product type"];
  }
  //
  if (ignoreThisCondition) return ["category"];
  return ["category", "brand"];
};

const updateCount = ({
  oldArray,
  keyToMatch,
  resetToZero = false,
  isBrandPage,
  specialCondition,
  uniqueAppliedFacets,
}: {
  oldArray: any[];
  keyToMatch: any;
  resetToZero?: boolean;
  isBrandPage: boolean;
  specialCondition: boolean;
  uniqueAppliedFacets: any[];
}): any[] => {
  if (
    modifyBooleanOutput(
      {
        uniqueAppliedFacets,
        isBrandPage,
        facetSeName: keyToMatch.facetName,
      },
      DONT_UPDATE_COUNT_ON_APPLYING_FILTER(
        isBrandPage,
        specialCondition
      ).includes(keyToMatch.facetName)
    )
  )
    return oldArray;

  return oldArray.map((filter: any) => {
    let count: number = filter.filterProductCount;

    if (keyToMatch.facetName === BRAND_FACET_SENAME) {
      const updateCount = filter.filterLabel === keyToMatch.brandName;
      count = updateCount ? filter.filterProductCount + 1 : count;
    }

    if (keyToMatch.facetName === GENDER_FACET_SENAME) {
      const updateCount = filter.filterLabel === keyToMatch.productGender;
      count = updateCount ? filter.filterProductCount + 1 : count;
    }

    if (keyToMatch.facetName === PRODUCT_TYPE_FACET_SENAME) {
      const updateCount = keyToMatch.categorySeName?.includes(
        filter.filterSeName
      );
      count = updateCount ? filter.filterProductCount + 1 : count;
    }

    if (keyToMatch.facetName === COLOR_FACET_SENAME) {
      const updateCount = keyToMatch.colorName?.includes(filter.filterSeName);
      count = updateCount ? filter.filterProductCount + 1 : count;
    }

    if (keyToMatch.facetName === SIZE_FACET_SENAME) {
      const updateCount = keyToMatch.sizeName?.includes(filter.filterSeName);
      count = updateCount ? filter.filterProductCount + 1 : count;
    }

    if (keyToMatch.facetName === PRICE_RANGE_FACET_SENAME) {
      let updateCount = false;
      const priceFilterOption = filter[0];

      if (
        keyToMatch.productPrice > priceFilterOption?.from &&
        keyToMatch.productPrice < priceFilterOption.to
      ) {
        updateCount = true;
      }

      count = updateCount ? filter.filterProductCount + 1 : count;
    }

    return {
      ...filter,
      filterProductCount: resetToZero ? 0 : count,
    };
  });
};

export const filterProducts = ({
  originalProducts,
  chips,
  ignoreFilter,
  oldFacets,
  models,
  isBrandPage,
  isUserLoggedIn,
}: {
  originalProducts: any;
  chips: any;
  ignoreFilter: boolean;
  oldFacets: any;
  isBrandPage: boolean;
  isUserLoggedIn: boolean;
  models?: {
    brands?: any;
    sizes?: any;
    colors?: any;
    priceRanges?: any;
    categories?: any;
    gender?: any;
    productTypes?: any;
  };
}): {
  filtered: any;
  //
  totalAvailable: number;
  filterOptions: any;
} => {
  if (ignoreFilter) {
    return {
      filtered: originalProducts,
      totalAvailable: originalProducts.length,
      filterOptions: [],
    };
  }

  try {
    const orderedAppliedFilters = [...chips].sort((a, b) =>
      customSort(a, b, isBrandPage)
    ); // copying products so that originial applied filters order do not changes

    let lastFacetAppliedProducts: any = originalProducts;
    let filteredProducts: any = [];
    let productIds: number[] = [];
    let facetsWithFiltersKeeper: any = oldFacets;
    const facetsKeeper: any = oldFacets?.map((facet) => facet.facetSeName);
    let newFacetIsApplied = false;
    let lastAppliedFacet = orderedAppliedFilters?.[0]?.facetSeName || "";
    const uniqueAppliedFacets: any = [];

    orderedAppliedFilters.forEach((appliedFilter) => {
      if (!uniqueAppliedFacets.includes(appliedFilter.facetSeName)) {
        uniqueAppliedFacets.push(appliedFilter.facetSeName);
      }
    });

    const specialCondition = specialConditionHandler(
      uniqueAppliedFacets,
      isBrandPage
    );

    /* Extracting all Facets n Filters and storing into facetsWithFiltersKeeper and facetsKeeper */
    if (oldFacets.length === 0 && models) {
      /* 
        filterFacetFieldModels do not exist here
      */

      if (models.categories && models.categories.length > 0) {
        facetsKeeper.push(CATEGORY_FACET_SENAME);

        const allCategories: any = [];
        models.categories.forEach((category: any) => {
          allCategories.push({
            filterId: category.id,
            filterLabel: category.name,
            filterProductCount: category.productCount,
            filterSeName: category.sename,
            filterDisplayOrder: category.displayOrder,
            subrows: category?.subrows?.map((subrow: any) => {
              return {
                filterId: subrow.id,
                filterLabel: subrow.name,
                filterProductCount: subrow.productCount,
                filterSeName: subrow.sename,
                filterDisplayOrder: subrow.displayOrder,
              };
            }),
          });
        });

        facetsWithFiltersKeeper.push({
          facetId: CUSTOM_CATEGORY_FACET_ID,
          facetLabel: "Category",
          facetSeName: CATEGORY_FACET_SENAME,
          filterFacetFieldsValues: allCategories,
        });
      }

      if (models.brands && models.brands.length > 0) {
        facetsKeeper.push(BRAND_FACET_SENAME);

        const allBrands: any = [];
        models.brands.forEach((brand: any) => {
          allBrands.push({
            filterId: brand.id,
            filterLabel: brand.name,
            filterProductCount: 0,
            filterSeName: brand.name,
            filterDisplayOrder: brand.displayOrder,
          });
        });

        facetsWithFiltersKeeper.push({
          facetId: CUSTOM_BRAND_FACET_ID,
          facetLabel: "Brand",
          facetSeName: BRAND_FACET_SENAME,
          filterFacetFieldsValues: allBrands,
        });
      }

      if (models.gender && models.gender.length > 0) {
        facetsKeeper.push(GENDER_FACET_SENAME);

        const allGender: any = [];
        models.gender.forEach((gender: any) => {
          allGender.push({
            filterId: gender.id,
            filterLabel: gender.name,
            filterProductCount: gender.productCount,
            filterSeName: gender.name,
            filterDisplayOrder: gender.displayOrder,
          });
        });

        facetsWithFiltersKeeper.push({
          facetId: CUSTOM_GENDER_FACET_ID,
          facetLabel: "Gender",
          facetSeName: GENDER_FACET_SENAME,
          filterFacetFieldsValues: allGender,
        });
      }

      if (models.productTypes && models.productTypes.length > 0) {
        facetsKeeper.push(PRODUCT_TYPE_FACET_SENAME);

        const allProductTypes: any = [];
        models.productTypes.forEach((productType: any) => {
          allProductTypes.push({
            filterId: productType.id,
            filterLabel: productType.name,
            filterProductCount: productType.productCount,
            filterSeName: productType.sename,
            filterDisplayOrder: productType.displayOrder,
          });
        });

        facetsWithFiltersKeeper.push({
          facetId: CUSTOM_PRODUCT_TYPE_FACET_ID,
          facetLabel: "Product Type",
          facetSeName: PRODUCT_TYPE_FACET_SENAME,
          filterFacetFieldsValues: allProductTypes,
        });
      }

      if (models.colors && models.colors.length > 0) {
        facetsKeeper.push(COLOR_FACET_SENAME);

        const allColors: any = [];
        models.colors.forEach((color: any) => {
          allColors.push({
            filterId: color.id,
            filterLabel: color.name,
            filterProductCount: 0,
            filterSeName: color.name,
            filterDisplayOrder: color.displayOrder,
            filterColorCode: color.colorCode,
          });
        });

        facetsWithFiltersKeeper.push({
          facetId: CUSTOM_COLOR_FACET_ID,
          facetLabel: "Color",
          facetSeName: COLOR_FACET_SENAME,
          filterFacetFieldsValues: allColors,
        });
      }

      if (models.sizes && models.sizes.length > 0) {
        facetsKeeper.push(SIZE_FACET_SENAME);

        const allSizes: any = [];
        models.sizes.forEach((size: any) => {
          allSizes.push({
            filterId: size.id,
            filterLabel: size.name,
            filterProductCount: 0,
            filterSeName: size.name,
            filterDisplayOrder: size.displayOrder,
          });
        });

        facetsWithFiltersKeeper.push({
          facetId: CUSTOM_SIZE_FACET_ID,
          facetLabel: "Size",
          facetSeName: SIZE_FACET_SENAME,
          filterFacetFieldsValues: allSizes,
        });
      }

      if (models.priceRanges && models.priceRanges.length > 0) {
        facetsKeeper.push(PRICE_RANGE_FACET_SENAME);

        const allPriceRanges: any = [];
        models.priceRanges.forEach((priceRange: any) => {
          allPriceRanges.push({
            filterId: priceRange.id,
            filterLabel: priceRange.name,
            filterProductCount: 0,
            filterSeName: priceRange.name,
            filterDisplayOrder: priceRange.displayOrder,
            to: priceRange.toPrice,
            from: priceRange.fromPrice,
          });
        });

        facetsWithFiltersKeeper.push({
          facetId: CUSTOM_PRICE_RANGE_ID,
          facetLabel: "Price Range",
          facetSeName: PRICE_RANGE_FACET_SENAME,
          filterFacetFieldsValues: allPriceRanges,
        });
      }
    } // SERVER SIDE

    // RESET COUNT
    if (oldFacets.length >= 0) {
      facetsWithFiltersKeeper = facetsWithFiltersKeeper.map((facet: any) => {
        return {
          ...facet,
          filterFacetFieldsValues: facet.filterFacetFieldsValues.map(
            (filter: any) => {
              if (
                modifyBooleanOutput(
                  {
                    uniqueAppliedFacets,
                    isBrandPage,
                    facetSeName: facet.facetSeName,
                  },
                  DONT_UPDATE_COUNT_ON_APPLYING_FILTER(
                    isBrandPage,
                    specialCondition
                  ).includes(facet.facetSeName)
                )
              ) {
                return filter;
              }

              return { ...filter, filterProductCount: 0 };
            }
          ),
        };
      });
    } // CLIENT

    const brandFacetIndex = facetsKeeper.indexOf(BRAND_FACET_SENAME);
    const genderFacetIndex = facetsKeeper.indexOf(GENDER_FACET_SENAME);

    const productTypeFacetIndex = facetsKeeper.indexOf(
      PRODUCT_TYPE_FACET_SENAME
    );
    const priceRangeFacetIndex = facetsKeeper.indexOf(PRICE_RANGE_FACET_SENAME);

    const colorFacetIndex = facetsKeeper.indexOf(COLOR_FACET_SENAME);

    const sizeFacetIndex = facetsKeeper.indexOf(SIZE_FACET_SENAME);
    //

    const appliedPriceSeName = orderedAppliedFilters.find(
      (appliedFilter) => appliedFilter.facetSeName === PRICE_RANGE_FACET_SENAME
    );

    const { min: applicableMin, max: applicableMax } = extractMinMax(
      appliedPriceSeName?.filterSeName,
      facetsWithFiltersKeeper[priceRangeFacetIndex].filterFacetFieldsValues
    );

    orderedAppliedFilters.forEach((appliedFilter, appliedFilterindex) => {
      newFacetIsApplied = appliedFilter.facetSeName !== lastAppliedFacet;
      lastAppliedFacet = appliedFilter.facetSeName;

      if (newFacetIsApplied || appliedFilter.isFiltersAndConition) {
        lastFacetAppliedProducts = filteredProducts;

        if (
          appliedFilterindex === 0 &&
          IS_AND_FACETS.includes(appliedFilter.facetSeName) &&
          lastFacetAppliedProducts.length === 0
        ) {
          lastFacetAppliedProducts = originalProducts;
        }

        filteredProducts = [];
        productIds = [];
      }

      lastFacetAppliedProducts.forEach((product: any) => {
        // BLOCK - 2 : Start --------> Here all products will be filtered by brands

        // SETTING COUNT TO ZERO
        if (brandFacetIndex !== -1) {
          facetsWithFiltersKeeper[brandFacetIndex].filterFacetFieldsValues =
            updateCount({
              oldArray:
                facetsWithFiltersKeeper[brandFacetIndex]
                  .filterFacetFieldsValues,
              keyToMatch: {
                facetName: BRAND_FACET_SENAME,
                brandName: product.brandName,
              },
              resetToZero: true,
              isBrandPage: isBrandPage,
              specialCondition: specialCondition,
              uniqueAppliedFacets: uniqueAppliedFacets,
            });
        }

        if (genderFacetIndex !== -1) {
          facetsWithFiltersKeeper[genderFacetIndex].filterFacetFieldsValues =
            updateCount({
              oldArray:
                facetsWithFiltersKeeper[genderFacetIndex]
                  .filterFacetFieldsValues,
              keyToMatch: {
                facetName: GENDER_FACET_SENAME,
                productGender: product.gender,
              },
              isBrandPage: isBrandPage,
              resetToZero: true,
              specialCondition: specialCondition,
              uniqueAppliedFacets: uniqueAppliedFacets,
            });
        }

        if (productTypeFacetIndex !== -1) {
          facetsWithFiltersKeeper[
            productTypeFacetIndex
          ].filterFacetFieldsValues = updateCount({
            oldArray:
              facetsWithFiltersKeeper[productTypeFacetIndex]
                .filterFacetFieldsValues,
            keyToMatch: {
              facetName: PRODUCT_TYPE_FACET_SENAME,
              categorySeName: product.categorySename.map((a: any) =>
                a.toLowerCase()
              ),
            },
            resetToZero: true,
            isBrandPage: isBrandPage,
            specialCondition: specialCondition,
            uniqueAppliedFacets: uniqueAppliedFacets,
          });
        }

        if (colorFacetIndex !== -1) {
          facetsWithFiltersKeeper[colorFacetIndex].filterFacetFieldsValues =
            updateCount({
              oldArray:
                facetsWithFiltersKeeper[colorFacetIndex]
                  .filterFacetFieldsValues,
              keyToMatch: {
                facetName: COLOR_FACET_SENAME,
                colorName: product.colorName,
              },
              resetToZero: true,
              isBrandPage: isBrandPage,
              specialCondition: specialCondition,
              uniqueAppliedFacets: uniqueAppliedFacets,
            });
        }

        if (sizeFacetIndex !== -1) {
          facetsWithFiltersKeeper[sizeFacetIndex].filterFacetFieldsValues =
            updateCount({
              oldArray:
                facetsWithFiltersKeeper[sizeFacetIndex].filterFacetFieldsValues,
              keyToMatch: {
                facetName: SIZE_FACET_SENAME,
                sizeName: product.sizeName,
              },
              resetToZero: true,
              isBrandPage: isBrandPage,
              specialCondition: specialCondition,
              uniqueAppliedFacets: uniqueAppliedFacets,
            });
        }

        if (priceRangeFacetIndex !== -1) {
          facetsWithFiltersKeeper[
            priceRangeFacetIndex
          ].filterFacetFieldsValues = updateCount({
            oldArray:
              facetsWithFiltersKeeper[priceRangeFacetIndex]
                .filterFacetFieldsValues,
            keyToMatch: {
              facetName: PRICE_RANGE_FACET_SENAME,
              productPrice: product.salePrice,
            },
            resetToZero: true,
            isBrandPage: isBrandPage,
            specialCondition: specialCondition,
            uniqueAppliedFacets: uniqueAppliedFacets,
          });
        }

        // ACTUALLY FILTERING PRODUCTS BASED ON APPLIED FILTER

        if (appliedFilter.facetSeName === BRAND_FACET_SENAME) {
          if (product.brandName === appliedFilter.filterLabel) {
            if (productIds.includes(product.id)) return;
            productIds.push(product.id);
            filteredProducts.push(product);
          }
        }

        if (appliedFilter.facetSeName === GENDER_FACET_SENAME) {
          if (product.gender === appliedFilter.filterLabel) {
            if (productIds.includes(product.id)) return;
            productIds.push(product.id);
            filteredProducts.push(product);
          }
        }

        if (appliedFilter.facetSeName === PRODUCT_TYPE_FACET_SENAME) {
          if (
            product.categorySename
              .map((a: any) => a.toLowerCase())
              .includes(appliedFilter.filterSeName)
          ) {
            if (productIds.includes(product.id)) return;
            productIds.push(product.id);
            filteredProducts.push(product);
          }
        }

        if (appliedFilter.facetSeName === COLOR_FACET_SENAME) {
          if (product.colorName.includes(appliedFilter.filterLabel)) {
            if (productIds.includes(product.id)) return;
            productIds.push(product.id);
            filteredProducts.push(product);
          }
        }

        if (appliedFilter.facetSeName === SIZE_FACET_SENAME) {
          if (product.sizeName.includes(appliedFilter.filterLabel)) {
            if (productIds.includes(product.id)) return;
            productIds.push(product.id);
            filteredProducts.push(product);
          }
        }

        if (appliedFilter.facetSeName === PRICE_RANGE_FACET_SENAME) {
          if (
            product.salePrice >= applicableMin &&
            product.salePrice <= applicableMax
          ) {
            if (productIds.includes(product.id)) return;
            productIds.push(product.id);
            filteredProducts.push(product);
          }
        }
      });
    });

    if (orderedAppliedFilters.length === 0) {
      filteredProducts = originalProducts;
    }

    /////////

    const filterOptions = extractFacetsWithFiltersCount({
      products: filteredProducts,
      facets: facetsKeeper,
      facetsWithFilters: facetsWithFiltersKeeper,
      isBrandPage: isBrandPage,
      isUserLoggedIn: isUserLoggedIn,
      specialCondition: specialCondition,
      uniqueAppliedFacets: uniqueAppliedFacets,
    });

    const totalAvailable = filteredProducts.length;
    return {
      filterOptions,
      filtered: filteredProducts,
      totalAvailable: totalAvailable,
    };
  } catch (error) {
    console.log(error);
    return {
      filterOptions: [],
      filtered: [],
      totalAvailable: 0,
    };
  }
};

export const extractFacetsWithFiltersCount = ({
  products,
  facetsWithFilters = [],
  facets = [],
  isBrandPage,
  isUserLoggedIn,
  specialCondition,
  uniqueAppliedFacets,
}: {
  products: any[];
  facetsWithFilters: any[];
  facets: string[];
  isBrandPage: boolean;
  isUserLoggedIn: boolean;
  specialCondition: boolean;
  uniqueAppliedFacets: any[];
}): any[] => {
  //
  const brandFacetIndex = facets.indexOf(BRAND_FACET_SENAME);
  const genderFacetIndex = facets.indexOf(GENDER_FACET_SENAME);
  const productTypesFacetsIndex = facets.indexOf(PRODUCT_TYPE_FACET_SENAME);
  const colorFacetIndex = facets.indexOf(COLOR_FACET_SENAME);
  const sizeFacetIndex = facets.indexOf(SIZE_FACET_SENAME);
  const priceRangeFacetIndex = facets.indexOf(PRICE_RANGE_FACET_SENAME);

  products.forEach((product) => {
    if (brandFacetIndex !== -1) {
      facetsWithFilters[brandFacetIndex].filterFacetFieldsValues = updateCount({
        oldArray: facetsWithFilters[brandFacetIndex].filterFacetFieldsValues,
        keyToMatch: {
          facetName: BRAND_FACET_SENAME,
          brandName: product.brandName,
        },
        isBrandPage: isBrandPage,
        specialCondition: specialCondition,
        uniqueAppliedFacets: uniqueAppliedFacets,
      });
    }

    if (genderFacetIndex !== -1) {
      facetsWithFilters[genderFacetIndex].filterFacetFieldsValues = updateCount(
        {
          oldArray: facetsWithFilters[genderFacetIndex].filterFacetFieldsValues,
          keyToMatch: {
            facetName: GENDER_FACET_SENAME,
            productGender: product.gender,
          },
          isBrandPage: isBrandPage,
          specialCondition: specialCondition,
          uniqueAppliedFacets: uniqueAppliedFacets,
        }
      );
    }

    if (productTypesFacetsIndex !== -1) {
      facetsWithFilters[productTypesFacetsIndex].filterFacetFieldsValues =
        updateCount({
          oldArray:
            facetsWithFilters[productTypesFacetsIndex].filterFacetFieldsValues,
          keyToMatch: {
            facetName: PRODUCT_TYPE_FACET_SENAME,
            categorySeName: product.categorySename,
          },
          isBrandPage: isBrandPage,
          specialCondition: specialCondition,
          uniqueAppliedFacets: uniqueAppliedFacets,
        });
    }

    if (colorFacetIndex !== -1) {
      facetsWithFilters[colorFacetIndex].filterFacetFieldsValues = updateCount({
        oldArray: facetsWithFilters[colorFacetIndex].filterFacetFieldsValues,
        keyToMatch: {
          facetName: COLOR_FACET_SENAME,
          colorName: product.colorName,
        },
        isBrandPage: isBrandPage,
        specialCondition: specialCondition,
        uniqueAppliedFacets: uniqueAppliedFacets,
      });
    }

    if (sizeFacetIndex !== -1) {
      facetsWithFilters[sizeFacetIndex].filterFacetFieldsValues = updateCount({
        oldArray: facetsWithFilters[sizeFacetIndex].filterFacetFieldsValues,
        keyToMatch: {
          facetName: SIZE_FACET_SENAME,
          sizeName: product.sizeName,
        },
        isBrandPage: isBrandPage,
        specialCondition: specialCondition,
        uniqueAppliedFacets: uniqueAppliedFacets,
      });
    }

    if (priceRangeFacetIndex !== -1) {
      facetsWithFilters[priceRangeFacetIndex].filterFacetFieldsValues =
        updateCount({
          oldArray:
            facetsWithFilters[priceRangeFacetIndex].filterFacetFieldsValues,
          keyToMatch: {
            facetName: PRICE_RANGE_FACET_SENAME,
            productPrice: isUserLoggedIn ? product.salePrice : product.msrp,
          },
          isBrandPage: isBrandPage,
          specialCondition: specialCondition,
          uniqueAppliedFacets: uniqueAppliedFacets,
        });
    }
  });

  const result = sortFacetWithFilters(
    facetsWithFilters,
    isBrandPage,
    specialCondition
  );

  return result;
};

export const HIDE_FILTERS_WITH_ZERO_PRODUCT_COUNT = (
  isBrandPage: boolean,
  ignoreThisCondition: boolean
): any[] => {
  if (isBrandPage) {
    if (ignoreThisCondition)
      return [
        "category",
        "product type",
        "gender",
        "color",
        "size",
        "price range",
      ];
    return [
      "category",
      "product type",
      "gender",
      "color",
      "size",
      "price range",
    ];
  }

  if (ignoreThisCondition)
    return ["brand", "product type", "color", "size", "price range"];
  return ["product type", "color", "size", "price range"];
};

export const SORT_FILTERS_ALPHABETICALLY: any[] = [];

export const SORT_FILTERS_NUMERICALLY_IN_ASC_ORDER: any[] = ["price range"];

export const FACETS_DISPLAY_ORDER: any[] = [
  CATEGORY_FACET_SENAME,
  BRAND_FACET_SENAME,
  GENDER_FACET_SENAME,
  PRODUCT_TYPE_FACET_SENAME,
  COLOR_FACET_SENAME,
  SIZE_FACET_SENAME,
  PRICE_RANGE_FACET_SENAME,
];

const sortFacetWithFilters = (
  facetsWithFilters: any[],
  isBrandPage: boolean,
  specialCondition: boolean
): any[] => {
  const sorted = facetsWithFilters.map((facetWithFilter) => {
    let filterFacetFieldsValues: any["filterFacetFieldsValues"] = [];

    if (
      HIDE_FILTERS_WITH_ZERO_PRODUCT_COUNT(
        isBrandPage,
        specialCondition
      ).includes(facetWithFilter.facetSeName)
    ) {
      facetWithFilter.filterFacetFieldsValues.forEach((filter: any) => {
        if (filter.filterProductCount >= 1) {
          filterFacetFieldsValues.push(filter as any);
        }
      });
    } else {
      filterFacetFieldsValues = facetWithFilter.filterFacetFieldsValues;
    }

    return {
      ...facetWithFilter,
      filterFacetFieldsValues: filterFacetFieldsValues.sort((a, b) => {
        if (SORT_FILTERS_ALPHABETICALLY.includes(facetWithFilter.facetSeName)) {
          return a.filterLabel.localeCompare(b.filterLabel);
        }

        if (
          SORT_FILTERS_NUMERICALLY_IN_ASC_ORDER.includes(
            facetWithFilter.facetSeName
          )
        ) {
          const typedA = a[0];
          const typedB = b[0];
          return typedA.to - typedB.to;
        }

        return a.filterId - b.filterId;
      }),
    };
  });

  //
  return sorted.sort((a, b) => {
    if (FACETS_DISPLAY_ORDER.length !== 0) {
      return (
        FACETS_DISPLAY_ORDER.indexOf(a.facetSeName) -
        FACETS_DISPLAY_ORDER.indexOf(b.facetSeName)
      );
    }
    return a.facetId - b.facetId;
  });
};

export const updateRequiredFieldsToAppliedFilters = ({
  filtersChips,
  rawFacetWithFiltersFromAPI,
  models,
}: {
  filtersChips: {
    facetSeName: string;
    filterSeName: string;
    allowToRemoveFromChip: boolean;
  }[];
  rawFacetWithFiltersFromAPI: any;
  models: {
    brands?: any;
    categories?: any;
    sizes?: any;
    colors?: any;
    priceRanges?: any;
    gender?: any;
    productTypes?: any;
  };
}): any[] => {
  const selectedFilters: any[] = [];

  for (const appliedFilter of filtersChips) {
    const appliedFacetName = appliedFilter.facetSeName;

    // BRANDS -------------------------
    if (appliedFacetName === BRAND_FACET_SENAME) {
      models.brands?.find((brand: any) => {
        if (
          brand.name.toLowerCase() === appliedFilter.filterSeName.toLowerCase()
        ) {
          selectedFilters.push({
            filterId: brand.id,
            filterLabel: brand.name,
            filterSeName: brand.name.toLowerCase(),
            facetSeName: appliedFacetName,

            isFiltersAndConition: IS_AND_FACETS.includes(BRAND_FACET_SENAME),
          });
          return true;
        }
        return false;
      });
    }

    if (appliedFacetName === CATEGORY_FACET_SENAME) {
      models.categories?.find((category: any) => {
        if (
          category.name.toLowerCase() ===
          appliedFilter.filterSeName.toLowerCase()
        ) {
          selectedFilters.push({
            filterId: category.id,
            filterLabel: category.name,
            filterSeName: category.sename.toLowerCase(),
            facetSeName: appliedFacetName,
            isFiltersAndConition: IS_AND_FACETS.includes(CATEGORY_FACET_SENAME),
          });
          return true;
        }
        return false;
      });
    }

    if (appliedFacetName === SIZE_FACET_SENAME) {
      models.sizes?.find((size: any) => {
        if (
          size.name.toLowerCase() === appliedFilter.filterSeName.toLowerCase()
        ) {
          selectedFilters.push({
            filterId: size.id,
            filterLabel: size.name,
            filterSeName: size.name.toLowerCase(),
            facetSeName: appliedFacetName,
            isFiltersAndConition: IS_AND_FACETS.includes(SIZE_FACET_SENAME),
          });
          return true;
        }
        return false;
      });
    }
    if (appliedFacetName === GENDER_FACET_SENAME) {
      models.gender?.find((gender: any) => {
        if (
          gender.name.toLowerCase() === appliedFilter.filterSeName.toLowerCase()
        ) {
          selectedFilters.push({
            filterId: gender.id,
            filterLabel: gender.name,
            filterSeName: gender.name.toLowerCase(),
            facetSeName: appliedFacetName,
            isFiltersAndConition: IS_AND_FACETS.includes(GENDER_FACET_SENAME),
          });
          return true;
        }
        return false;
      });
    }
    if (appliedFacetName === PRODUCT_TYPE_FACET_SENAME) {
      models.productTypes?.find((productType: any) => {
        if (
          productType.name.toLowerCase() ===
          appliedFilter.filterSeName.toLowerCase()
        ) {
          selectedFilters.push({
            filterId: productType.id,
            filterLabel: productType.name,
            filterSeName: productType.name.toLowerCase(),
            facetSeName: appliedFacetName,
            isFiltersAndConition: IS_AND_FACETS.includes(
              PRODUCT_TYPE_FACET_SENAME
            ),
          });
          return true;
        }
        return false;
      });
    }
    if (appliedFacetName === PRICE_RANGE_FACET_SENAME) {
      models.priceRanges?.find((priceRange: any) => {
        if (
          priceRange.name.toLowerCase() ===
          appliedFilter.filterSeName.toLowerCase()
        ) {
          selectedFilters.push({
            filterId: priceRange.id,
            filterLabel: priceRange.name,
            filterSeName: priceRange.name.toLowerCase(),
            facetSeName: appliedFacetName,
            isFiltersAndConition: IS_AND_FACETS.includes(
              PRICE_RANGE_FACET_SENAME
            ),
          });
          return true;
        }
        return false;
      });
    }

    if (appliedFacetName === COLOR_FACET_SENAME) {
      models.colors?.find((color: any) => {
        if (
          color.name.toLowerCase() === appliedFilter.filterSeName.toLowerCase()
        ) {
          selectedFilters.push({
            filterId: color.id,
            filterLabel: color.name,
            filterSeName: color.name.toLowerCase(),
            facetSeName: appliedFacetName,
            isFiltersAndConition: IS_AND_FACETS.includes(COLOR_FACET_SENAME),
          });
          return true;
        }
        return false;
      });
    }
  }

  return selectedFilters;
};

export const pagination = (
  sort: Sort,
  page: string,
  rawinstock: string
): {
  startIndex: number;
  endIndex: number;
  sortBy: Sort;
  currentPage: number;
  itemsPerPage: number;
  stockType: IN_STOCK;
  isStockAvailable: boolean;
} => {
  const sortBy: Sort = sort ? (sort as unknown as Sort) : Sort.Relevance;
  const pageNo = +(page || 1);
  const itemsPerPage = 12;
  let stockType = 1;
  let isStockAvailable = false;

  switch (rawinstock) {
    case "true":
      stockType = 2;
      isStockAvailable = true;
      break;

    case "false":
      stockType = 1;
      isStockAvailable = false;
      break;

    default:
      stockType = 1;
      isStockAvailable = false;
      break;
  }

  return {
    itemsPerPage: itemsPerPage,
    startIndex: (pageNo - 1) * itemsPerPage,
    endIndex: pageNo * itemsPerPage - 1,
    sortBy: sortBy,
    currentPage: pageNo,
    stockType: stockType,
    isStockAvailable,
  };
};

const calculateRank = (priorities: Record<TAGS, number>, tags: any) => {
  let rank = 0;
  let highestPriorityScore = 0;
  const total = 100; // instead it should be total of priorities
  const totalTags = tags.length;
  tags.forEach((tag: any) => {
    const priorityScore = priorities[tag.productTagName.toLowerCase() as TAGS];

    if (totalTags === 1) {
      rank += priorityScore * priorityScore * priorityScore + total;
      return;
    }

    if (priorityScore > highestPriorityScore)
      highestPriorityScore = priorityScore;

    rank += priorityScore;
  });
  // Adjust rank based on the number of elements

  if (totalTags === 1) return rank;

  return (
    highestPriorityScore * highestPriorityScore * highestPriorityScore -
    (rank - highestPriorityScore)
  );
};

export const sortProducts = ({
  sortBy,
  filtered,
  isUserLoggedIn,
}: {
  sortBy: Sort;
  filtered: any;
  isUserLoggedIn: boolean;
}) => {
  if (sortBy === Sort.QuickShip || sortBy === Sort.Relevance) {
    const priorities = {
      [TAGS.QUICK_SHIP]: 7,
      [TAGS.HIGH_STOCK]: 6,
      [TAGS.BEST_SELLER]: 5,
      [TAGS.BEST_SELLER_FEATURED]: 4,
      [TAGS.JUST_IN]: 3,
      [TAGS.LOW_STOCK]: 2,
      [TAGS.SALE]: 1,
    };

    const sorted: any = filtered.slice().sort((a, b) => {
      const rankA = calculateRank(priorities, a.productTagViewModel);
      const rankB = calculateRank(priorities, b.productTagViewModel);
      return rankB - rankA;
    });
    return sorted;
  }

  if (sortBy === Sort.HighStock) {
    const priorities = {
      [TAGS.HIGH_STOCK]: 7,
      [TAGS.QUICK_SHIP]: 6,
      [TAGS.BEST_SELLER]: 5,
      [TAGS.BEST_SELLER_FEATURED]: 4,
      [TAGS.JUST_IN]: 3,
      [TAGS.LOW_STOCK]: 2,
      [TAGS.SALE]: 1,
    };

    const sorted: any = filtered.slice().sort((a: any, b: any) => {
      const rankA = calculateRank(priorities, a.productTagViewModel);
      const rankB = calculateRank(priorities, b.productTagViewModel);
      return rankB - rankA;
    });

    return sorted;
  }

  if (sortBy === Sort.BestSeller) {
    const priorities = {
      [TAGS.BEST_SELLER]: 7,
      [TAGS.BEST_SELLER_FEATURED]: 6,
      [TAGS.QUICK_SHIP]: 5,
      [TAGS.HIGH_STOCK]: 4,
      [TAGS.JUST_IN]: 3,
      [TAGS.LOW_STOCK]: 2,
      [TAGS.SALE]: 1,
    };

    const sorted: any = filtered.slice().sort((a: any, b: any) => {
      const rankA = calculateRank(priorities, a.productTagViewModel);
      const rankB = calculateRank(priorities, b.productTagViewModel);
      return rankB - rankA;
    });

    return sorted;
  }
  if (sortBy === Sort.JustIn) {
    const priorities = {
      [TAGS.JUST_IN]: 7,
      [TAGS.QUICK_SHIP]: 6,
      [TAGS.HIGH_STOCK]: 5,
      [TAGS.BEST_SELLER]: 4,
      [TAGS.BEST_SELLER_FEATURED]: 3,
      [TAGS.LOW_STOCK]: 2,
      [TAGS.SALE]: 1,
    };

    const sorted: any = filtered.slice().sort((a, b) => {
      const rankA = calculateRank(priorities, a.productTagViewModel);
      const rankB = calculateRank(priorities, b.productTagViewModel);
      return rankB - rankA;
    });

    return sorted;
  }

  if (sortBy === Sort.LowToHigh) {
    return filtered.slice().sort((a: any, b: any) => {
      if (isUserLoggedIn) return a.salePrice - b.salePrice;
      return a.msrp - b.msrp;
    });
  }

  if (sortBy === Sort.HighToLow) {
    return filtered.slice().sort((a: any, b: any) => {
      if (isUserLoggedIn) return b.salePrice - a.salePrice;
      return b.msrp - a.msrp;
    });
  }

  return filtered;
};

export const removeDuplicates = (arr: string[]) => {
  const unique: string[] = [];
  arr.forEach((element) => {
    if (!unique.includes(element)) {
      unique.push(element);
    }
  });
  return unique;
};

const extractPredefinedFacetNFilter = (
  filterFacetUrl: string | null
): {
  facets: string[];
  filters: string[];
} => {
  if (!filterFacetUrl) {
    return {
      facets: [],
      filters: [],
    };
  }

  const facetNFilters = filterFacetUrl.split("/");
  const filters = decodeURIComponent(facetNFilters[1])
    .replace(" ", "-")
    .split(",");
  const facets = decodeURIComponent(facetNFilters[0]).split(",");

  return {
    facets: facets,
    filters: filters,
  };
};

export const extractFacetsAndFilters = ({
  encodedFacets,
  encodedFilters,
  filterFacetUrl,
}: any): any => {
  const filterFacets: any[] = [];
  const filtersChips: {
    facetSeName: string;
    filterSeName: string;
    allowToRemoveFromChip: boolean;
  }[] = [];

  //
  try {
    let predefinedFacetExistInParam = false;

    if (encodedFacets && encodedFilters) {
      // when both fitlerFacet and params contains value
      const facets = removeDuplicates(
        decodeURIComponent(encodedFacets).split(",")
      );
      const filters = decodeURIComponent(encodedFilters).split(",");

      const predefinedFacetNFilter =
        extractPredefinedFacetNFilter(filterFacetUrl);

      facets.forEach((facet, index) => {
        const filtersByOneParticularFacet = filters[index];
        //
        let predefinedFacetExist: {
          facet: string | null;
          filters: string;
        } = {
          facet: null,
          filters: "",
        };

        predefinedFacetNFilter.facets.find(
          (predefinedFacet: any, index: any) => {
            if (predefinedFacet === facet) {
              predefinedFacetExist = {
                facet: predefinedFacet,
                filters: predefinedFacetNFilter.filters[index],
              };
            }
          }
        );

        // if filter and facet are present on filterFacetURL.
        const predefinedFacets = predefinedFacetExist
          ? predefinedFacetExist?.filters.split("~")
          : [];
        if (predefinedFacetExist.facet) {
          predefinedFacetExistInParam = true;
          filterFacets.push({
            name: facet,
            value: [
              ...filtersByOneParticularFacet.split("~"),
              ...predefinedFacetExist.filters.split("~"),
            ], // here we are addding fitlers and facets from filterFacetURL and params for API call
          });

          filtersByOneParticularFacet.split("~").forEach((filter) => {
            filtersChips.push({
              facetSeName: facet,
              filterSeName: filter,
              allowToRemoveFromChip: true, // here we are adding filters and facets extracted from params
            });
          });

          predefinedFacetExist.filters
            .split("~")
            .forEach((predefinedFilter) => {
              filtersChips.push({
                facetSeName: facet,
                filterSeName: predefinedFilter,
                allowToRemoveFromChip: false, // here we are addding fitlers and facets from filterFacetURL
              });
            });

          return;
        }

        // if no filter and facet are present on filterFacetURL.
        filterFacets.push({
          name: facet,
          value: filtersByOneParticularFacet.toLowerCase().split("~"),
        });

        filtersByOneParticularFacet.split("~").forEach((filter) => {
          const filterName = filter;

          filtersChips.push({
            facetSeName: facet.toLowerCase(),
            filterSeName: filterName.toLowerCase(),
            allowToRemoveFromChip: true,
          });
        });
      });
    }

    // incase if no params are found and filterFacetURL contains value.
    if (!predefinedFacetExistInParam) {
      const { facets, filters } = extractPredefinedFacetNFilter(filterFacetUrl);

      facets.forEach((facet: any, index: any) => {
        const filtersByFacet = filters[index];
        facet = facet.replace(" ", "-");

        filterFacets.push({
          name: facet,
          value: filtersByFacet.split("~"),
        });

        filtersByFacet.split("~").forEach((filter: any) => {
          filtersChips.push({
            facetSeName: facet,
            filterSeName: filter,
            allowToRemoveFromChip: false,
          });
        });
      });
    }
    // add zone only over here either in absence of params or zone not added manually through params.
    return {
      filterFacets,
      filtersChips,
    };
  } catch (error: any) {
    throw new Error(
      error?.message || "Occurred while extracting filters and facets"
    );
  }
};

export const extractSlugName = (
  contextParam: string[]
): {
  sename: string;
  otherParams: string[] | null;
  path: string;
} => {
  if (contextParam) {
    const params = contextParam as string[];

    if (params && params.length > 0) {
      const lastElementIndex = params.length - 1;
      const sename = params[lastElementIndex].replace(".html", "");

      if (params.length === 1) {
        return {
          sename: sename,
          otherParams: null,
          path: params.join("/"),
        };
      }
      params.pop();
      return {
        sename: sename,
        otherParams: params,
        path: params.join("/"),
      };
    }
  }

  return { sename: "/", otherParams: null, path: "" };
};
