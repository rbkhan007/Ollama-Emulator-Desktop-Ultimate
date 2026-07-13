import type { Metadata } from "next";
import { SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Admin License Manager",
  description: "Issue and manage OllamoMUI Pro licenses manually. For direct sales via WhatsApp, Bkash, Nagad, or bank transfer.",
  alternates: { canonical: `${SITE_URL}/admin` },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
