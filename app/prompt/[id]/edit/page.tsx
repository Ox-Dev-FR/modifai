"use client";

import { useState, useTransition, useEffect, use } from "react";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ui/image-upload";
import { FadeIn } from "@/components/ui/motion";
import { Loader2, Trash2 } from "lucide-react";
import { updatePrompt, deletePrompt } from "@/app/lib/actions";
import { useRouter } from "next/navigation";

interface EditPromptPageProps {
  params: Promise<{
    id: string;
  }>;
}

import { AI_MODELS } from "@/app/lib/constants";

export default function EditPromptPage({ params }: EditPromptPageProps) {
  const { id } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [beforeImage, setBeforeImage] = useState<File | null>(null);
  const [afterImage, setAfterImage] = useState<File | null>(null);
  const [promptData, setPromptData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch prompt data
    fetch(`/api/prompts/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPromptData(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Prompt introuvable.");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background pt-24 pb-12 px-4 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </main>
    );
  }

  if (!user || !promptData || promptData.userId !== user.id) {
    return (
      <main className="min-h-screen bg-background pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <p className="text-muted-foreground">Vous n'avez pas accès à cette page.</p>
        </div>
      </main>
    );
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("id", id);
    
    if (beforeImage) formData.set("beforeImage", beforeImage);
    if (afterImage) formData.set("afterImage", afterImage);

    startTransition(async () => {
      const result = await updatePrompt(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/my-prompts");
      }
    });
  };

  const handleDelete = () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce prompt ?")) return;

    setIsDeleting(true);
    startTransition(async () => {
      const result = await deletePrompt(id);
      if (result?.error) {
        setError(result.error);
        setIsDeleting(false);
      } else {
        router.push("/my-prompts");
      }
    });
  };

  return (
    <main className="min-h-screen bg-background pt-24 pb-12 px-4 sm:px-6">
      <FadeIn className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Éditer le Prompt</h1>
            <p className="text-muted-foreground mt-2">Modifiez votre prompt</p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </>
            )}
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-white/10 space-y-8">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="prompt">Prompt (Texte)</Label>
              <textarea 
                id="prompt" 
                name="prompt" 
                required 
                defaultValue={promptData.promptText}
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
                  defaultValue={promptData.model}
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
                <Input 
                  id="params" 
                  name="params" 
                  placeholder="Ex: --ar 16:9 --v 6.0"
                  defaultValue={promptData.params || ""}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUpload 
              label="Image Avant (Prompt simple / Original)" 
              onChange={setBeforeImage}
              previewUrl={promptData.beforeImage}
            />
            <ImageUpload 
              label="Image Après (Prompt amélioré)" 
              onChange={setAfterImage}
              previewUrl={promptData.afterImage}
            />
          </div>

          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md text-center">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.back()}
            >
              Annuler
            </Button>
            <Button size="lg" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
          </div>
        </form>
      </FadeIn>
    </main>
  );
}
