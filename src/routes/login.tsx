import { createFileRoute } from "@tanstack/react-router";
import { Login } from "@/pages/Login/Login";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login | Kalyani Ghee Sweets" },
      { name: "description", content: "Log in to your Kalyani Ghee Sweets account." },
    ],
  }),
  component: Login,
});
