import type { Metadata } from "next";
import { SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Payment Result",
  description: "View your license key after a successful payment, or retry a failed transaction.",
  robots: { index: false, follow: false },
  alternates: { canonical: `${SITE_URL}/payment-result` },
};

export default function PaymentResultLayout({ children }: { children: React.ReactNode }) {
  return children;
}
