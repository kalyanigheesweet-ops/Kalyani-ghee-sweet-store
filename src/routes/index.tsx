import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronRight, Gift, Leaf, MapPin, ShieldCheck, Soup, Star, Phone } from "lucide-react";
import heroImg from "@/assets/Kalyani background.png";
import storyImg from "@/assets/ghee-story.jpg";
import { ProductCard } from "@/components/site/ProductCard";
import { QuickView } from "@/components/site/QuickView";
import { PHONE, PHONE_DISPLAY, STORE_ADDRESS, STORE_MAP_URL } from "@/lib/store";
import { categoryImages, products, type Product } from "@/data/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kalyani Ghee Sweets | Authentic Telangana Pure Ghee Sweets" },
      {
        name: "description",
        content:
          "Shop authentic Telangana sweets, laddus, pickles, snacks and namkeens made fresh in 100% pure cow ghee. No dalda, no vanaspati. Hygienically prepared and freshly packed at our Karimnagar store.",
      },
      { property: "og:title", content: "Kalyani Ghee Sweets | Pure Ghee, Perfect Love" },
      {
        property: "og:description",
        content:
          "Traditional Telangana sweets, laddus, pickles and snacks made with 100% pure cow ghee.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const usps = [
  { icon: Leaf, title: "100% Pure Ghee", sub: "No Dalda | No Vanaspati" },
  { icon: Soup, title: "Traditional Recipes", sub: "From Generations" },
  { icon: ShieldCheck, title: "Freshly Made", sub: "With Love" },
  { icon: Gift, title: "Hygienic Packaging", sub: "Safe & Secure" },
  { icon: MapPin, title: "Store Locator", sub: "Find Us Near You" },
];

const reviews = [
  {
    name: "Sravani R.",
    city: "Hyderabad",
    text: "The Kalyani special laddu tastes exactly like my grandmother's. Pure ghee aroma in every bite.",
  },
  {
    name: "Mahesh K.",
    city: "Warangal",
    text: "Picked up a gift box for Diwali. Packing was beautiful and everything was perfectly fresh.",
  },
  {
    name: "Anita P.",
    city: "Karimnagar",
    text: "Their avakaya pickle is the real Telangana taste. We visit every season without fail.",
  },
];

function Index() {
  const [quick, setQuick] = useState<Product | null>(null);
  const bestSellers = products
    .filter((p) => p.badge === "Best Seller")
    .reduce<Product[]>((selected, product) => {
      if (
        selected.length >= 10 ||
        selected.some((selectedProduct) => selectedProduct.category === product.category)
      ) {
        return selected;
      }
      return [...selected, product];
    }, []);

  return (
    <main id="top">
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[#f4e8d0]">
        <img
          src={heroImg}
          alt="Traditional Telangana sweets and snacks"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="relative z-10 mx-auto flex min-h-[190px] max-w-[1200px] items-center px-5 py-4 md:px-12 md:py-5">
          <div className="max-w-[280px] text-[#4d160f] md:max-w-[320px]">
            <p className="font-[family-name:var(--font-display)] text-[0.65rem] font-bold uppercase tracking-[0.12em] md:text-xs">
              Authentic Telangana
            </p>
            <h1 className="mt-1 font-[family-name:var(--font-display)] text-[2rem] font-black uppercase leading-[0.92] tracking-[0.01em] md:text-[2.7rem]">
              Pure Ghee
            </h1>
            <p className="mt-1 font-[family-name:var(--font-display)] text-[1.15rem] font-bold uppercase leading-none tracking-[0.02em] md:text-[1.7rem]">
              Perfect Love
            </p>
            <div className="my-2 flex w-28 items-center gap-2 text-[#5d1b12] md:w-32">
              <span className="h-px flex-1 bg-[#5d1b12]/70" />
              <span className="text-xs">✦</span>
              <span className="h-px flex-1 bg-[#5d1b12]/70" />
            </div>
            <p className="max-w-[200px] text-xs leading-snug text-[#32150f] md:text-sm">
              Traditional recipes made
              <br />
              with love &amp; pure ghee
            </p>
            <a
              href="#shop"
              className="mt-3 inline-flex items-center gap-2 rounded-md bg-[#700f1a] px-3 py-2 text-[0.6rem] font-bold uppercase tracking-[0.08em] text-[#fff4df] shadow-[0_6px_14px_rgba(91,22,13,0.2)] transition hover:bg-[#560b13]"
            >
              Explore Our Sweets <ChevronRight className="size-3.5" />
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-[#d6c4a5] bg-[#f4e8d0]">
        <div className="mx-auto grid max-w-[1040px] grid-cols-2 gap-3 px-6 py-3 sm:grid-cols-3 lg:grid-cols-5">
          {usps.map((u) => (
            <div key={u.title} className="flex items-center gap-2 px-2 py-1">
              <u.icon className="size-7 shrink-0 text-[#5b170d]" strokeWidth={1.3} />
              <div>
                <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.1em] text-[#5b170d]">
                  {u.title}
                </p>
                <p className="text-xs text-[#5b170d]/80">{u.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section id="shop" className="mx-auto max-w-[1040px] scroll-mt-28 px-4 py-3 md:py-4">
        <div className="flex flex-col items-center">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-bold uppercase tracking-wide text-primary md:text-xl">
            Shop by Category
          </h2>
          <div className="ornament mt-2 w-32" />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-7 lg:gap-4">
          {categoryImages.map((c) => (
            <a
              key={c.category}
              href={`/category/${encodeURIComponent(c.category)}`}
              className="group flex flex-col items-center gap-3"
            >
              <span className="grid size-16 place-items-center overflow-hidden rounded-full border border-gold-soft bg-ivory p-1.5 shadow-[var(--shadow-card)] transition group-hover:shadow-[var(--shadow-gold)] md:size-20">
                <img
                  src={c.image}
                  alt={c.category}
                  loading="lazy"
                  className="size-full rounded-full object-cover transition duration-500 group-hover:scale-105"
                />
              </span>
              <span className="text-[10px] font-bold text-primary md:text-xs">{c.category}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Best sellers */}
      <section className="bg-cream/70 py-7">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col items-center">
            <h2 className="section-title uppercase tracking-wide">Best Sellers</h2>
            <div className="ornament mt-3 w-40" />
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {bestSellers.map((p) => (
              <ProductCard key={p.id} product={p} onQuickView={setQuick} />
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto grid max-w-7xl items-center gap-6 px-4 py-10 lg:grid-cols-2 lg:py-12">
        <img
          src={storyImg}
          alt="Pure cow ghee being poured while preparing traditional sweets"
          loading="lazy"
          className="aspect-[4/3] w-full rounded-2xl object-cover shadow-[var(--shadow-lift)]"
        />
        <div>
          <p className="eyebrow">Our Story</p>
          <h2 className="section-title mt-2">Made the way it was always made</h2>
          <div className="ornament my-3 w-32" />
          <p className="text-sm leading-relaxed text-muted-foreground">
            For three generations, Kalyani Ghee Sweets has been slow-roasting besan, pounding fresh
            spices and setting sweets by hand in small batches. We use only pure cow ghee — never
            dalda, never vanaspati — so every laddu carries the aroma of a Telangana kitchen.
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {[
              "Small-batch, made fresh daily",
              "Hand-picked nuts & spices",
              "Hygienic, food-grade packing",
              "Fresh every morning",
            ].map((t) => (
              <li key={t} className="flex items-center gap-2 text-sm text-primary">
                <ShieldCheck className="size-4 text-gold" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-cream/70 py-8">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col items-center">
            <h2 className="section-title uppercase tracking-wide">Loved by Families</h2>
            <div className="ornament mt-2 w-32" />
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {reviews.map((r) => (
              <figure key={r.name} className="card-surface p-4">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-gold text-gold" />
                  ))}
                </div>
                <blockquote className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  “{r.text}”
                </blockquote>
                <figcaption className="mt-4 text-sm font-bold text-primary">
                  {r.name} <span className="font-normal text-brown">· {r.city}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Visit strip */}
      <section className="mx-auto max-w-7xl px-4 pb-3">
        <div className="card-surface flex flex-col items-center justify-between gap-3 p-4 text-center md:flex-row md:text-left">
          <div className="flex items-center gap-3">
            <Phone className="size-8 text-gold" strokeWidth={1.4} />
            <div>
              <p className="font-bold text-primary">Enquiries & bulk requirements</p>
              <a
                href={STORE_MAP_URL}
                target="_blank"
                rel="noreferrer"
                className="block text-xs text-muted-foreground transition hover:text-primary"
              >
                {STORE_ADDRESS} · Open 8 AM – 9 PM daily
              </a>
            </div>
          </div>
          <a href={`tel:${PHONE}`} className="btn-outline">
            Call {PHONE_DISPLAY}
          </a>
        </div>
      </section>

      <QuickView product={quick} onClose={() => setQuick(null)} />
    </main>
  );
}
