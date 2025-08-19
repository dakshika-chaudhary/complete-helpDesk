
"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "next-themes";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          // enableSystem={false}
          disableTransitionOnChange // smoother switching
        >
           
          <main className="pt-[64px]">{/* offset for fixed navbar */}
            <Navbar />
            {children}
            <Footer />
          </main>
          
        </ThemeProvider>
      </body>
    </html>
  );
}
