import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from './providers';



const open_sans = Open_Sans({
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["italic", "normal"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tenis Sport Lzc",
  description: "Punto de Venta para la tienda tenis Campeón",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={open_sans.className}>
      <body className={open_sans.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
