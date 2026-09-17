import { Instagram, Phone, Mail, MapPin } from "lucide-react";
import logo from "@/assets/kalyani-logo.svg";
import {
  EMAIL,
  INSTAGRAM_URL,
  PHONE,
  PHONE_DISPLAY,
  STORE_ADDRESS,
  STORE_MAP_URL,
} from "@/lib/store";

const shopCategories = [
  "Sweets",
  "Laddu's",
  "Pickles",
  "Snacks",
  "Namkeens",
] as const;

const columns = [
  {
    title: "Shop",
    links: shopCategories.map((label) => ({
      label,
      href: `/category/${encodeURIComponent(label)}`,
    })),
  },
  {
    title: "Support",
    links: [
      { label: "About Us", href: "/about-us" },
      { label: "Contact Us", href: "/contact-us" },
      { label: "FAQs", href: "/faq" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms-and-conditions" },
    ],
  },
];

export function Footer() {
  return (
    <footer id="stores" className="mt-20 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-x-12 gap-y-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-[1.5fr_0.9fr_0.9fr]">
        <div>
          <img
            src={logo}
            alt="Kalyani Ghee Sweets"
            width={200}
            height={124}
            className="h-16 w-auto rounded-xl bg-ivory p-1"
          />
          <p className="mt-4 max-w-sm text-sm opacity-85">
            Authentic Telangana sweets, pickles and snacks prepared in pure buffalo ghee using
            traditional family recipes.
          </p>
          <div className="mt-5 space-y-2 text-sm opacity-90">
            <a href={`tel:${PHONE}`} className="flex items-center gap-2 hover:text-accent">
              <Phone className="size-4 text-accent" /> {PHONE_DISPLAY}
            </a>
            <a href={`mailto:${EMAIL}`} className="flex items-center gap-2 hover:text-accent">
              <Mail className="size-4 text-accent" /> {EMAIL}
            </a>
            <a
              href={STORE_MAP_URL}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-2 hover:text-accent"
            >
              <MapPin className="mt-0.5 size-4 shrink-0 text-accent" /> {STORE_ADDRESS}
            </a>
          </div>
          <div className="mt-5 flex gap-3">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="grid size-10 place-items-center rounded-full border border-primary-foreground/30 transition hover:bg-gold hover:text-accent-foreground"
            >
              <Instagram className="size-4" />
            </a>
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title} className="lg:justify-self-center">
            <h4 className="text-lg text-accent">{col.title}</h4>
            <ul className="mt-4 space-y-2 text-sm opacity-85">
              {col.links.map((link) => {
                const label = typeof link === "string" ? link : link.label;
                const href = typeof link === "string" ? "#shop" : link.href;
                const isExternalCategoryLink = col.title === "Shop" && typeof link !== "string";

                return (
                  <li key={label}>
                    <a
                      href={href}
                      target={isExternalCategoryLink ? "_blank" : undefined}
                      rel={isExternalCategoryLink ? "noreferrer" : undefined}
                      className="transition hover:text-accent"
                    >
                      {label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-primary-foreground/15">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs opacity-75 md:flex-row">
          <p>© {new Date().getFullYear()} Kalyani Ghee Sweets. All rights reserved.</p>
          <p>తెలంగాణ పిండి వంటలు • Made with pure ghee &amp; love</p>
        </div>
      </div>
    </footer>
  );
}
