import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Flower2 } from "lucide-react";
import { ProductCard } from "@/components/site/ProductCard";
import { QuickView } from "@/components/site/QuickView";
import { categories, products, type Product } from "@/data/products";

export const Route = createFileRoute("/category/$category")({
  loader: ({ params }) => {
    const category = decodeURIComponent(params.category);
    if (!categories.includes(category as (typeof categories)[number])) throw notFound();

    return {
      category: category as (typeof categories)[number],
      products: products.filter((product) => product.category === category),
    };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.category ?? "Category"} | Kalyani Ghee Sweets`,
      },
    ],
  }),
  component: CategoryPage,
});

function CategoryPage() {
  const { category, products: categoryProducts } = Route.useLoaderData();
  const [quick, setQuick] = useState<Product | null>(null);

  return (
    <main className="bg-background">
      <section
        aria-labelledby="category-title"
        className="flex min-h-[68px] flex-col items-center justify-center border-t-[2px] border-primary bg-[#f2ead8] px-4 py-1.5 text-center md:min-h-[82px]"
      >
        <h1
          id="category-title"
          className="text-[#650d0d]"
          style={{
            fontFamily: 'Arial, Helvetica, sans-serif',
            fontWeight: 700,
            lineHeight: 0.9,
            letterSpacing: "-0.04em",
          }}
        >
          <span className="block text-[1.5rem] md:text-[2.6rem]">{category}</span>
        </h1>
      </section>
      <div className="mx-auto max-w-7xl px-4 py-5 md:py-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} onQuickView={setQuick} />
          ))}
        </div>
      </div>
      <QuickView product={quick} onClose={() => setQuick(null)} />
    </main>
  );
}
