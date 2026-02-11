import { FadeIn } from "@/components/ui/motion";
import { Sparkles, Zap, Palette, Cpu } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PromptCard } from "@/components/ui/prompt-card";
import { auth } from "@/auth";


const modelInfo = [
  {
    name: "Midjourney v6",
    icon: Sparkles,
    description: "Le standard pour la qualité photographique et artistique",
    color: "from-purple-500 to-pink-500",
  },
  {
    name: "DALL-E 3",
    icon: Palette,
    description: "Excellent pour la compréhension du langage naturel",
    color: "from-green-500 to-emerald-500",
  },
  {
    name: "Stable Diffusion XL",
    icon: Zap,
    description: "Open-source et hautement personnalisable",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Leonardo AI",
    icon: Cpu,
    description: "Parfait pour les assets de jeux vidéo",
    color: "from-orange-500 to-red-500",
  },
];

export default async function ModelsPage() {
  const session = await auth();
  const dbUser = session?.user?.email ? await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true }
  }) : null;

  // Récupérer les prompts groupés par modèle
  const allPrompts = await prisma.prompt.findMany({
    include: { 
      user: true,
      userLikes: dbUser ? { where: { userId: dbUser.id } } : undefined,
    },
    orderBy: { createdAt: 'desc' },
  });


  return (
    <main className="min-h-screen bg-background pt-24 pb-12 px-4">
      <FadeIn className="container mx-auto max-w-7xl">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-white mb-2">Modèles IA</h1>
          <p className="text-muted-foreground">Explorez les prompts par modèle d'intelligence artificielle</p>
        </div>

        <div className="space-y-16">
          {modelInfo.map((model) => {
            const Icon = model.icon;
            const modelPrompts = allPrompts
              .filter((p) => p.model === model.name)
              .map((p) => ({
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
              <div key={model.name}>
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${model.color} bg-opacity-20 border border-white/10`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{model.name}</h2>
                    <p className="text-sm text-muted-foreground">{model.description}</p>
                  </div>
                  <div className="ml-auto">
                    <span className="text-sm text-muted-foreground">
                      {modelPrompts.length} prompt{modelPrompts.length > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {modelPrompts.length > 0 ? (
                  <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {modelPrompts.slice(0, 6).map((prompt) => (
                      <div key={prompt.id} className="break-inside-avoid">
                        <PromptCard {...prompt} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-black/20 rounded-xl border border-white/5">
                    <p className="text-muted-foreground">Aucun prompt pour ce modèle pour le moment.</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </FadeIn>
    </main>
  );
}
