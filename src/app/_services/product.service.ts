import axios from "axios";

class ProductService {
  getAll(payload = {}) {
    return axios.post("http://localhost:3000/api/fetch/products", payload);
  }
}

const productService = new ProductService();
export default productService;
