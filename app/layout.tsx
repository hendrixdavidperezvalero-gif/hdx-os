import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { RegisterSW } from "@/components/RegisterSW";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jbmono",
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  applicationName: "HDX OS",
  title: "HDX OS",
  description: "Tu vida, en texto plano. Command center personal sobre tu vault.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "HDX OS" },
  formatDetection: { telephone: false },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f9f6" },
    { media: "(prefers-color-scheme: dark)", color: "#181b17" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${inter.variable} ${mono.variable}`}>
      <body className="min-h-dvh bg-surface2 font-sans text-ink antialiased">
        <StoreProvider>
          <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-paper sm:border-x sm:border-line">
            {children}
          </div>
        </StoreProvider>
        <RegisterSW />
      </body>
    </html>
  );
}
