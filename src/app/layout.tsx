import type { Metadata } from "next";
import { Inter, Gilda_Display } from "next/font/google";
import { site } from "@/config/site";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { ChromeGate } from "@/components/layout/ChromeGate";
import { JsonLd } from "@/components/JsonLd";
import { clinicSchema, physicianSchema } from "@/lib/schema";
import { megaMenu } from "@/lib/menu";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const gilda = Gilda_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-gilda",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Cirugía Plástica y Medicina Estética en Caracas | Perfect by Dr. Orsini",
    template: "%s | Perfect by Dr. Orsini",
  },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_VE",
    siteName: site.name,
    url: site.url,
    title: "Cirugía Plástica y Medicina Estética en Caracas | Perfect by Dr. Orsini",
    description: site.description,
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Perfect by Dr. Orsini — Cirugía Plástica en Caracas",
    description: site.description,
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-VE" className={`${inter.variable} ${gilda.variable}`}>
      <body className="flex min-h-screen flex-col">
        <JsonLd data={[clinicSchema(), physicianSchema()]} />
        <ChromeGate>
          <Navbar megaMenu={megaMenu} />
        </ChromeGate>
        <div className="flex-1">{children}</div>
        <ChromeGate>
          <Footer />
          <WhatsAppFloat />
        </ChromeGate>
      </body>
    </html>
  );
}
