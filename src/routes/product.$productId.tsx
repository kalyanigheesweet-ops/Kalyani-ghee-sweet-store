import { Link, createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronRight, Heart, Leaf, Phone, ShieldCheck, Star, Store } from "lucide-react";
import { getProduct, products } from "@/data/products";
import { saveCustomerReview } from "@/lib/auth-security";
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
  const navigate = useNavigate();
  const { user, authReady, wishlist, toggleWishlist } = useStore();
  const [weight, setWeight] = useState(product.weights[0] ?? "");
  const [quick, setQuick] = useState<Product | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSaving, setReviewSaving] = useState(false);
  const [reviewStorageNotice, setReviewStorageNotice] = useState("");
  const [submittedReview, setSubmittedReview] = useState<{
    rating: number;
    comment: string;
  } | null>(null);
  const liked = wishlist.includes(product.id);

  useEffect(() => {
    const savedReview = window.localStorage.getItem(`kalyani.review.${product.id}`);
    if (!savedReview) return;

    try {
      const review = JSON.parse(savedReview) as { rating?: unknown; comment?: unknown };
      if (typeof review.rating !== "number" || typeof review.comment !== "string") return;
      setReviewRating(review.rating);
      setReviewComment(review.comment);
      setSubmittedReview({ rating: review.rating, comment: review.comment });
      setReviewSubmitted(true);
      setReviewStorageNotice("Review saved on this device.");
    } catch {
      window.localStorage.removeItem(`kalyani.review.${product.id}`);
    }
  }, [product.id]);

  useEffect(() => {
    if (authReady && !user) {
      void navigate({ to: "/login" });
    }
  }, [authReady, navigate, user]);

  if (!authReady || !user) return null;

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
            <button
              type="button"
              aria-expanded={reviewOpen}
              aria-controls="product-review-form"
              title="Click to rate this product"
              aria-label={`Rate ${product.name}`}
              onClick={() => setReviewOpen((open) => !open)}
              className="flex cursor-pointer items-center gap-1 rounded-full bg-secondary px-2.5 py-1 font-semibold text-primary transition hover:bg-gold/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <Star className="size-3.5 text-gold" />
            </button>
            <span className="text-muted-foreground">{product.reviews} reviews</span>
            <button
              type="button"
              onClick={() => setReviewOpen(true)}
              className="cursor-pointer text-xs font-bold text-primary underline decoration-gold underline-offset-2 hover:text-brown"
            >
              Write a review
            </button>
          </div>
          {reviewSubmitted && !reviewOpen && (
            <p className="mt-2 text-xs font-semibold text-primary">Review submitted successfully.</p>
          )}

          {reviewOpen && (
            <form
              id="product-review-form"
              className="mt-4 max-w-lg rounded-xl border border-gold-soft bg-card p-4"
              onSubmit={async (event) => {
                event.preventDefault();
                const comment = reviewComment.trim();
                if (!reviewRating) {
                  setReviewError("Choose a star rating first.");
                  return;
                }
                if (!comment) {
                  setReviewError("Write a comment before submitting.");
                  return;
                }
                const review = { rating: reviewRating, comment };
                const reviewKey = `kalyani.review.${product.id}`;
                setReviewSaving(true);
                window.localStorage.setItem(reviewKey, JSON.stringify(review));
                setSubmittedReview(review);
                setReviewError("");
                setReviewStorageNotice("Review saved on this device.");
                setReviewSubmitted(true);
                setReviewOpen(false);
                setReviewSaving(false);

                void saveCustomerReview({
                  ...review,
                  productId: product.id,
                  productName: product.name,
                  productImage: product.image,
                  customerName: user.name,
                  customerEmail: user.email,
                })
                  .then(() => setReviewStorageNotice("Review submitted for the store owner."))
                  .catch(() =>
                    setReviewStorageNotice(
                      "Saved on this device. Cloud sync is unavailable, so the store owner cannot see it yet.",
                    ),
                  );
              }}
            >
              <p className="text-sm font-bold text-primary">Write a review</p>
              <div className="mt-2 flex items-center gap-1" aria-label="Choose a rating">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-label={`Give ${value} star${value === 1 ? "" : "s"}`}
                    aria-pressed={reviewRating === value}
                    onClick={() => {
                      setReviewRating(value);
                      setReviewError("");
                    }}
                    className="rounded-full p-1 text-muted-foreground transition hover:bg-secondary hover:text-gold"
                  >
                    <Star
                      className={`size-5 ${value <= reviewRating ? "fill-gold text-gold" : ""}`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={reviewComment}
                onChange={(event) => {
                  setReviewComment(event.target.value);
                  setReviewSubmitted(false);
                  setReviewError("");
                  setReviewStorageNotice("");
                }}
                placeholder="Share your experience"
                aria-label="Your review"
                maxLength={500}
                rows={3}
                className="mt-2 w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-gold"
              />
              {reviewError && <p className="mt-2 text-xs font-semibold text-primary">{reviewError}</p>}
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">
                  {reviewSubmitted ? reviewStorageNotice : ""}
                </span>
                <button type="submit" disabled={reviewSaving} className="btn-primary px-4 py-2 text-xs">
                  {reviewSaving ? "Saving..." : "Submit review"}
                </button>
              </div>
              {submittedReview && (
                <div className="mt-4 flex gap-3 rounded-lg bg-secondary/60 p-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="size-16 shrink-0 rounded-md object-cover"
                  />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">
                      Added for Google Maps
                    </p>
                    <div className="mt-1 flex gap-1">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <Star
                          key={value}
                          className={`size-4 ${value <= submittedReview.rating ? "fill-gold text-gold" : "text-border"}`}
                        />
                      ))}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{submittedReview.comment}</p>
                  </div>
                </div>
              )}
            </form>
          )}

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
