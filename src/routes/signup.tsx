import { createFileRoute } from "@tanstack/react-router";
import { Signup } from "@/pages/Signup/Signup";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign Up | Kalyani Ghee Sweets" },
      { name: "description", content: "Create your Kalyani Ghee Sweets account." },
    ],
  }),
  component: Signup,
});
