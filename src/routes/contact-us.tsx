import { createFileRoute } from "@tanstack/react-router";

import { PolicyPage } from "@/components/site/PolicyPage";
import contactImage from "@/assets/Contact us.jpeg";
import { STORE_ADDRESS } from "@/lib/store";

export const Route = createFileRoute("/contact-us")({
  component: ContactUsPage,
});

function ContactUsPage() {
  return (
    <PolicyPage
      title="Contact Us"
      intro="We would love to hear from you! Reach out for order enquiries, custom gifting, or store support."
      breadcrumb="Contact Us"
      image={contactImage}
      items={[
        {
          title: "Phone",
          description: "+91 83419 30200 · For sweet orders, gifting, and store support.",
        },
        {
          title: "Email",
          description: "kalyanigheesweet@gmail.com · We reply to queries as quickly as possible.",
        },
        {
          title: "Address",
          description: `${STORE_ADDRESS} · Visit our store for fresh batches daily.`,
        },
        {
          title: "Business Hours",
          description: "Monday to Sunday · 9:00 AM – 9:00 PM · Fresh sweets and snacks prepared daily.",
        },
      ]}
    />
  );
}
