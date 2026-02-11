import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Modifai - Améliorez vos prompts IA",
  description: "La plateforme pour optimiser et partager vos prompts d'IA avec des comparaisons avant/après.",
};

import { Navbar } from "@/components/layout/navbar";
import { AuthProvider } from "@/components/auth-provider";
import { auth } from "@/auth";
import { CookieConsent } from "@/components/cookie-consent";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  
  // Get fresh user data from DB if logged in
  let dbUser = null;
  if (session?.user?.email) {
    const { prisma } = await import("@/lib/prisma");
    dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });
  }
  
  return (
    <html lang="fr" className="dark">
      <body className={cn(inter.variable, "min-h-screen bg-background font-sans antialiased text-foreground")}>
        <AuthProvider session={session} dbUser={dbUser}>
          <Navbar />
          {children}
          <CookieConsent />
        </AuthProvider>
      </body>
    </html>
  );
}
