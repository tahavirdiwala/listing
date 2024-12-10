import { SORT } from "./constant";

const listingPayload = {
  sortBy: "",
  pageNo: 1,
  facetsUrl: "",
  filtersUrl: "",
  pageId: 3,
  seName: "men",
  isBrand: false,
  isUserLoggedIn: true,
};

const filterPayload = {
  storeID: 5,
  brandId: 3,
  customerId: 0,
  pageStartindex: 0,
  pageEndindex: 0,
  filterOptionforfaceteds: [],
};

const SortOptions: { name: string; type: SORT }[] = [
  {
    name: "Relevance",
    type: SORT.RELEVANCE,
  },
  {
    name: "Quick Ship",
    type: SORT.QUICK_SHIP,
  },
  {
    name: "High Stock",
    type: SORT.HIGH_STOCK,
  },
  {
    name: "Best Seller",
    type: SORT.BEST_SELLER,
  },
  {
    name: "Just In",
    type: SORT.JUST_IN,
  },
  {
    name: "Price: (High to Low)",
    type: SORT.HIHT_TO_LOW,
  },
  {
    name: "Price: (Low to High)",
    type: SORT.LOW_TO_HIGH,
  },
];

const defaultImagePath =
  "https://corporategear.com/cdn-cgi/image/height=348,quality=100/https://storagemedia.corporategear.com/";

export { SORT, listingPayload, SortOptions, filterPayload, defaultImagePath };
