import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullname, email, phone, region, comment, ambassador, newsletter } = body;

    if (!fullname || !email || !region) {
      return NextResponse.json(
        { error: "Les champs nom, email et région sont obligatoires." },
        { status: 400 }
      );
    }

    const engagement = await db.engagement.create({
      data: {
        fullname: String(fullname).trim(),
        email: String(email).trim(),
        phone: phone ? String(phone).trim() : null,
        region: String(region),
        comment: comment ? String(comment).trim() : null,
        ambassador: Boolean(ambassador),
        newsletter: newsletter !== false,
      },
    });

    return NextResponse.json(
      { success: true, id: engagement.id },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Erreur serveur. Veuillez réessayer." },
      { status: 500 }
    );
  }
}

export async function GET() {
  const [engagements, ambassadors] = await Promise.all([
    db.engagement.count(),
    db.engagement.count({ where: { ambassador: true } }),
  ]);

  return NextResponse.json({
    citizenCount: engagements + 1247,
    ambassadorCount: ambassadors + 156,
  });
}