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
    <main style={{ maxWidth: 600, margin: "0 auto", padding: "clamp(40px, 10vw, 80px) 24px", textAlign: "center" }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
      <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: 8 }}>Payment Successful!</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 32, lineHeight: 1.6 }}>
        Thank you for subscribing to OllamoMUI Pro. You now have full access to all premium features.
        Check your email for your receipt and next steps.
      </p>
      <Link href="/playground" style={{
        display: "inline-block", padding: "12px 24px", borderRadius: 10,
        background: "var(--gradient-1)", color: "white", textDecoration: "none",
        fontWeight: 700, fontSize: 15,
      }}>
        Go to Playground
      </Link>
    </main>
  );
}
