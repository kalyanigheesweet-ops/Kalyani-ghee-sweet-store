import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, Heart, Phone, Star } from "lucide-react";
import type { Product } from "@/data/products";
import { PHONE, priceFor, useStore } from "@/lib/store";

export function ProductCard({
  product,
  onQuickView,
}: {
  product: Product;
  onQuickView: (p: Product) => void;
}) {
  const { user, wishlist, toggleWishlist } = useStore();
  const [selectedWeight, setSelectedWeight] = useState(product.weights[0] ?? "");
  const liked = wishlist.includes(product.id);

  return (
    <article className="group card-surface relative flex max-w-[240px] flex-col overflow-hidden transition duration-300 hover:shadow-[var(--shadow-lift)] sm:max-w-none">
      <div className="relative overflow-hidden">
        <Link to="/product/$productId" params={{ productId: product.id }}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={640}
            height={640}
            className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        </Link>
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-primary-foreground">
            {product.badge}
          </span>
        )}
        {user && (
          <button
            onClick={() => toggleWishlist(product.id)}
            aria-label={liked ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
            aria-pressed={liked}
            className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-card/90 text-primary transition hover:bg-card"
          >
            <Heart className={`size-4 ${liked ? "fill-primary" : ""}`} />
          </button>
        )}
        <button
          type="button"
          aria-label={`Quick view ${product.name}`}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onQuickView(product);
          }}
          className="pointer-events-auto absolute inset-x-3 bottom-3 z-10 flex cursor-pointer items-center justify-center gap-2 rounded-full bg-card/95 py-2 text-xs font-bold uppercase tracking-widest text-primary opacity-100 transition-all duration-300 sm:translate-y-14 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:group-focus-within:translate-y-0 sm:group-focus-within:opacity-100"
        >
          <Eye className="size-4" /> Quick View
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[0.86rem] leading-snug text-primary md:text-[0.9rem]">
            <Link to="/product/$productId" params={{ productId: product.id }}>
              {product.name}
            </Link>
          </h3>
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-primary">
            <Star className="size-3 fill-gold text-gold" />
            {product.rating}
          </span>
        </div>
        <p className="line-clamp-2 text-[10px] text-muted-foreground">{product.tagline}</p>

        <div className="flex flex-wrap gap-1 pt-0.5">
          <span className="rounded-full border border-primary/20 bg-primary/5 px-1.5 py-0.5 text-[0.62rem] font-semibold text-primary">
            {product.category}
          </span>
          {product.weights.slice(0, 2).map((w) => (
            <button
              key={w}
              type="button"
              aria-pressed={selectedWeight === w}
              onClick={() => setSelectedWeight(w)}
              className={`rounded-full border px-1.5 py-0.5 text-[0.62rem] font-semibold transition ${
                selectedWeight === w
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-secondary/70 text-brown hover:border-gold"
              }`}
            >
              {w}
            </button>
          ))}
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <div>
            <p className="text-base font-extrabold text-primary md:text-[1.05rem]">
              ₹{priceFor(product.price, selectedWeight)}
            </p>
            {product.mrp && (
              <p className="text-[9px] text-muted-foreground line-through">
                ₹{priceFor(product.mrp, selectedWeight)}
              </p>
            )}
          </div>
          <a href={`tel:${PHONE}`} className="btn-gold px-2.5 py-1.5 text-[10px]">
            <Phone className="size-4" /> Enquire
          </a>
        </div>
      </div>
    </article>
  );
}
