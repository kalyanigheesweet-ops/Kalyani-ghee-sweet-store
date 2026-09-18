import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Phone, Star, X } from "lucide-react";
import type { Product } from "@/data/products";
import { PHONE, PHONE_DISPLAY, priceFor } from "@/lib/store";

export function QuickView({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const [weight, setWeight] = useState(product?.weights[0] ?? "");

  useEffect(() => {
    if (product) setWeight(product.weights[0] ?? "");
  }, [product]);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-primary/50" onClick={onClose} />
      <div className="relative z-10 max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-background p-5 shadow-[var(--shadow-lift)] sm:rounded-3xl sm:p-7">
        <button
          onClick={onClose}
          aria-label="Close quick view"
          className="absolute right-4 top-4 grid size-9 place-items-center rounded-full text-primary hover:bg-secondary"
        >
          <X className="size-5" />
        </button>
        <div className="grid gap-6 sm:grid-cols-2">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            width={816}
            height={816}
            className="aspect-square w-full rounded-2xl object-cover"
          />
          <div className="flex flex-col">
            <p className="eyebrow">{product.category}</p>
            <h3 className="mt-1 text-2xl text-primary">{product.name}</h3>
            <p className="mt-1 flex items-center gap-1 text-sm text-brown">
              <Star className="size-4 text-gold" /> {product.reviews} reviews
            </p>
            <p className="mt-3 text-sm text-muted-foreground">{product.tagline}</p>
            <p className="mt-3 text-xs text-muted-foreground">
              <span className="font-semibold text-brown">Ingredients: </span>
              {product.ingredients}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {product.weights.map((w) => (
                <button
                  key={w}
                  type="button"
                  aria-pressed={weight === w}
                  onClick={() => setWeight(w)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    weight === w
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-brown hover:border-gold"
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>

            <p className="mt-4 text-2xl font-extrabold text-primary">
              ₹{priceFor(product.price, weight)}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <a href={`tel:${PHONE}`} className="btn-primary">
                <Phone className="size-4" /> Call {PHONE_DISPLAY}
              </a>
              <Link
                to="/product/$productId"
                params={{ productId: product.id }}
                className="btn-outline"
                onClick={onClose}
              >
                Full Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
