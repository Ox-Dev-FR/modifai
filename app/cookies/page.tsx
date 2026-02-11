import { FadeIn } from "@/components/ui/motion";
import { Cookie, Shield, Info, Lock } from "lucide-react";

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen bg-background pt-24 pb-12 px-4">
      <FadeIn className="container mx-auto max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
            <Cookie className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-white">Politique de Cookies</h1>
        </div>

        <div className="prose prose-invert max-w-none space-y-12">
          <section className="bg-black/20 rounded-2xl p-8 border border-white/5 space-y-4">
            <div className="flex items-center gap-3 text-white font-semibold">
              <Info className="w-5 h-5 text-blue-400" />
              <h2>Qu'est-ce qu'un cookie ?</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette ou mobile) lors de la visite d'un site. 
              Il permet au site de mémoriser des informations sur votre visite, comme votre identité si vous êtes connecté, 
              pour faciliter vos visites ultérieures et améliorer l'utilité du site pour vous.
            </p>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3 text-white font-semibold text-xl">
              <Shield className="w-6 h-6 text-green-400" />
              <h2>Types de cookies que nous utilisons</h2>
            </div>

            <div className="grid gap-6">
              <div className="bg-black/40 border border-white/10 rounded-xl p-6">
                <h3 className="text-white font-medium mb-2 flex items-center justify-between">
                  <span>Cookies Essentiels (Strictement nécessaires)</span>
                  <span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded-full border border-green-500/20">Toujours actifs</span>
                </h3>
                <p className="text-sm text-muted-foreground">
                  Ces cookies sont indispensables au fonctionnement du site. Dans notre cas, ils servent principalement à :
                </p>
                <ul className="text-sm text-muted-foreground list-disc pl-5 mt-2 space-y-1">
                  <li>Maintenir votre session ouverte (NextAuth.js)</li>
                  <li>Prévenir les attaques CSRF et sécuriser vos formulaires</li>
                  <li>Mémoriser vos préférences de consentement aux cookies eux-mêmes</li>
                </ul>
              </div>

              <div className="bg-black/40 border border-white/10 rounded-xl p-6 opacity-60">
                <h3 className="text-white font-medium mb-2 flex items-center justify-between">
                  <span>Cookies de Mesure d'Audience</span>
                  <span className="text-xs bg-gray-500/10 text-gray-400 px-2 py-1 rounded-full border border-white/5">Désactivés</span>
                </h3>
                <p className="text-sm text-muted-foreground">
                  Prochainement, nous pourrions utiliser des outils comme Google Analytics pour comprendre comment les utilisateurs interagissent avec le site. 
                  Ces outils ne seront activés qu'avec votre consentement explicite.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-primary/5 rounded-2xl p-8 border border-primary/10 space-y-4">
            <div className="flex items-center gap-3 text-white font-semibold">
              <Lock className="w-5 h-5 text-primary" />
              <h2>Comment gérer vos choix ?</h2>
            </div>
            <p className="text-muted-foreground">
              Vous pouvez à tout moment changer d'avis et modifier vos choix concernant les cookies en cliquant sur le bouton 
              de gestion des cookies situé en bas de chaque page. Vous pouvez également configurer votre navigateur pour bloquer 
              systématiquement les cookies, bien que cela puisse empêcher certaines fonctionnalités de fonctionner (comme la connexion).
            </p>
          </section>
        </div>
      </FadeIn>
    </main>
  );
}
