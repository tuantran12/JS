import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Home - Crypto Analytics Platform",
};

export default function Home() {
  // Redirect to analytics page as the main dashboard
  redirect("/analytics");
}
