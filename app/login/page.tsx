"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { authenticate, register } from "@/app/lib/actions";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Login State
  const [loginError, loginAction, isLoginPending] = useActionState(authenticate, undefined);

  // Register State
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [isRegisterPending, setIsRegisterPending] = useState(false);

  const handleRegister = async (formData: FormData) => {
    setIsRegisterPending(true);
    setRegisterError(null);
    const result = await register(formData);
    setIsRegisterPending(false);
    
    if (result?.error) {
      setRegisterError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
        {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[100px]" />
      </div>

      <div className="w-full max-w-md space-y-8 bg-black/40 backdrop-blur-md p-8 rounded-xl border border-white/10 shadow-2xl">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
            {isSignUp ? "Créer un compte" : "Connexion"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {isSignUp ? "Rejoignez Modifai" : "Bon retour parmi nous"}
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {isSignUp ? (
            <form action={handleRegister} className="space-y-4">
               <div>
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" name="email" type="email" required placeholder="nom@exemple.com" className="bg-white/5 border-white/10 text-white mt-1"/>
                </div>
                <div>
                  <Label htmlFor="signup-name">Pseudo (Optionnel)</Label>
                  <Input id="signup-name" name="name" type="text" placeholder="Votre pseudo" className="bg-white/5 border-white/10 text-white mt-1"/>
                </div>
                <div>
                  <Label htmlFor="signup-password">Mot de passe</Label>
                  <Input id="signup-password" name="password" type="password" required className="bg-white/5 border-white/10 text-white mt-1"/>
                </div>

                {registerError && (
                  <div className="text-red-400 text-sm p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
                    {registerError}
                  </div>
                )}

                <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white" disabled={isRegisterPending}>
                  {isRegisterPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  S'inscrire
                </Button>
            </form>
          ) : (
             <form action={loginAction} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required placeholder="nom@exemple.com" className="bg-white/5 border-white/10 text-white mt-1"/>
                </div>
                <div>
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input id="password" name="password" type="password" required className="bg-white/5 border-white/10 text-white mt-1"/>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" className="border-white/20" />
                    <label htmlFor="remember" className="text-sm font-medium text-muted-foreground">
                      Se souvenir de moi
                    </label>
                  </div>
                  <div className="text-sm">
                    <a href="#" className="font-medium text-blue-400 hover:text-blue-300">
                      Mot de passe oublié ?
                    </a>
                  </div>
                </div>

                {loginError && (
                  <div className="text-red-400 text-sm p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
                    {loginError}
                  </div>
                )}

                <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white" disabled={isLoginPending}>
                  {isLoginPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Se connecter
                </Button>
             </form>
          )}

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setRegisterError(null);
              }}
              className="text-sm text-muted-foreground hover:text-white transition-colors underline underline-offset-4"
            >
              {isSignUp
                ? "Déjà un compte ? Se connecter"
                : "Pas encore de compte ? S'inscrire"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
