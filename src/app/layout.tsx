import type { Metadata } from "next";
import { Anton, Archivo_Black, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const anton = Anton({ variable: "--font-anton", weight: "400", subsets: ["latin"] });
const archivo = Archivo_Black({ variable: "--font-archivo", weight: "400", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-jb", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Crunch Lab — Every bag, a little loud",
  description: "An animated concept site for Crunch Lab potato chips.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${anton.variable} ${archivo.variable} ${inter.variable} ${mono.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
