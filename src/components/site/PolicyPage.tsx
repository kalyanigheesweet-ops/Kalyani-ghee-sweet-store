import { Link } from "@tanstack/react-router";
import { ChevronRight, Mail, MapPin, Menu, Phone, Search, ShieldCheck, ShoppingCart } from "lucide-react";

import logo from "@/assets/kalyani-logo.svg";

type PolicyItem = {
  title: string;
  description: string;
};

type PolicyPageProps = {
  title: string;
  intro: string;
  breadcrumb: string;
  image: string;
  items: PolicyItem[];
};

export function PolicyPage({ title, intro, breadcrumb, image, items }: PolicyPageProps) {
  return (
    <main className="mx-auto max-w-[1280px] px-3 py-5 md:px-4 lg:px-6">
      <div className="overflow-hidden rounded-[2rem] border border-[#d0b082] bg-[#f8efe5] shadow-[0_14px_38px_-18px_rgba(67,24,17,0.35)]">
        <header className="bg-[#7a0d0d] text-[#f8ead9]">
          <div className="mx-auto flex h-[68px] max-w-[1200px] items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-3">
              <button aria-label="Open menu" className="grid size-10 place-items-center rounded-full border border-white/20 text-[#f8ead9] transition hover:bg-white/5">
                <Menu className="size-5" strokeWidth={1.8} />
              </button>

              <Link to="/" className="flex items-center gap-3">
                <img src={logo} alt="Kalyani Ghee Sweets" className="h-11 w-11 rounded-full border border-[#f4d18f] bg-[#fef9f0] p-1 object-contain" />
                <div className="leading-none">
                  <div className="text-[1.4rem] font-black tracking-tight text-[#f5d68e]">Kalyani</div>
                  <div className="mt-1 text-[0.5rem] font-bold tracking-[0.22em] text-[#fce7cc]">GHEE SWEETS</div>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <button aria-label="Search" className="grid size-10 place-items-center rounded-full border border-white/20 text-[#f8ead9] transition hover:bg-white/5">
                <Search className="size-4" strokeWidth={1.8} />
              </button>
              <button aria-label="Cart" className="grid size-10 place-items-center rounded-full border border-white/20 text-[#f8ead9] transition hover:bg-white/5">
                <ShoppingCart className="size-4" strokeWidth={1.8} />
              </button>
              <button aria-label="Menu" className="grid size-10 place-items-center rounded-full border border-white/20 text-[#f8ead9] transition hover:bg-white/5 md:hidden">
                <Menu className="size-5" strokeWidth={1.8} />
              </button>
            </div>
          </div>
        </header>

        <div className="px-4 pb-5 pt-4 md:px-6 md:pb-8">
          <nav className="flex flex-wrap items-center gap-1.5 text-[0.68rem] font-medium uppercase tracking-[0.12em] text-[#6f4439] md:text-[0.72rem]">
            <Link to="/" className="transition hover:text-[#7a0d0d]">Home</Link>
            <ChevronRight className="size-3" />
            <span>Customer Service</span>
            <ChevronRight className="size-3" />
            <span className="text-[#7a0d0d]">{breadcrumb}</span>
          </nav>

          <div className="mt-5 grid gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
            <div className="rounded-[1.75rem] border border-[#d7c5a8] bg-[#f4e9d9] p-5 md:p-7">
              <h1 className="text-3xl font-black tracking-tight text-[#4d1a13] md:text-[2.4rem]">
                {title}
              </h1>
              <p className="mt-3 max-w-xl text-sm text-[#6c4a3c] md:text-base">{intro}</p>

              <div className="mt-6 space-y-4">
                {items.map((item, index) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 rounded-[1.2rem] border border-[#d7c5a8] bg-[#f8f0e6] p-3 md:p-4"
                  >
                    <div className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-[#f2d79b] text-[#5d1c15]">
                      {index === 0 ? <Phone className="size-4" strokeWidth={2.2} /> : index === 1 ? <Mail className="size-4" strokeWidth={2.2} /> : index === 2 ? <MapPin className="size-4" strokeWidth={2.2} /> : <ShieldCheck className="size-4" strokeWidth={2.2} />}
                    </div>
                    <div>
                      <h2 className="text-[0.72rem] font-black uppercase tracking-[0.18em] text-[#7a0d0d]">
                        {item.title}
                      </h2>
                      <p className="mt-1 text-sm leading-relaxed text-[#4f3d35] md:text-[0.96rem]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center lg:justify-end">
              <div className="overflow-hidden rounded-[1.7rem] border border-[#d7c5a8] bg-[#f0e0c0] p-2 shadow-[0_20px_36px_-18px_rgba(68,32,17,0.4)]">
                <img src={image} alt={title} className="h-[420px] w-full rounded-[1.3rem] object-cover md:h-[470px] lg:h-[560px]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
