"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import FloatingContactButtons from "@/components/common/FloatingContactButtons";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Atorix IT Solutions - Modern IT Services</title>
        <meta name="description" content="Atorix IT Solutions - Providing robust, business process solutions with unrivalled experience in SAP S4 HANA Implementation and more." />
        <meta name="keywords" content="SAP implementation, SAP support, SAP migration, S/4 HANA, IT solutions, digital transformation" />
        <meta name="author" content="Atorix IT Solutions" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://atorixit.com/" />
        <meta property="og:title" content="Atorix IT Solutions - SAP Implementation Experts" />
        <meta property="og:description" content="Transform your business with our comprehensive SAP solutions including implementation, support, migration, and more." />
        <meta property="og:image" content="/AtorixIT.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://atorixit.com/" />
        <meta property="twitter:title" content="Atorix IT Solutions - SAP Implementation Experts" />
        <meta property="twitter:description" content="Transform your business with our comprehensive SAP solutions including implementation, support, migration, and more." />
        <meta property="twitter:image" content="/AtorixIT.png" />

        {/* Canonical link */}
        <link rel="canonical" href="https://atorixit.com/" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="min-h-[calc(100vh-4rem)]">
            {children}
          </main>
          <Footer />
          <FloatingContactButtons />
        </ThemeProvider>
      </body>
    </html>
  );
}
