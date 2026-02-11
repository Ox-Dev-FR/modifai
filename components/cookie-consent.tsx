"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { FadeIn } from "./ui/motion";
import Link from "next/link";
import { Cookie, X } from "lucide-react";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 z-50 flex justify-center pointer-events-none">
      <FadeIn className="pointer-events-auto max-w-2xl w-full">
        <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-center gap-6">
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 shrink-0">
            <Cookie className="w-8 h-8 text-primary" />
          </div>
          
          <div className="flex-grow space-y-2 text-center md:text-left">
            <h3 className="text-lg font-semibold text-white">Nous respectons votre vie privée</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Nous utilisons des cookies essentiels pour assurer le bon fonctionnement du site. 
              Pour en savoir plus, consultez notre{" "}
              <Link href="/cookies" className="text-primary hover:underline">
                politique de cookies
              </Link>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <Button variant="ghost" className="text-sm" onClick={handleDecline}>
              Refuser
            </Button>
            <Button className="text-sm bg-primary hover:bg-primary/90" onClick={handleAccept}>
              Tout accepter
            </Button>
          </div>
          
          <button 
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 text-muted-foreground hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </FadeIn>
    </div>
  );
}
