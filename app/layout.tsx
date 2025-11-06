import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";

const fontFamily = `"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;

export const metadata: Metadata = {
  title: "AstraCare | AI Doctor Appointment Agents",
  description:
    "Book medical appointments effortlessly with AstraCare's AI-powered multi-agent assistant. Find the right doctor, confirm availability, and manage visits in seconds."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" style={{ fontFamily: fontFamily }}>
      <body>
        <div className="app-shell">
          <header className="app-header">
            <div className="header-brand">
              <span className="brand-icon">⚕️</span>
              <div>
                <h1>AstraCare</h1>
                <p className="tagline">Doctor appointments orchestrated by AI agents</p>
              </div>
            </div>
            <nav className="header-nav">
              <a href="#agents">Agents</a>
              <a href="#book">Book</a>
              <a href="#timeline">Timeline</a>
            </nav>
          </header>
          <main className="app-main">{children}</main>
          <footer className="app-footer">
            <p>
              Need help? Ping the triage agent or call <strong>1-800-ASTRACARE</strong>.
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
