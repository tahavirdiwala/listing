// ACTIVE FACETS FOR THIS STORE
export const CATEGORY_FACET_SENAME = "category";
export const BRAND_FACET_SENAME = "brand";
export const GENDER_FACET_SENAME = "gender";
export const PRODUCT_TYPE_FACET_SENAME = "product type";
export const COLOR_FACET_SENAME = "color";
export const SIZE_FACET_SENAME = "size";
export const PRICE_RANGE_FACET_SENAME = "price range";

// NOT IN USE
export const NOT_IN_USE_ZONE_FACET_SENAME = "zone";

//
export type iFacetSeName =
  | typeof PRICE_RANGE_FACET_SENAME
  | typeof BRAND_FACET_SENAME
  | typeof PRODUCT_TYPE_FACET_SENAME
  | typeof COLOR_FACET_SENAME
  | typeof CATEGORY_FACET_SENAME
  | typeof SIZE_FACET_SENAME
  | typeof GENDER_FACET_SENAME
  | typeof PRODUCT_TYPE_FACET_SENAME
  | typeof NOT_IN_USE_ZONE_FACET_SENAME;

// ARRANGE IN DESCENDING ORDER
export const CUSTOM_BRAND_FACET_ID = 9999;
export const CUSTOM_PRICE_RANGE_ID = 9998;
export const CUSTOM_SIZE_FACET_ID = 9997;
export const CUSTOM_COLOR_FACET_ID = 9996;
export const CUSTOM_CATEGORY_FACET_ID = 9995;
export const CUSTOM_GENDER_FACET_ID = 9994;
export const CUSTOM_PRODUCT_TYPE_FACET_ID = 9993;

//
export const CUSTOM_MAX_PRICE_POSSIBLE = 10000;
export const MAX_POSSIBLE_PRODUCTS = 20000;
export const DEFAULT_NO_IMAGE_FOUND_URL = "";

// QUERY PARAMS
export const QUERY_FACETS = "facets";
export const QUERY_FILTERS = "filters";
export const QUERY_PAGE = "page";
export const QUERY_INSTOCK = "instock";
export const QUERY_SORT = "sort";

////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////
////////////////////////////////////////

export enum SORT {
  RELEVANCE = "relevance",
  QUICK_SHIP = "quick-ship",
  HIGH_STOCK = "high-stock",
  BEST_SELLER = "best-seller",
  JUST_IN = "just-in",
  LOW_TO_HIGH = "low-to-high",
  HIHT_TO_LOW = "high-to-low",
}

export enum IN_STOCK {
  Both = 1,
  InStock = 2,
  OutOfStock = 3,
}

export enum TAGS {
  SALE = "sale",
  JUST_IN = "new arrival",
  BEST_SELLER_FEATURED = "featured",
  LOW_STOCK = "low stock",
  HIGH_STOCK = "high stock",
  QUICK_SHIP = "quick ship",
  BEST_SELLER = "best seller",
}

export const SORT_TAGS_MAPPING = {
  relevance: "quick ship",
  "quick-ship": "quick ship",
  "high-stock": "high stock",
  "best-seller": "featured",
  "just-in": "new arrival",
  "low-to-high": null,
  "high-to-low": null,
};
