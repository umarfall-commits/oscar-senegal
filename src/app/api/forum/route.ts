import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const contributions = await db.contribution.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json(contributions);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { author, region, theme, content } = body;

    if (!author || !theme || !content) {
      return NextResponse.json(
        { error: "Les champs auteur, thème et contenu sont obligatoires." },
        { status: 400 }
      );
    }

    const trimmedContent = String(content).trim();
    if (trimmedContent.length < 20) {
      return NextResponse.json(
        { error: "Votre contribution doit contenir au moins 20 caractères." },
        { status: 400 }
      );
    }

    const contribution = await db.contribution.create({
      data: {
        author: String(author).trim(),
        region: region ? String(region).trim() : null,
        theme: String(theme),
        content: trimmedContent,
      },
    });

    return NextResponse.json(contribution, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Erreur serveur. Veuillez réessayer." },
      { status: 500 }
    );
  }
}