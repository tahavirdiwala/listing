import axios from "axios";

class ProductService {
  getAll(payload = {}) {
    return axios.post("http://localhost:3000/api/fetch/products", payload);
  }

  brands(
    payload = {
      storeID: 5,
      brandId: 3,
      customerId: 0,
      pageStartindex: 0,
      pageEndindex: 0,
      filterOptionforfaceteds: [],
    }
  ) {
    return axios.post(
      "http://localhost:3000/StoreProductFilter/GetFilterByCategoryByCatcheWithJson.json",
      payload
    );
  }
}

const productService = new ProductService();
export default productService;
