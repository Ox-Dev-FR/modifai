"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import { PlusCircle, User as UserIcon, LogOut } from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserNav() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return <div className="h-9 w-20 bg-white/5 animate-pulse rounded-full" />;
  }

  if (!user) {
    return (
      <Link href="/login">
        <Button size="sm" variant="secondary" className="gap-2 bg-white/10 hover:bg-white/20 border-white/5">
          <UserIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Connexion</span>
        </Button>
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link href="/create">
        <Button size="sm" className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 border-0 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-purple-500/20">
          <PlusCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Nouveau</span>
        </Button>
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full overflow-hidden border border-white/10 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
            <Image
              src={user.image || "https://picsum.photos/seed/user/100/100"}
              alt={user.email || "User"}
              fill
              className="object-cover"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name || "Utilisateur"}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/profile" className="w-full cursor-pointer">
              Profil
            </Link>
          </DropdownMenuItem>
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href="/my-prompts" className="w-full cursor-pointer">
                Mes Prompts
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Paramètres
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut()}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Se déconnecter</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
