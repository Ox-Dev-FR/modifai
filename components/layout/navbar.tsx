"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, PlusCircle, Sparkles, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserNav } from "@/components/layout/user-nav";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/60 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Modifai
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="/feed" className="hover:text-primary transition-colors">Explorer</Link>
          <Link href="/trending" className="hover:text-primary transition-colors">Tendances</Link>
          <Link href="/models" className="hover:text-primary transition-colors">Modèles</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className="h-9 w-64 rounded-full bg-white/5 border border-white/10 pl-9 pr-4 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all hover:bg-white/10"
            />
          </div>
          
          <UserNav />
          
           <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
        </div>
      </div>
    </header>
  );
}
