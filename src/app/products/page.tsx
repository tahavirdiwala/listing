import { Suspense } from "react";
import ProductsList from "./_components/listing";

const Products = () => {
  return (
    <Suspense fallback="loading..">
      <ProductsList />
    </Suspense>
  );
};

export default Products;
