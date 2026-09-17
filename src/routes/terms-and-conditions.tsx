import { createFileRoute } from "@tanstack/react-router";

import { PolicyPage } from "@/components/site/PolicyPage";
import termsImage from "@/assets/Terms and conditions.jpeg";

export const Route = createFileRoute("/terms-and-conditions")({
  component: TermsAndConditionsPage,
});

function TermsAndConditionsPage() {
  return (
    <PolicyPage
      title="Terms & Conditions"
      intro="Please read these terms carefully before using our website and services."
      breadcrumb="Terms & Conditions"
      image={termsImage}
      items={[
        {
          title: "General",
          description: "By using our website, you agree to be bound by these terms and conditions and acknowledge our policies.",
        },
        {
          title: "Product Information",
          description: "We make every effort to provide accurate product descriptions, pricing, and ingredient details, though product availability may vary.",
        },
        {
          title: "Data & Privacy",
          description: "We collect and use your personal information in accordance with our privacy policy. We take reasonable measures to protect your data and keep it secure.",
        },
        {
          title: "Website Usage",
          description: "You agree to use our website for lawful purposes only and not to engage in any activity that may harm, disrupt, or interfere with its normal operation.",
        },
      ]}
    />
  );
}
