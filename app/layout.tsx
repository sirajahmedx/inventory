import GlobalLoading from "@/components/GlobalLoading";
import { Toaster } from "@/components/ui/toaster";
import localFont from "next/font/local";
import React, { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./authContext";
import "./globals.css";
import { ThemeProvider } from "./ThemeProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const poppins = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-poppins",
  weight: "100 900",
});

export const metadata = {
  title: "Inventory Management System",

  authors: [
    {
      name: "Siraj Ahmed",
    },
  ],
  keywords: [
    "Inventory Management",
    "Next.js",
    "React",
    "Mongoose",
    "MongoDB",
    "Product Listing",
    "Authentication",
    "JWT",
    "CRUD",
    "Responsive Web App",
    "Arnob Mahmud",
  ],
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
    other: [{ rel: "icon", url: "/favicon.ico" }],
  },
  openGraph: {
    title: "Inventory Management System",
    description:
      "Efficiently manage your product inventory with inventory, a secure and responsive Next.js web application.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inventory Management System",
    description:
      "Efficiently manage your product inventory with inventory, a secure and responsive Next.js web application.",
    images: [
      "https://github.com/user-attachments/assets/7495dcfb-c7cb-44e6-a1ef-d82930a8ada7",
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased bg-white dark:bg-slate-900 min-h-screen w-full`}
        style={{ minHeight: "100vh", width: "100%" }}
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 flex flex-col min-h-screen">
              <Suspense fallback={<div>Loading...</div>}>
                <GlobalLoading />
              </Suspense>
              <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
            </div>
          </ThemeProvider>
          <Toaster />
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  );
}
