import { Button } from "@/components/ui/button";
import { PromptCard } from "@/components/ui/prompt-card";
import { prisma } from "@/lib/prisma";
import { FadeIn } from "@/components/ui/motion";
import { TrendingUp } from "lucide-react";
import { auth } from "@/auth";


export default async function TrendingPage() {
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
      likesCount: 'desc', // Tri par likes (tendances)
    },
    take: 20, // Limiter aux 20 meilleurs
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
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/20">
            <TrendingUp className="w-6 h-6 text-orange-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Tendances</h1>
            <p className="text-muted-foreground mt-1">Les prompts les plus populaires du moment</p>
          </div>
        </div>

        {displayPrompts.length > 0 ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {displayPrompts.map((prompt, index) => (
              <div key={prompt.id} className="break-inside-avoid relative">
                {index < 3 && (
                  <div className="absolute -top-2 -left-2 z-10 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {index + 1}
                  </div>
                )}
                <PromptCard {...prompt} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <p>Aucun prompt tendance pour le moment.</p>
          </div>
        )}
      </FadeIn>
    </main>
  );
}
