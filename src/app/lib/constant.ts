enum Sort {
  RELEVANCE = "relevance",
  QUICK_SHIP = "quick-ship",
  HIGH_STOCK = "high-stock",
  BEST_SELLER = "best-seller",
  JUST_IN = "just-in",
  LOW_TO_HIGH = "low-to-high",
  HIGH_TO_LOW = "high-to-low",
}

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
    type: Sort.RELEVANCE,
  },
  {
    name: "Quick Ship",
    type: Sort.QUICK_SHIP,
  },
  {
    name: "High Stock",
    type: Sort.HIGH_STOCK,
  },
  {
    name: "Best Seller",
    type: Sort.BEST_SELLER,
  },
  {
    name: "Just In",
    type: Sort.JUST_IN,
  },
  {
    name: "Price: (High to Low)",
    type: Sort.HIGH_TO_LOW,
  },
  {
    name: "Price: (Low to High)",
    type: Sort.LOW_TO_HIGH,
  },
];

const brandsArray = [
  "Adidas",
  "Alternative",
  "Arctic Zone",
  "B. Draddy",
  "Bella + Canvas",
  "Berne Apparel",
  "Bose",
  "BruMate",
  "Callaway Golf",
  "Camelbak",
  "Carhartt",
  "Charles River Apparel",
  "Columbia",
  "Core 365",
  "Corkcicle",
  "Courant",
  "Dudley Stephens",
  "Eddie Bauer",
  "Ember",
  "Faherty Brand",
  "Fairway & Greene",
  "Galvin Green",
  "Miir",
  "Moleskine",
  "New Era",
  "Next Level",
  "Nike",
  "YETI",
  "Yupoong",
];

const brandsMapper = brandsArray.reduce(
  (acc, curr) => ({ ...acc, [curr]: false }),
  {} as Record<string, boolean>
);

export {
  Sort,
  listingPayload,
  SortOptions,
  filterPayload,
  brandsArray,
  brandsMapper,
};
