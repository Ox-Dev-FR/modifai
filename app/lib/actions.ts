"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { uploadImage } from "./storage";

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Identifiants invalides.";
        default:
          return "Une erreur est survenue.";
      }
    }
    throw error;
  }
  redirect("/");
}

export async function register(formData: FormData) {
  const data = Object.fromEntries(formData);
  const validatedFields = RegisterSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: "Champs invalides." };
  }

  const { email, password, name } = validatedFields.data;

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "Cet email est déjà utilisé." };
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  try {
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || email.split("@")[0],
      },
    });
  } catch (error) {
    return { error: "Erreur lors de la création du compte." };
  }
  
  // Login directly after registration? Or redirect to login?
  // Let's redirect to login for simplicity or try to signIn directly (might be complex in server action context without redirect)
  // Usually redirect to login is safer.
  redirect("/login?message=Compte créé ! Connectez-vous.");
}


export async function createPrompt(formData: FormData) {
  const { auth } = await import("@/auth");
  const session = await auth();
  
  if (!session?.user?.email) {
    return { error: "Vous devez être connecté pour publier." };
  }

  // Get user ID from DB
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return { error: "Compte utilisateur introuvable." };
  }

  const title = "Nouveau Prompt"; // Can accept title from formData if added to UI
  const promptText = formData.get("prompt") as string;
  const model = formData.get("model") as string;
  const params = formData.get("params") as string;
  const beforeImageFile = formData.get("beforeImage") as File;
  const afterImageFile = formData.get("afterImage") as File;

  if (!promptText || !beforeImageFile || !afterImageFile) {
    return { error: "Veuillez remplir tous les champs obligatoires." };
  }

  let beforeImageUrl: string;
  let afterImageUrl: string;

  try {
    beforeImageUrl = await uploadImage(beforeImageFile);
    afterImageUrl = await uploadImage(afterImageFile);
  } catch (e) {
    return { error: "Erreur lors de l'upload des images." };
  }

  try {
    await prisma.prompt.create({
      data: {
        userId: user.id,
        title,
        promptText: promptText + (params ? " " + params : ""),
        model: model || "Midjourney v6",
        params,
        beforeImage: beforeImageUrl,
        afterImage: afterImageUrl,
      },
    });
  } catch (e) {
    return { error: "Erreur lors de la sauvegarde du prompt." };
  }

  redirect("/");
}

export async function updateProfile(formData: FormData) {
  const { auth } = await import("@/auth");
  const session = await auth();
  
  if (!session?.user?.email) {
    return { error: "Vous devez être connecté." };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return { error: "Utilisateur introuvable." };
  }

  const name = formData.get("name") as string;
  const avatarFile = formData.get("avatar") as File;

  let avatarUrl = user.image;

  // Upload avatar if provided
  if (avatarFile && avatarFile.size > 0) {
    try {
      avatarUrl = await uploadImage(avatarFile);
    } catch (e) {
      return { error: "Erreur lors de l'upload de l'avatar." };
    }
  }

  // Update user in database
  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name || user.name,
        image: avatarUrl,
      },
    });
  } catch (e) {
    return { error: "Erreur lors de la mise à jour du profil." };
  }

  return { success: true };
}

export async function updatePrompt(formData: FormData) {
  const { auth } = await import("@/auth");
  const session = await auth();
  
  if (!session?.user?.email) {
    return { error: "Vous devez être connecté." };
  }

  const promptId = formData.get("id") as string;
  const promptText = formData.get("prompt") as string;
  const model = formData.get("model") as string;
  const params = formData.get("params") as string;
  const beforeImageFile = formData.get("beforeImage") as File;
  const afterImageFile = formData.get("afterImage") as File;

  // Get existing prompt
  const existingPrompt = await prisma.prompt.findUnique({
    where: { id: promptId },
    include: { user: true },
  });

  if (!existingPrompt || existingPrompt.user.email !== session.user.email) {
    return { error: "Prompt introuvable ou accès refusé." };
  }

  let beforeImageUrl = existingPrompt.beforeImage;
  let afterImageUrl = existingPrompt.afterImage;

  // Upload new images if provided
  try {
    if (beforeImageFile && beforeImageFile.size > 0) {
      beforeImageUrl = await uploadImage(beforeImageFile);
    }
    if (afterImageFile && afterImageFile.size > 0) {
      afterImageUrl = await uploadImage(afterImageFile);
    }
  } catch (e) {
    return { error: "Erreur lors de l'upload des images." };
  }

  // Update prompt
  try {
    await prisma.prompt.update({
      where: { id: promptId },
      data: {
        promptText,
        model,
        params,
        beforeImage: beforeImageUrl,
        afterImage: afterImageUrl,
      },
    });
  } catch (e) {
    return { error: "Erreur lors de la mise à jour du prompt." };
  }

  return { success: true };
}

export async function deletePrompt(promptId: string) {
  const { auth } = await import("@/auth");
  const session = await auth();
  
  if (!session?.user?.email) {
    return { error: "Vous devez être connecté." };
  }

  // Verify ownership
  const prompt = await prisma.prompt.findUnique({
    where: { id: promptId },
    include: { user: true },
  });

  if (!prompt || prompt.user.email !== session.user.email) {
    return { error: "Prompt introuvable ou accès refusé." };
  }

  // Delete prompt
  try {
    await prisma.prompt.delete({
      where: { id: promptId },
    });
  } catch (e) {
    return { error: "Erreur lors de la suppression du prompt." };
  }

  return { success: true };
}

export async function toggleLike(promptId: string) {
  const { auth } = await import("@/auth");
  const session = await auth();
  
  if (!session?.user?.email) {
    return { error: "Vous devez être connecté pour liker." };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return { error: "Utilisateur non trouvé." };

  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_promptId: {
          userId: user.id,
          promptId: promptId,
        },
      },
    });

    if (existingLike) {
      // Unlike
      await prisma.$transaction([
        prisma.like.delete({
          where: { id: existingLike.id },
        }),
        prisma.prompt.update({
          where: { id: promptId },
          data: { likesCount: { decrement: 1 } },
        }),
      ]);
      return { success: true, liked: false };
    } else {
      // Like
      await prisma.$transaction([
        prisma.like.create({
          data: {
            userId: user.id,
            promptId: promptId,
          },
        }),
        prisma.prompt.update({
          where: { id: promptId },
          data: { likesCount: { increment: 1 } },
        }),
      ]);
      return { success: true, liked: true };
    }
  } catch (error) {
    return { error: "Une erreur est survenue lors du like." };
  }
}

export async function getLikedPrompts() {
  const { auth } = await import("@/auth");
  const session = await auth();
  
  if (!session?.user?.email) {
    return { error: "Non connecté." };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true }
  });

  if (!user) return { error: "Utilisateur non trouvé." };

  try {
    const likes = await prisma.like.findMany({
      where: { userId: user.id },
      include: {
        prompt: {
          include: {
            user: true,
            userLikes: {
              where: { userId: user.id }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return { 
      success: true, 
      prompts: likes.map((l: any) => ({
        ...l.prompt,
        id: l.prompt.id,
        title: l.prompt.title,
        prompt: l.prompt.promptText,
        model: l.prompt.model,
        params: l.prompt.params || "",
        beforeImage: l.prompt.beforeImage,
        afterImage: l.prompt.afterImage,
        likes: l.prompt.likesCount,
        author: {
          name: l.prompt.user?.name || "Anonyme",
          avatar: l.prompt.user?.image || "https://github.com/shadcn.png"
        },
        userId: l.prompt.userId,
        isLikedInitially: true
      })) 
    };
  } catch (error) {
    console.error("Error fetching liked prompts:", error);
    return { error: "Erreur lors de la récupération des likes." };
  }
}



