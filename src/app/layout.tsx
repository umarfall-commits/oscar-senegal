import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sénégal 2035 — Modèle OSCAR | Refondation citoyenne",
  description:
    "Livre Blanc OSCAR : un modèle de gouvernance orienté résultats, compétent, agile et responsable pour le Sénégal. Téléchargez gratuitement le manifeste et rejoignez le mouvement citoyen.",
  keywords: [
    "OSCAR",
    "gouvernance",
    "Sénégal",
    "refondation",
    "livre blanc",
    "citoyen",
    "2029",
    "2035",
  ],
  authors: [{ name: "Moustapha (Oumar) Fall" }],
  openGraph: {
    title: "Sénégal 2035 — Modèle OSCAR",
    description:
      "Téléchargez gratuitement le Livre Blanc OSCAR. Un modèle pour refonder la gouvernance du Sénégal.",
    siteName: "OSCAR — Sénégal 2035",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sénégal 2035 — Modèle OSCAR",
    description:
      "Téléchargez gratuitement le Livre Blanc OSCAR. Un modèle pour refonder la gouvernance du Sénégal.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}