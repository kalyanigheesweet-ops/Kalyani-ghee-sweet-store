import { createFileRoute } from "@tanstack/react-router";

import { PolicyPage } from "@/components/site/PolicyPage";
import privacyImage from "@/assets/privacy policy.jpeg";

export const Route = createFileRoute("/privacy-policy")({
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      intro="We value your trust and protect your personal information with care, confidentiality, and transparency."
      breadcrumb="Privacy Policy"
      image={privacyImage}
      items={[
        {
          title: "Information We Collect",
          description: "We collect personal details such as your name, phone number, email address, and other information you voluntarily provide while using our website or communicating with us.",
        },
        {
          title: "How We Use Your Information",
          description: "Your information is used to improve our website, enhance your browsing experience, and communicate with you about our products, services, and updates.",
        },
        {
          title: "Data Protection",
          description: "We follow reasonable security practices to protect your information from unauthorised access, misuse, or disclosure.",
        },
        {
          title: "Third-Party Disclosure",
          description: "We do not sell or share your personal information with third parties for marketing purposes without your consent.",
        },
      ]}
    />
  );
}
