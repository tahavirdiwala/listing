import { Suspense } from "react";
import ProductsList from "./_components/listing";
import productService from "../_services/product.service";

const Products = async () => {
  try {
    const response = await (await productService.getAllProductsSSR()).json();

    return (
      <Suspense fallback="loading..">
        <ProductsList initialData={response} />
      </Suspense>
    );
  } catch (error) {
    console.log(error);
  }
};

export default Products;
