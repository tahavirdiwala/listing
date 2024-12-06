import axios from "axios";

class ProductService {
  getAll(payload = {}) {
    //https://www.corporategear.com/api/fetch/products
    const mapper = {
      local: "http://localhost:3000/api/fetch/products",
      live: "https://www.corporategear.com/api/fetch/products"
    }
    return axios.post(mapper.live, payload);
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
    // https://www.corporategear.com/StoreProductFilter/GetFilterByCategoryByCatcheWithJson.json
    const mapper = {
      local: "http://localhost:3000/StoreProductFilter/GetFilterByCategoryByCatcheWithJson.json",
      live: "https://www.corporategear.com/StoreProductFilter/GetFilterByCategoryByCatcheWithJson.json"
    }
    return axios.post(
      mapper.live,
      payload
    );
  }
}

const productService = new ProductService();
export default productService;
