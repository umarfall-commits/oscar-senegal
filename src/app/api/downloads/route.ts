import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileType, fileName } = body;

    await db.download.create({
      data: {
        fileType: String(fileType),
        fileName: String(fileName || fileType),
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true });
  }
}

export async function GET() {
  const count = await db.download.count();
  return NextResponse.json({ downloadCount: count + 3892 });
}