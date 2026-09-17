import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, Heart, Leaf, Phone, ShieldCheck, Star, Store } from "lucide-react";
import { getProduct, products } from "@/data/products";
import { PHONE, PHONE_DISPLAY, priceFor, useStore } from "@/lib/store";
import { ProductCard } from "@/components/site/ProductCard";
import { QuickView } from "@/components/site/QuickView";
import type { Product } from "@/data/products";

export const Route = createFileRoute("/product/$productId")({
  loader: ({ params }) => {
    const product = getProduct(params.productId);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    const title = p ? `${p.name} | Kalyani Ghee Sweets` : "Product | Kalyani Ghee Sweets";
    const description = p
      ? `${p.tagline}. Made fresh in 100% pure cow ghee. Visit Kalyani Ghee Sweets, Karimnagar.`
      : "Authentic Telangana sweets made in pure cow ghee.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { user, wishlist, toggleWishlist } = useStore();
  const [weight, setWeight] = useState(product.weights[0] ?? "");
  const [quick, setQuick] = useState<Product | null>(null);
  const liked = wishlist.includes(product.id);

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <nav className="flex items-center gap-1 text-xs text-brown">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>
        <ChevronRight className="size-3" />
        <span>{product.category}</span>
        <ChevronRight className="size-3" />
        <span className="text-primary">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <img
          src={product.image}
          alt={product.name}
          width={816}
          height={816}
          className="aspect-square w-full rounded-3xl object-cover shadow-[var(--shadow-lift)]"
        />

        <div>
          {product.badge && (
            <span className="rounded-full bg-primary px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-primary-foreground">
              {product.badge}
            </span>
          )}
          <h1 className="mt-3 text-3xl text-primary md:text-4xl">{product.name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{product.tagline}</p>

          <div className="mt-3 flex items-center gap-2 text-sm">
            <span className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 font-semibold text-primary">
              <Star className="size-3.5 fill-gold text-gold" />
              {product.rating}
            </span>
            <span className="text-muted-foreground">{product.reviews} reviews</span>
          </div>

          <div className="mt-5 flex items-end gap-3">
            <p className="text-3xl font-extrabold text-primary">
              ₹{priceFor(product.price, weight)}
            </p>
            {product.mrp && (
              <p className="pb-1 text-sm text-muted-foreground line-through">
                ₹{priceFor(product.mrp, weight)}
              </p>
            )}
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-brown">Weight</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.weights.map((w) => (
              <button
                key={w}
                type="button"
                aria-pressed={weight === w}
                onClick={() => setWeight(w)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  weight === w
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-brown hover:border-gold"
                }`}
              >
                {w}
              </button>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a href={`tel:${PHONE}`} className="btn-primary">
              <Phone className="size-4" /> Call {PHONE_DISPLAY}
            </a>
            {user && (
              <button
                onClick={() => toggleWishlist(product.id)}
                aria-pressed={liked}
                className="btn-outline"
              >
                <Heart className={`size-4 ${liked ? "fill-primary" : ""}`} /> Wishlist
              </button>
            )}
          </div>

          <div className="ornament my-7" />

          <dl className="space-y-3 text-sm">
            <div>
              <dt className="font-bold text-primary">Ingredients</dt>
              <dd className="text-muted-foreground">{product.ingredients}</dd>
            </div>
            <div>
              <dt className="font-bold text-primary">Shelf life</dt>
              <dd className="text-muted-foreground">
                Best consumed within 15 days of purchase. Store in a cool, dry place.
              </dd>
            </div>
          </dl>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { icon: Leaf, t: "100% Pure Ghee" },
              { icon: ShieldCheck, t: "Hygienic Packing" },
              { icon: Store, t: "Fresh at Our Store" },
            ].map((b) => (
              <div key={b.t} className="card-surface flex items-center gap-2 p-3 text-xs">
                <b.icon className="size-5 text-gold" />
                <span className="font-semibold text-primary">{b.t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <div className="flex flex-col items-center">
            <h2 className="section-title uppercase tracking-wide">You may also like</h2>
            <div className="ornament mt-3 w-40" />
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} onQuickView={setQuick} />
            ))}
          </div>
        </section>
      )}

      <QuickView product={quick} onClose={() => setQuick(null)} />
    </main>
  );
}
