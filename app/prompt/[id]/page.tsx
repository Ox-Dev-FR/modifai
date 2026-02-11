import { ComparisonSlider } from "@/components/ui/comparison-slider";
import { Button } from "@/components/ui/button";
import { Copy, Heart, Share2, ArrowLeft, Edit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PromptPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();

  const prompt = await prisma.prompt.findUnique({
    where: { id },
    include: {
      user: true,
      userLikes: session?.user?.email ? {
        where: { user: { email: session.user.email } }
      } : undefined
    }
  });

  if (!prompt) {
    return notFound();
  }

  const isLikedInitially = (prompt.userLikes && prompt.userLikes.length > 0) || false;
  const isAuthor = session?.user?.email === prompt.user.email;

  return (
    <main className="min-h-screen bg-background pb-20">
      <div className="container mx-auto px-4 py-8 pt-24">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au flux
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Visual - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-black/50 backdrop-blur-sm">
               <ComparisonSlider
                beforeImage={prompt.beforeImage}
                afterImage={prompt.afterImage}
                aspectRatio="video"
                className="w-full"
              />
            </div>
          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-6">
             {/* Author Card */}
            <div className="p-6 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 shadow-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/10">
                  <Image 
                    src={prompt.user.image || "https://github.com/shadcn.png"} 
                    alt={prompt.user.name || "Anonyme"} 
                    fill 
                    className="object-cover" 
                  />
                </div>
                <div>
                  <h3 className="font-bold text-white">{prompt.user.name || "Anonyme"}</h3>
                  <p className="text-sm text-muted-foreground">Prompt Engineer</p>
                </div>
                {isAuthor ? (
                  <Button asChild variant="outline" size="sm" className="ml-auto text-xs h-8 gap-2">
                    <Link href={`/prompt/${id}/edit`}>
                      <Edit className="w-3 h-3" />
                      Modifier
                    </Link>
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="ml-auto text-xs h-8">
                    Suivre
                  </Button>
                )}
              </div>
            </div>

            {/* Prompt Details */}
            <div className="p-6 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 shadow-xl space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Prompt Positif</h3>
                <div className="bg-black/40 p-4 rounded-lg border border-white/5 font-mono text-sm text-gray-300 leading-relaxed break-words">
                  {prompt.promptText}
                </div>
              </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Modèle</h3>
                    <p className="text-white font-medium">{prompt.model}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Dimensions</h3>
                    <p className="text-white font-medium">1024x1024</p>
                  </div>
               </div>

              <div className="flex flex-col gap-2 pt-4">
                <Button className="w-full gap-2 bg-gradient-to-r from-blue-600 to-purple-600 border-0">
                  <Copy className="w-4 h-4" /> Copier le Prompt
                </Button>
                <div className="flex gap-2">
                   <Button variant="secondary" className="flex-1 gap-2">
                    <Heart className={`w-4 h-4 ${isLikedInitially ? "fill-red-500 text-red-500" : ""}`} /> 
                    {prompt.likesCount}
                  </Button>
                  <Button variant="secondary" className="flex-1 gap-2">
                    <Share2 className="w-4 h-4" /> Partager
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
