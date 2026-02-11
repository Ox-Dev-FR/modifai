import { Button } from "@/components/ui/button";
import { PromptCard } from "@/components/ui/prompt-card";
import { mockPrompts } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { FadeIn } from "@/components/ui/motion";
import Link from "next/link";
import { auth } from "@/auth";


export default async function Home() {
  // Fetch prompts from Prisma
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

  // Fallback to mock data if no prompts (for demo purposes if DB is empty)
  const displayPrompts = (prompts && prompts.length > 0) ? prompts.map((p) => ({
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
  })) : mockPrompts;

  const featuredPrompt = displayPrompts[0];
  const recentPrompts = displayPrompts.slice(1);

  return (
    <main className="flex min-h-screen flex-col bg-background">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
             <div className="mt-24 sm:mt-32 lg:mt-16">
              <a href="#" className="inline-flex space-x-6">
                <span className="rounded-full bg-blue-500/10 px-3 py-1 text-sm font-semibold leading-6 text-blue-400 ring-1 ring-inset ring-blue-500/20">
                  Nouveauté
                </span>
                <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-300">
                  <span>Version 1.0 lancée</span>
                </span>
              </a>
            </div>
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Maîtrisez l'Art du <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Prompt Engineering</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Découvrez, partagez et comparez les meilleurs prompts pour Midjourney, DALL-E et Stable Diffusion. Visualisez l'impact de chaque mot.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link href="/create">
                <Button size="lg" className="bg-white text-black hover:bg-gray-200">
                  Commencer à créer
                </Button>
              </Link>
              <a href="#feed" className="text-sm font-semibold leading-6 text-white hover:text-gray-300 transition-colors">
                Explorer la galerie <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          
          {/* Hero Image / Featured Comparison */}
          <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mt-0 lg:mr-0 lg:max-w-none lg:flex-none xl:ml-32">
             <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
              <div className="-m-2 rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                 <div className="w-[20rem] sm:w-[30rem] md:w-[35rem] rounded-xl overflow-hidden shadow-2xl border border-white/10">
                      {/* Featured Comparison */}
                      {featuredPrompt ? (
                        <PromptCard {...featuredPrompt} />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-white/5 text-muted-foreground p-8">
                          Aucun prompt disponible.
                        </div>
                      )}
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feed Section */}
      <div id="feed" className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Prompts Tendance</h2>
          <div className="flex gap-2">
            <Button variant="ghost" className="text-muted-foreground hover:text-white">Récents</Button>
            <Button variant="ghost" className="text-muted-foreground hover:text-white">Populaires</Button>
          </div>
        </div>

        {recentPrompts.length > 0 ? (
           <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {recentPrompts.map((prompt) => (
              <div key={prompt.id} className="break-inside-avoid">
                <PromptCard {...prompt} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-muted-foreground">
            <p>Aucun autre prompt pour le moment. Soyez le premier à en publier un !</p>
          </div>
        )}
      </div>
    </main>
  );
}
