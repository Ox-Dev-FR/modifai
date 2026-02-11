import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const prompt = await prisma.prompt.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!prompt) {
      return NextResponse.json({ error: "Prompt not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: prompt.id,
      promptText: prompt.promptText,
      model: prompt.model,
      params: prompt.params,
      beforeImage: prompt.beforeImage,
      afterImage: prompt.afterImage,
      userId: prompt.userId,
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
