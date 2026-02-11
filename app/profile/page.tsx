"use client";

import { useState, useTransition } from "react";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FadeIn } from "@/components/ui/motion";
import { Loader2, Upload, User } from "lucide-react";
import Image from "next/image";
import { updateProfile, getLikedPrompts } from "@/app/lib/actions";
import { useEffect } from "react";
import { PromptCard } from "@/components/ui/prompt-card";
import { Heart, Settings } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<"info" | "likes">("info");
  const [likedPrompts, setLikedPrompts] = useState<any[]>([]);
  const [loadingLikes, setLoadingLikes] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.image || null);

  useEffect(() => {
    if (activeTab === "likes" && likedPrompts.length === 0) {
      loadLikes();
    }
  }, [activeTab]);

  const loadLikes = async () => {
    setLoadingLikes(true);
    const result = await getLikedPrompts();
    if (result.success) {
      setLikedPrompts(result.prompts || []);
    }
    setLoadingLikes(false);
  };

  if (!user) {
    return (
      <main className="min-h-screen bg-background pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <p className="text-muted-foreground">Vous devez être connecté pour accéder à cette page.</p>
        </div>
      </main>
    );
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updateProfile(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess("Profil mis à jour avec succès !");
        setTimeout(() => setSuccess(null), 3000);
      }
    });
  };

  return (
    <main className="min-h-screen bg-background pt-24 pb-12 px-4">
      <FadeIn className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Mon Profil</h1>
          <p className="text-muted-foreground">Gérez vos informations et retrouvez vos coups de cœur</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-4 mb-8 border-b border-white/10">
          <button
            onClick={() => setActiveTab("info")}
            className={`pb-4 px-2 text-sm font-medium transition-colors relative ${
              activeTab === "info" ? "text-primary" : "text-muted-foreground hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Paramètres
            </div>
            {activeTab === "info" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("likes")}
            className={`pb-4 px-2 text-sm font-medium transition-colors relative ${
              activeTab === "likes" ? "text-primary" : "text-muted-foreground hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Mes Likes
            </div>
            {activeTab === "likes" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        </div>

        {activeTab === "info" ? (
          <div className="max-w-2xl">
            <form onSubmit={handleSubmit} className="bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-white/10 space-y-8">
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/10 bg-black/40">
                    {avatarPreview ? (
                      <Image
                        src={avatarPreview}
                        alt="Avatar"
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-16 h-16 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 p-2 bg-primary rounded-full cursor-pointer hover:bg-primary/90 transition-colors shadow-lg"
                  >
                    <Upload className="w-4 h-4 text-white" />
                    <input
                      id="avatar-upload"
                      name="avatar"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>
                <p className="text-sm text-muted-foreground">Cliquez sur l'icône pour changer votre photo</p>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Pseudo</Label>
                  <Input
                    id="name"
                    name="name"
                    defaultValue={user.name || ""}
                    placeholder="Votre pseudo"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email || ""}
                    disabled
                    className="opacity-50 cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground">L'email ne peut pas être modifié</p>
                </div>
              </div>

              {/* Messages */}
              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-md">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 text-sm text-green-500 bg-green-500/10 border border-green-500/20 rounded-md">
                  {success}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <Button size="lg" disabled={isPending}>
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isPending ? "Enregistrement..." : "Enregistrer les modifications"}
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            {loadingLikes ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : likedPrompts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {likedPrompts.map((prompt) => (
                  <PromptCard key={prompt.id} {...prompt} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-black/20 rounded-2xl border border-dashed border-white/10">
                <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                <p className="text-muted-foreground">Vous n'avez pas encore liké de prompts.</p>
              </div>
            )}
          </div>
        )}
      </FadeIn>
    </main>
  );
}

