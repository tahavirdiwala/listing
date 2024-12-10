import { Suspense } from "react";
import ProductsList from "./_components/listing";
import productService from "../_services/product.service";
import { getSlugResponse } from "@/app/_services/getSlug";

const Products = async () => {
  try {
    const response = await (await productService.getAllProductsSSR()).json();
    const filterOptions = await getSlugResponse();

    return (
      <Suspense fallback="loading..">
        <ProductsList initialData={response} filterOptions={filterOptions} />
      </Suspense>
    );
  } catch (error) {
    console.log(error);
  }
};

export default Products;
