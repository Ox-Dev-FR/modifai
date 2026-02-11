"use client";

import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/ui/image-upload";
import { useState, useTransition } from "react";
import { FadeIn } from "@/components/ui/motion";
import { Loader2 } from "lucide-react";
import { createPrompt } from "@/app/lib/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { AI_MODELS } from "@/app/lib/constants";

export default function CreatePage() {
  const [beforeImage, setBeforeImage] = useState<File | null>(null);
  const [afterImage, setAfterImage] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    if (beforeImage) formData.set("beforeImage", beforeImage);
    if (afterImage) formData.set("afterImage", afterImage);
    
    if (!beforeImage || !afterImage) {
      setError("Les deux images (Avant et Après) sont requises.");
      return;
    }

    startTransition(async () => {
      const result = await createPrompt(formData);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <main className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6">
      <FadeIn className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">Créer un nouveau Prompt</h1>
          <p className="text-muted-foreground">Partagez votre découverte avec la communauté</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-white/10 space-y-8">
           {/* Prompt Details */}
           <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="prompt">Prompt (Texte)</Label>
                <textarea 
                  id="prompt" 
                  name="prompt" 
                  required 
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Ex: A futuristic city with flying cars, cyberpunk style..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="model">Modèle IA</Label>
                  <select
                    id="model"
                    name="model"
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {AI_MODELS.map((model) => (
                      <option key={model} value={model} className="bg-gray-900">
                        {model}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                   <Label htmlFor="params">Paramètres (Optionnel)</Label>
                   <Input id="params" name="params" placeholder="Ex: --ar 16:9 --v 6.0" />
                </div>
              </div>
           </div>

           {/* Image Uploads */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <ImageUpload 
                label="Image Avant (Prompt simple / Original)" 
                onChange={setBeforeImage}
             />
             <ImageUpload 
                label="Image Après (Prompt amélioré)" 
                onChange={setAfterImage}
             />
           </div>

           {error && (
              <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md text-center">
                {error}
              </div>
           )}

           <div className="flex justify-end pt-4">
            <Button size="lg" className="w-full md:w-auto" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? "Publication en cours..." : "Publier le prompt"}
            </Button>
           </div>
        </form>
      </FadeIn>
    </main>
  );
}
