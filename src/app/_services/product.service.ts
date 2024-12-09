import axios from "axios";
import { listingPayload } from "../lib/constant";

class ProductService {
  getAll(payload = {}) {
    const mapper = {
      local: "http://localhost:3000/api/fetch/products",
      live: "https://www.corporategear.com/api/fetch/products",
    };
    return axios.post(mapper.live, payload);
  }

  getAllProductsSSR() {
    const mapper = {
      local: "http://localhost:3000/api/fetch/products",
      live: "https://www.corporategear.com/api/fetch/products",
    };

    return fetch(mapper.live, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(listingPayload),
      next: { revalidate: 60 * 100 }
    });
  }

  categories(
    payload = {
      storeID: 5,
      brandId: 3,
      customerId: 0,
      pageStartindex: 0,
      pageEndindex: 0,
      filterOptionforfaceteds: [],
    }
  ) {
    const mapper = {
      local:
        "http://localhost:3000/StoreProductFilter/GetFilterByCategoryByCatcheWithJson.json",
      live: "https://www.corporategear.com/api/StoreProductFilter/GetFilterByCategoryByCatcheWithJson.json",
    };
    return axios.post(mapper.live, payload);
  }
}

const productService = new ProductService();
export default productService;
