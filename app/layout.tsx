import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vagas Timeline",
  description: "Planejamento inteligente de cronogramas para processos seletivos."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
