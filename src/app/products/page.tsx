import { Suspense } from "react";
import ProductsList from "./_components/listing";
import productService from "../../services/product.service";
import { getSlugResponse } from "@/services/getSlug";

const Products = async () => {
  try {
    const response = await (await productService.getAllProductsSSR()).json();
    const filterOptions = await getSlugResponse();

    const brandsFilters = filterOptions.brand[0]?.filterFacetFieldsValues?.map(
      (item: { filterSeName: string }) => item?.filterSeName
    );

    return (
      <Suspense fallback="loading..">
        <ProductsList initialData={response} brandsFilter={brandsFilters} />
      </Suspense>
    );
  } catch (error) {
    console.log(error);
  }
};

export default Products;
