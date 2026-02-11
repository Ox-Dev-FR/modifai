"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";

import { createContext, useContext } from "react";

const AuthContext = createContext<{ user: any; loading: boolean; signOut: () => void }>({
  user: null,
  loading: true,
  signOut: () => {},
});

export function AuthProvider({ 
  children, 
  session,
  dbUser
}: { 
  children: React.ReactNode; 
  session: any;
  dbUser?: any;
}) {
  const value = {
    user: dbUser || session?.user,
    loading: false, // Since it's passed from server
    signOut: () => nextAuthSignOut({ callbackUrl: "/" }),
  };

  return (
    <NextAuthSessionProvider session={session}>
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    </NextAuthSessionProvider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

