import { Button } from "@/components/ui/button";
import { PromptCard } from "@/components/ui/prompt-card";
import { prisma } from "@/lib/prisma";
import { FadeIn } from "@/components/ui/motion";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { auth } from "@/auth";


export default async function FeedPage() {
  const session = await auth();
  const dbUser = session?.user?.email ? await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true }
  }) : null;

  const prompts = await prisma.prompt.findMany({
    include: { 
      user: true,
      userLikes: dbUser ? { where: { userId: dbUser.id } } : undefined,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });


  const displayPrompts = prompts.map((p) => ({
    id: p.id,
    title: p.title,
    prompt: p.promptText,
    model: p.model,
    params: p.params || "",
    beforeImage: p.beforeImage,
    afterImage: p.afterImage,
    likes: p.likesCount,
    author: {
      name: p.user?.name || "Anonyme",
      avatar: p.user?.image || "https://github.com/shadcn.png"
    },
    userId: p.userId,
    isLikedInitially: (p.userLikes && p.userLikes.length > 0) || false
  }));

  return (
    <main className="min-h-screen bg-background pt-24 pb-12 px-4">
      <FadeIn className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Explorer</h1>
            <p className="text-muted-foreground mt-2">Découvrez tous les prompts de la communauté</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" className="text-muted-foreground hover:text-white">Récents</Button>
            <Button variant="ghost" className="text-muted-foreground hover:text-white">Populaires</Button>
            <Button variant="ghost" className="text-muted-foreground hover:text-white">Meilleurs</Button>
          </div>
        </div>

        {displayPrompts.length > 0 ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {displayPrompts.map((prompt) => (
              <div key={prompt.id} className="break-inside-avoid">
                <PromptCard {...prompt} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <p>Aucun prompt pour le moment. Soyez le premier à en publier un !</p>
          </div>
        )}
      </FadeIn>
    </main>
  );
}
