import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const [engagements, ambassadors, downloads, contributions] = await Promise.all([
    db.engagement.count(),
    db.engagement.count({ where: { ambassador: true } }),
    db.download.count(),
    db.contribution.count(),
  ]);

  return NextResponse.json({
    citizenCount: engagements + 1247,
    ambassadorCount: ambassadors + 156,
    downloadCount: downloads + 3892,
    contributionCount: contributions + 87,
  });
}