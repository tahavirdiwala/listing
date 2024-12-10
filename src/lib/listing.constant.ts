import { Sort } from "./constant";

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

const SortOptions: { name: string; type: Sort }[] = [
  {
    name: "Relevance",
    type: Sort.Relevance,
  },
  {
    name: "Quick Ship",
    type: Sort.QuickShip,
  },
  {
    name: "High Stock",
    type: Sort.HighStock,
  },
  {
    name: "Best Seller",
    type: Sort.BestSeller,
  },
  {
    name: "Just In",
    type: Sort.JustIn,
  },
  {
    name: "Price: (High to Low)",
    type: Sort.HighToLow,
  },
  {
    name: "Price: (Low to High)",
    type: Sort.LowToHigh,
  },
];

const defaultImagePath =
  "https://corporategear.com/cdn-cgi/image/height=348,quality=100/https://storagemedia.corporategear.com/";

export { Sort, listingPayload, SortOptions, filterPayload, defaultImagePath };
