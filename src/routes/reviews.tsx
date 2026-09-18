import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare, Star } from "lucide-react";
import { useEffect, useState } from "react";

import { getCustomerReviews, isOwnerEmail, type CustomerReview } from "@/lib/auth-security";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Customer Reviews | Kalyani Ghee Sweets" },
      { name: "description", content: "Review submissions from Kalyani Ghee Sweets customers." },
    ],
  }),
  component: ReviewsPage,
});

function ReviewsPage() {
  const { user } = useStore();
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || !isOwnerEmail(user.email)) {
      setLoading(false);
      return;
    }

    void getCustomerReviews()
      .then(setReviews)
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : "Unable to load reviews.");
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (!user || !isOwnerEmail(user.email)) {
    return (
      <main className="mx-auto flex min-h-[45vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center">
        <MessageSquare className="size-12 text-primary" />
        <h1 className="mt-4 text-3xl text-primary">Owner access required</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in with the store owner account to view customer reviews.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center gap-3">
        <MessageSquare className="size-8 text-primary" />
        <div>
          <h1 className="text-3xl text-primary">Customer Reviews</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {loading ? "Loading reviews..." : `${reviews.length} review${reviews.length === 1 ? "" : "s"} collected`}
          </p>
        </div>
      </div>

      {error && <p className="mt-6 rounded-lg bg-secondary p-4 text-sm text-primary">{error}</p>}
      {!loading && !error && reviews.length === 0 && (
        <p className="mt-8 rounded-xl border border-gold-soft bg-card p-8 text-center text-sm text-muted-foreground">
          Customer reviews will appear here after they submit them.
        </p>
      )}

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {reviews.map((review) => (
          <article key={review.id} className="flex gap-4 rounded-xl border border-gold-soft bg-card p-4 shadow-[var(--shadow-card)]">
            <img
              src={review.productImage}
              alt={review.productName}
              className="size-20 shrink-0 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-primary">{review.productName}</h2>
                  <p className="text-xs text-muted-foreground">{review.customerName} · {review.customerEmail}</p>
                </div>
                <div className="flex shrink-0 gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Star key={value} className={`size-4 ${value <= review.rating ? "fill-gold text-gold" : "text-border"}`} />
                  ))}
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{review.comment}</p>
              {review.createdAt && (
                <time className="mt-3 block text-xs text-muted-foreground" dateTime={review.createdAt}>
                  {new Date(review.createdAt).toLocaleString()}
                </time>
              )}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
