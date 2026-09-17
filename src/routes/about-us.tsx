import { createFileRoute } from "@tanstack/react-router";
import { Heart, Leaf, Soup, Sparkles } from "lucide-react";

import aboutImage from "@/assets/about us.jpg";

export const Route = createFileRoute("/about-us")({
  head: () => ({
    meta: [
      { title: "About Us | Kalyani Ghee Sweets" },
      {
        name: "description",
        content:
          "Discover traditional Telangana sweets and snacks made with care, quality ingredients, and cherished homemade recipes.",
      },
    ],
  }),
  component: AboutUsPage,
});

const values = [
  {
    icon: Leaf,
    title: "Quality Ingredients",
    description:
      "We focus on carefully selected ingredients to maintain the taste and quality of our sweets.",
  },
  {
    icon: Soup,
    title: "Traditional Taste",
    description: "Our sweets are inspired by traditional recipes and preparation methods.",
  },
  {
    icon: Heart,
    title: "Made with Care",
    description: "Every sweet represents our passion for authentic flavours and Indian traditions.",
  },
  {
    icon: Sparkles,
    title: "Celebrating Sweet Moments",
    description:
      "From festivals to family gatherings, we showcase sweets that add sweetness to every occasion.",
  },
] as const;

function AboutUsPage() {
  return (
    <main className="bg-[#fbf1df] text-[#4d241b]">
      <section className="mx-auto grid max-w-7xl overflow-hidden lg:grid-cols-[0.95fr_1.05fr]">
        <div className="flex flex-col justify-center px-5 py-14 sm:px-10 lg:px-14 lg:py-20">
          <div className="mb-4 flex items-center gap-3 text-[#a65c27]" aria-hidden="true">
            <span className="h-px w-20 bg-[#b88958]" />
            <Leaf className="size-6" strokeWidth={1.5} />
            <span className="h-px w-20 bg-[#b88958]" />
          </div>
          <h1 className="text-5xl leading-none text-[#731c12] sm:text-6xl">About Us</h1>
          <h2 className="mt-4 text-2xl text-[#731c12] sm:text-3xl">About Kalyani Ghee Sweets</h2>
          <div className="mt-5 max-w-xl space-y-4 text-base leading-7 text-[#57463e]">
            <p>
              At Kalyani Ghee Sweets, we celebrate the rich and authentic flavours of Telangana
              through a delightful selection of traditional sweets and snacks made with care and
              quality ingredients.
            </p>
            <p>
              Our collection brings together delicious ghee-based sweets, traditional Telangana
              snacks, and regional favourites, inspired by cherished homemade recipes and local
              culinary traditions.
            </p>
            <p>
              We believe food is more than just something to eat - it is a part of festivals,
              celebrations, family traditions, and special moments. Our goal is to showcase the
              authentic tastes of Telangana while preserving the traditional flavours and recipes
              that generations have enjoyed.
            </p>
          </div>
        </div>
        <div className="min-h-[360px] bg-[#ead6b7] lg:min-h-[560px]">
          <img
            src={aboutImage}
            alt="A traditional platter of Kalyani Indian sweets"
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      <section className="border-t border-[#e8cfa9] bg-[#fbf1df] px-5 py-12 sm:px-10 lg:px-14 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-center gap-3 text-[#a65c27]" aria-hidden="true">
            <span className="h-px w-12 bg-[#c99b69] sm:w-20" />
            <Leaf className="size-5" strokeWidth={1.5} />
            <span className="h-px w-12 bg-[#c99b69] sm:w-20" />
          </div>
          <h2 className="mt-2 text-center text-4xl text-[#731c12] sm:text-5xl">Our Values</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
            {values.map(({ icon: Icon, title, description }, index) => (
              <article
                key={title}
                className="text-center lg:border-r lg:border-[#e8cfa9] lg:px-7 first:lg:pl-0 last:lg:border-r-0 last:lg:pr-0"
              >
                <div className="mx-auto grid size-16 place-items-center rounded-full bg-[#f4dcae] text-[#731c12]">
                  <Icon className="size-8" strokeWidth={1.6} />
                </div>
                <h3 className="mt-4 text-xl leading-tight text-[#731c12]">{title}</h3>
                <p className="mx-auto mt-3 max-w-[230px] text-sm leading-6 text-[#66564d]">
                  {description}
                </p>
              </article>
            ))}
          </div>
          <div
            className="mt-12 flex items-center justify-center gap-3 text-[#a65c27]"
            aria-hidden="true"
          >
            <span className="h-px w-12 bg-[#c99b69] sm:w-20" />
            <Leaf className="size-5" strokeWidth={1.5} />
            <span className="h-px w-12 bg-[#c99b69] sm:w-20" />
          </div>
          <p className="mt-3 text-center font-display text-xl italic text-[#8c3321]">
            Tradition in Every Bite
          </p>
        </div>
      </section>
    </main>
  );
}
