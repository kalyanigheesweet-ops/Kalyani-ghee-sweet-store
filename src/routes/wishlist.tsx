import { Link, createFileRoute } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useState } from "react";

import { ProductCard } from "@/components/site/ProductCard";
import { QuickView } from "@/components/site/QuickView";
import { products, type Product } from "@/data/products";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist | Kalyani Ghee Sweets" },
      {
        name: "description",
        content: "Your saved Kalyani Ghee Sweets favourites.",
      },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { user, wishlist } = useStore();
  const [quick, setQuick] = useState<Product | null>(null);
  const savedProducts = products.filter((product) => wishlist.includes(product.id));

  if (!user) {
    return (
      <main className="mx-auto flex min-h-[45vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
        <Heart className="size-12 text-primary" />
        <h1 className="mt-4 text-3xl text-primary">Sign in to view your wishlist</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Save your favourite sweets after signing in.
        </p>
        <Link to="/login" className="btn-primary mt-6">
          Sign in
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex items-center gap-3">
        <Heart className="size-7 text-primary" />
        <div>
          <h1 className="text-3xl text-primary">My Wishlist</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {savedProducts.length === 0
              ? "Your saved sweets will appear here."
              : `${savedProducts.length} saved ${savedProducts.length === 1 ? "item" : "items"}`}
          </p>
        </div>
      </div>

      {savedProducts.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {savedProducts.map((product) => (
            <ProductCard key={product.id} product={product} onQuickView={setQuick} />
          ))}
        </div>
      ) : (
        <Link to="/" className="btn-outline mt-8 inline-flex">
          Browse sweets
        </Link>
      )}

      <QuickView product={quick} onClose={() => setQuick(null)} />
    </main>
  );
}