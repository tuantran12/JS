import { Metadata } from "next";
import Homepage from "./homepage/page";

export const metadata: Metadata = {
  title: "Home - SENKAI Crypto Analytics Platform",
  description: "Real-time cryptocurrency market data and analytics platform",
};

export default function Home() {
  return <Homepage />;
}
