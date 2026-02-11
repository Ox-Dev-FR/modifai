import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PromptCard } from "@/components/ui/prompt-card";
import { FadeIn } from "@/components/ui/motion";
import { redirect } from "next/navigation";
import { User } from "lucide-react";

export default async function MyPromptsPage() {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect("/login");
  }

  // Get user from database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/login");
  }

  // Fetch user's prompts
  const prompts = await prisma.prompt.findMany({
    where: {
      userId: user.id,
    },
    include: {
      user: true,
      userLikes: true, // For current user's prompts, we might want to see if they liked them too
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
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20">
            <User className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Mes Prompts</h1>
            <p className="text-muted-foreground mt-1">
              {displayPrompts.length} prompt{displayPrompts.length > 1 ? 's' : ''} publié{displayPrompts.length > 1 ? 's' : ''}
            </p>
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
          <div className="text-center py-20 bg-black/20 rounded-xl border border-white/5">
            <p className="text-muted-foreground mb-4">Vous n'avez pas encore publié de prompt.</p>
            <a href="/create" className="text-blue-400 hover:text-blue-300 underline underline-offset-4">
              Créer votre premier prompt
            </a>
          </div>
        )}
      </FadeIn>
    </main>
  );
}
