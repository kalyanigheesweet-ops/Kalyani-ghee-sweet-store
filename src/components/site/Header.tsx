import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  BookOpen,
  CookingPot,
  Heart,
  Instagram,
  Map,
  MapPin,
  Menu,
  Search,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import logo from "@/assets/kalyani-logo.svg";
import { categories, products, type Product } from "@/data/products";
import { INSTAGRAM_URL, STORE_MAP_URL, useStore } from "@/lib/store";

const navItems = [
  "Home",
  "Sweets",
  "Laddu's",
  "Pickles",
  "Non-Veg Pickles",
  "Snacks",
  "Namkeens",
  "Powders",
  "Papads",
  "About Us",
] as const;

export function Header() {
  const { wishlist, user, signOut } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const searchResults = searchQuery.trim()
    ? products.filter((product) => {
        const query = searchQuery.trim().toLowerCase();
        return [product.name, product.category].some((value) =>
          value.toLowerCase().includes(query),
        );
      })
    : [];

  const goToHome = () => {
    setMobileOpen(false);
    if (typeof document === "undefined") return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-40 shadow-[var(--shadow-card)]">
      <div className="bg-[#7a0d0d] text-primary-foreground">
        <div className="mx-auto flex h-8 w-full max-w-[1600px] items-center justify-between gap-3 px-2">
          <div className="hidden flex-1 items-center justify-start gap-5 pl-10 text-xs font-medium sm:flex">
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <CookingPot className="size-4" strokeWidth={1.7} />
              Pure Ghee
            </span>
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <BookOpen className="size-4" strokeWidth={1.7} />
              Traditional Recipes
            </span>
            <span className="flex items-center gap-1.5 whitespace-nowrap">
              <ShieldCheck className="size-4" strokeWidth={1.7} />
              Hygienically Prepared
            </span>
          </div>
          <div className="ml-auto mr-1 flex items-center justify-end pr-1">
            {user ? (
              <button
                className="flex h-8 items-center gap-2 bg-primary px-5 text-sm text-primary-foreground transition hover:bg-primary/90"
                type="button"
                onClick={signOut}
                title={`Sign out ${user.name}`}
              >
                <User className="size-5" strokeWidth={1.5} />
                <span>Sign Out</span>
              </button>
            ) : (
              <Link
                className="flex h-8 items-center gap-2 bg-primary px-5 text-sm text-primary-foreground transition hover:bg-primary/90"
                to="/login"
              >
                <User className="size-5" strokeWidth={1.5} />
                <span>Login / Sign Up</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="border-b border-gold-soft bg-white">
        <div className="mx-auto flex min-h-[112px] max-w-7xl items-center gap-8 px-4 py-2">
          <Link to="/" className="w-[220px] shrink-0 lg:flex-1">
            <span className="block overflow-hidden bg-white">
              <img
                src={logo}
                alt="Kalyani Ghee Sweets"
                className="h-[96px] w-full object-contain"
              />
            </span>
          </Link>

          <form
            className="relative hidden flex-[2] md:block"
            onSubmit={(event) => event.preventDefault()}
            role="search"
          >
            <label className="sr-only" htmlFor="site-search">
              Search products
            </label>
            <input
              id="site-search"
              placeholder="Search for sweets, pickles, snacks..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="h-11 w-full rounded-lg border border-border bg-white pl-12 pr-14 text-sm outline-none transition focus:border-gold"
            />
            <Search className="absolute left-4 top-3 size-5 text-muted-foreground" />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-0 top-0 grid h-11 w-12 place-items-center rounded-r-lg bg-primary text-primary-foreground transition hover:bg-primary/90"
            >
              <Search className="size-5" />
            </button>
            {searchResults.length > 0 && (
              <SearchResults results={searchResults} onSelect={() => setSearchQuery("")} />
            )}
          </form>

          <div className="flex flex-1 items-center justify-end md:gap-2">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="hidden flex-col items-center gap-1 px-5 text-foreground transition hover:text-brown lg:flex"
            >
              <Instagram className="size-8 text-instagram" strokeWidth={2.2} />
              <span className="text-base font-semibold text-foreground">Instagram</span>
            </a>
            <a
              href={STORE_MAP_URL}
              target="_blank"
              rel="noreferrer"
              className="hidden flex-col items-center gap-1 px-5 text-foreground transition hover:text-brown lg:flex"
            >
              <span className="relative grid size-8 place-items-center">
                <Map className="absolute size-8 text-map" strokeWidth={1.8} />
                <MapPin
                  className="relative size-6 -translate-y-0.5 text-pin"
                  fill="currentColor"
                  strokeWidth={1.5}
                />
              </span>
              <span className="text-base font-semibold text-foreground">Store Locator</span>
            </a>
            {user && (
              <Link
                to="/wishlist"
                className="relative hidden items-center gap-2 px-3 text-primary transition hover:text-brown lg:flex"
                aria-label="Wishlist"
              >
                <Heart className="size-7" />
                <span className="text-base font-semibold">Wishlist</span>
                {wishlist.length > 0 && (
                  <span className="grid size-5 place-items-center rounded-full bg-gold text-[0.65rem] font-bold text-accent-foreground">
                    {wishlist.length}
                  </span>
                )}
              </Link>
            )}
            {user && (
              <Link
                to="/wishlist"
                className="relative grid size-10 place-items-center rounded-full text-primary transition hover:bg-secondary lg:hidden"
                aria-label="Wishlist"
              >
                <Heart className="size-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full bg-gold text-[0.65rem] font-bold text-accent-foreground">
                    {wishlist.length}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setMobileOpen((value) => !value)}
              className="grid size-10 place-items-center rounded-full text-primary transition hover:bg-secondary lg:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        <nav className="hidden bg-primary lg:block">
          <ul className="mx-auto flex h-9 w-full items-stretch">
            {navItems.map((item) => (
              <li key={item} className="flex-1 min-w-0">
                <a
                  href={
                    item === "Home"
                      ? "/"
                      : item === "About Us"
                        ? "/about-us"
                      : item === "Offers"
                        ? "#offers"
                        : `/category/${encodeURIComponent(item)}`
                  }
                  className="flex h-full w-full items-center justify-center whitespace-nowrap px-2 text-center text-[0.72rem] font-bold uppercase tracking-[0.06em] text-primary-foreground transition hover:text-accent"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {mobileOpen && (
          <div className="border-t border-border bg-card px-4 py-4 lg:hidden">
            <form className="relative mb-3" onSubmit={(event) => event.preventDefault()}>
              <input
                placeholder="Search sweets, pickles, snacks..."
                aria-label="Search products"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="h-11 w-full rounded-full border border-border bg-background pl-4 pr-11 text-sm outline-none focus:border-gold"
              />
              <Search className="absolute right-4 top-3.5 size-4 text-brown" />
              {searchResults.length > 0 && (
                <SearchResults results={searchResults} onSelect={() => setSearchQuery("")} />
              )}
            </form>
            <div className="mb-3 rounded-lg bg-primary p-3 text-primary-foreground">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground/80">
                Shop
              </p>
            </div>
            <ul className="grid grid-cols-2 gap-1">
              {navItems.map((item) => (
                <li key={item}>
                  <a
                    href={
                      item === "Home"
                        ? "/"
                        : item === "About Us"
                          ? "/about-us"
                          : item === "Offers"
                            ? "#offers"
                            : `/category/${encodeURIComponent(item)}`
                    }
                    onClick={() => setMobileOpen(false)}
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-primary hover:bg-secondary"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}

function SearchResults({ results, onSelect }: { results: Product[]; onSelect: () => void }) {
  return (
    <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-lg border border-border bg-card p-2 shadow-[var(--shadow-lift)]">
      {results.map((product) => (
        <Link
          key={product.id}
          to="/product/$productId"
          params={{ productId: product.id }}
          onClick={onSelect}
          className="flex min-h-16 items-center gap-3 rounded-md px-3 py-2 text-left transition hover:bg-secondary"
        >
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-primary">
              {product.name}
            </span>
            <span className="mt-0.5 block text-xs text-muted-foreground">{product.category}</span>
          </span>
          <img
            src={product.image}
            alt=""
            loading="lazy"
            className="size-12 shrink-0 rounded-md object-cover"
          />
        </Link>
      ))}
    </div>
  );
}
