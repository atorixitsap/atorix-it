"use client";

import { Inter } from "next/font/google";
import { useEffect } from "react";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import FloatingContactButtons from "@/components/common/FloatingContactButtons";
import { pingBackend } from "@/lib/api";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  // Ping the backend on page load to wake it up from render.com sleep
  useEffect(() => {
    pingBackend();
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* We can't use the metadata export with "use client" so we hardcode essential meta tags */}
        <title>Atorix IT Solutions - Modern IT Services</title>
        <meta
          name="description"
          content="Atorix IT Solutions - Providing robust, business process solutions with unrivalled experience in SAP S4 HANA Implementation and more."
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Navbar />
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
          <Footer />
          <FloatingContactButtons />
        </ThemeProvider>
      </body>
    </html>
  );
}
