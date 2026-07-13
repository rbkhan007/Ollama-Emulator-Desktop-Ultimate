import { REPO_URL } from "@/lib/config";

const PERSONAL_SITE = "https://rhasan-dev-bd-com.vercel.app";
const FREELANCER = "https://www.freelancer.com/u/Rakibul0007";
const WHATSAPP = "https://wa.me/8801774471120";
const FACEBOOK = "https://www.facebook.com/rakibul.hassan.269825";

export default function Footer() {
  return (
    <footer style={{
      padding: "28px 24px 20px", borderTop: "1px solid var(--glass-border)",
      textAlign: "center", marginTop: "auto",
    }}>
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
        fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6,
      }}>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          <a href="mailto:rbkhan00009@gmail.com" style={{ color: "var(--accent-2)", fontWeight: 500, textDecoration: "none" }}>Email</a>
          <a href={FREELANCER} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-2)", fontWeight: 500, textDecoration: "none" }}>Freelancer</a>
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-2)", fontWeight: 500, textDecoration: "none" }}>GitHub</a>
          <a href={FACEBOOK} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-2)", fontWeight: 500, textDecoration: "none" }}>Facebook</a>
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-2)", fontWeight: 500, textDecoration: "none" }}>WhatsApp</a>
          <a href={PERSONAL_SITE} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-2)", fontWeight: 500, textDecoration: "none" }}>Portfolio</a>
        </div>
        <span style={{ fontWeight: 600, color: "var(--text)", letterSpacing: "0.01em" }}>
          &copy; 2024-2026 Rhasan@dev. All rights reserved.
        </span>
        <span>
          Built by{" "}
          <a href={PERSONAL_SITE} target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent-2)", fontWeight: 600, textDecoration: "none" }}>
            Rhasan
          </a>
        </span>
      </div>
    </footer>
  );
}
