"use client";

import { useState } from "react";
import { ComparisonSlider } from "./comparison-slider";
import { Button } from "./button";
import { Copy, Heart, Share2, Info, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth-provider";
import Link from "next/link";
import { toggleLike, deletePrompt } from "@/app/lib/actions";
import { useTransition } from "react";


interface PromptCardProps {
  id: string;
  beforeImage: string;
  afterImage: string;
  prompt: string;
  negativePrompt?: string;
  model: string;
  author: {
    name: string;
    avatar: string;
    id?: string;
  };
  likes: number;
  userId?: string; 
  isLikedInitially?: boolean; // Prop to know if user already liked
}

export function PromptCard({
  id,
  beforeImage,
  afterImage,
  prompt,
  negativePrompt,
  model,
  author,
  likes,
  userId,
  isLikedInitially = false,
}: PromptCardProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [liked, setLiked] = useState(isLikedInitially);
  const [count, setCount] = useState(likes);
  const [isPending, startTransition] = useTransition();
  const { user } = useAuth();
  const isAuthor = user && userId && user.id === userId;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(prompt);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDelete = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce prompt ? Cette action est irréversible.")) {
      startTransition(async () => {
        const result = await deletePrompt(id);
        if (result.success) {
          window.location.reload(); 
        } else {
          alert(result.error);
        }
      });
    }
  };


  const handleLike = async () => {
    if (!user) {
      alert("Vous devez être connecté pour liker.");
      return;
    }

    // Optimistic update
    const newLiked = !liked;
    setLiked(newLiked);
    setCount(prev => newLiked ? prev + 1 : prev - 1);

    const result = await toggleLike(id);
    if (result.error) {
      // Revert on error
      setLiked(liked);
      setCount(count);
      alert(result.error);
    }
  };


  return (
    <div className="bg-black/40 backdrop-blur-md border border-white/10 shadow-xl rounded-xl overflow-hidden flex flex-col h-full transition-all hover:border-white/20 hover:shadow-2xl hover:shadow-primary/10">
      {/* Image Comparison Area */}
      <div className="p-3 pb-0">
        <ComparisonSlider
          beforeImage={beforeImage}
          afterImage={afterImage}
          aspectRatio="square"
          className="rounded-lg w-full"
        />
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-grow gap-3">
        {/* Header: Author & Model */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/10">
              <Image src={author.avatar} alt={author.name} fill className="object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">{author.name}</span>
              <span className="text-xs text-muted-foreground">{model}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded-full group/like cursor-pointer hover:bg-white/10 transition-colors"
               onClick={handleLike}>
            <Heart className={cn("w-3 h-3 transition-colors", liked ? "text-red-500 fill-red-500" : "text-muted-foreground group-hover/like:text-red-400")} />
            <span className={liked ? "text-red-400" : ""}>{count}</span>
          </div>
        </div>

        {/* Prompt Text */}
        <div className="relative group flex-grow">
          <p className="text-sm text-gray-300 line-clamp-3 font-mono leading-relaxed bg-black/30 p-3 rounded-md border border-white/5">
            {prompt}
          </p>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="secondary"
              className="h-6 w-6"
              onClick={copyToClipboard}
            >
              <Copy className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-2 border-t border-white/5">
          {isAuthor ? (
            <Button asChild variant="ghost" size="sm" className="flex-1 text-xs gap-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10">
              <Link href={`/prompt/${id}/edit`}>
                <Edit className="w-3 h-3" />
                Éditer
              </Link>
            </Button>
          ) : (
            <Button variant="ghost" size="sm" className="flex-1 text-xs gap-2 text-muted-foreground hover:text-white">
              <Info className="w-3 h-3" />
              Détails
            </Button>
          )}
          <Button variant="ghost" size="sm" className="flex-1 text-xs gap-2 text-muted-foreground hover:text-white">
            <Share2 className="w-3 h-3" />
            Partager
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1 text-xs gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/10"
            onClick={copyToClipboard}
          >
            <Copy className="w-3 h-3" />
            {isCopied ? "Copié !" : "Copier"}
          </Button>
          {isAuthor && (
            <Button 
              variant="destructive" 
              size="icon" 
              className="h-8 w-8 text-red-500 bg-red-500/10 hover:bg-red-500/20 border-none"
              onClick={handleDelete}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
