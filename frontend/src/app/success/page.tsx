import Link from "next/link";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Payment Successful",
  description: "Your payment was successful. Welcome to OllamoMUI Pro!",
  robots: { index: false },
  alternates: { canonical: `${SITE_URL}/success` },
};

export default function SuccessPage() {
  return (
    <main style={{ maxWidth: "var(--text-max)", margin: "0 auto", padding: "96px 24px", textAlign: "center" }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
      <h1 style={{ fontSize: "var(--text-h1)", fontWeight: 700, lineHeight: "var(--leading-heading)", marginBottom: 8 }}>Payment Successful!</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 32, lineHeight: "var(--leading-body)" }}>
        Thank you for subscribing to OllamoMUI Pro. You now have full access to all premium features.
        Check your email for your receipt and next steps.
      </p>
      <Link href="/playground" style={{
        display: "inline-block", padding: "12px 24px", borderRadius: 10,
        background: "var(--gradient-1)", color: "white", textDecoration: "none",
        fontWeight: 700, fontSize: "var(--text-body)",
      }}>
        Go to Playground
      </Link>
    </main>
  );
}
