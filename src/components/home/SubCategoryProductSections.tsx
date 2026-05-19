"use client";

import ProductCarouselSection from "@/components/shared/ProductCarouselSection";
import { mapCategoryProductToCard } from "@/lib/utils/category-product";
import type { SubCategory } from "@/lib/api/categories";

interface Props {
  subCategories: SubCategory[];
}

const SubCategoryProductSections = ({ subCategories }: Props) => {
  const sections = subCategories.filter((sc) => sc.data?.length > 0);
  
  if (sections.length === 0) return null;

  return (
    <>
      {sections.map((sc) => {
        const isNewArrival = sc.name.toLowerCase().includes("new arrival");
        const products = sc.data.map((p) =>
          mapCategoryProductToCard(p, { isNewArrival })
        );

        return (
          <ProductCarouselSection
            key={`${sc.category_id}-${sc.id}`}
            title={sc.name}
            subtitle={sc.category_name}
            products={products}
            linkProducts
            viewAllHref={`/products?categories=${sc.category_id}&subcats=${sc.id}`}
          />
        );
      })}
    </>
  );
};

export default SubCategoryProductSections;
