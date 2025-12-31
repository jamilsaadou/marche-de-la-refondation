import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  title: "Centenaire de la Ville de Niamey",

  description: "Plateforme d'information sur le Marché de la Réfondation - Valorisation et Commercialisation des Produits Locaux à l'occasion du Centenaire de Niamey (2026)",
  keywords: ["Marché de la Réfondation", "Niger", "Niamey", "Produits locaux", "Centenaire", "Commerce"],
  authors: [{ name: "Ministère du Commerce et de l'Industrie du Niger" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={montserrat.className}>{children}</body>
    </html>
  );
}
