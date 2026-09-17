import { createFileRoute } from "@tanstack/react-router";

import { PolicyPage } from "@/components/site/PolicyPage";
import faqImage from "@/assets/return refund policy.jpeg";

export const Route = createFileRoute("/faq")({
  component: FaqPage,
});

function FaqPage() {
  return (
    <PolicyPage
      title="FAQs"
      intro="Find quick answers to common questions about our traditional sweets, ingredients, delivery, and product care."
      breadcrumb="FAQs"
      image={faqImage}
      items={[
        {
          title: "What makes Kalyani Ghee Sweets special?",
          description:
            "We use pure cow ghee, premium quality ingredients and traditional recipes passed down through generations to bring you authentic taste and unmatched richness in every bite.",
        },
        {
          title: "What type of ghee do you use in your sweets?",
          description:
            "We use 100% pure cow ghee, which gives our sweets their rich flavor, soft texture and authentic taste.",
        },
        {
          title: "Are your products fresh and hygienic?",
          description:
            "Yes, we follow strict hygiene standards and prepare our sweets in small batches to ensure freshness, quality and safety.",
        },
        {
          title: "Do you deliver to all parts of India?",
          description:
            "Yes, we deliver across India. Our sweets are carefully packed to maintain freshness and reach you in the best condition.",
        },
        {
          title: "How should I store the sweets?",
          description:
            "Keep the sweets in a cool, dry place, away from direct sunlight. Once opened, store in an airtight container and consume within the recommended time for the best taste and freshness.",
        },
      ]}
    />
  );
}
