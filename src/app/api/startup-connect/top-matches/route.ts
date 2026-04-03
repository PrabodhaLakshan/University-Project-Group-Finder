import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismaClient";
import { resolveCompanyId } from "../_shared";

export const runtime = "nodejs";

type MatchTalent = {
  id: string;
  name: string;
  role: string;
  match: number;
  rating: string;
  skills: string[];
};

function normalizeSkill(skill: string) {
  return skill.trim().toLowerCase();
}

function unique(arr: string[]) {
  return Array.from(new Set(arr));
}

/**
 * Real student skills = canonical rows in `user_skills` → `skills.name`
 * plus legacy/free-text entries in `users.skills` (String[]).
 * Deduped by normalized name; display label prefers first seen casing.
 */
function buildStudentSkillIndex(student: {
  skills: string[];
  user_skills: Array<{ skills: { name: string } | null }>;
}) {
  const normToDisplay = new Map<string, string>();

  const add = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;
    const n = normalizeSkill(trimmed);
    if (!n) return;
    if (!normToDisplay.has(n)) normToDisplay.set(n, trimmed);
  };

  for (const us of student.user_skills ?? []) {
    const name = us.skills?.name;
    if (name) add(name);
  }

  for (const s of student.skills ?? []) {
    if (typeof s === "string") add(s);
  }

  return {
    normSet: new Set(normToDisplay.keys()),
    normToDisplay,
  };
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const minMatchParam = parseInt(url.searchParams.get("minMatch") ?? "0", 10);
    const minMatch = Number.isFinite(minMatchParam) ? Math.max(0, Math.min(100, minMatchParam)) : 0;

    const companyId = await resolveCompanyId(req);
    if (!companyId) {
      return NextResponse.json({ success: true, data: [], meta: { matchedCount: 0, minMatch } });
    }

    const gigs = await prisma.gigs.findMany({
      where: { company_id: companyId },
      select: { id: true, requirements: true },
    });

    const gigReqs = gigs
      .map((g) => unique((g.requirements ?? []).map(normalizeSkill).filter(Boolean)))
      .filter((arr) => arr.length > 0);

    if (gigReqs.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        meta: { matchedCount: 0, minMatch, hint: "no_gig_requirements" },
      });
    }

    let students: Array<{
      id: string;
      name: string;
      specialization: string | null;
      skills: string[];
      rating: unknown;
      user_skills: Array<{ skills: { name: string } | null }>;
    }>;

    try {
      students = await prisma.users.findMany({
        where: { role: "STUDENT" },
        select: {
          id: true,
          name: true,
          specialization: true,
          skills: true,
          rating: true,
          user_skills: {
            select: {
              skills: { select: { name: true } },
            },
          },
        },
        take: 800,
      });
    } catch (loadErr) {
      console.error("TOP_MATCHES_STUDENTS_WITH_SKILLS_ERROR:", loadErr);
      const basic = await prisma.users.findMany({
        where: { role: "STUDENT" },
        select: {
          id: true,
          name: true,
          specialization: true,
          skills: true,
          rating: true,
        },
        take: 800,
      });
      students = basic.map((s) => ({ ...s, user_skills: [] }));
    }

    const matches: MatchTalent[] = [];

    for (const student of students) {
      const { normSet, normToDisplay } = buildStudentSkillIndex(student);
      if (normSet.size === 0) continue;

      let bestMatchPct = 0;
      let bestMatchedLabels: string[] = [];

      for (const gigReq of gigReqs) {
        const matchedNorms = gigReq.filter((req) => normSet.has(req));
        const pct = gigReq.length ? (matchedNorms.length / gigReq.length) * 100 : 0;
        if (pct > bestMatchPct) {
          bestMatchPct = pct;
          bestMatchedLabels = matchedNorms
            .slice(0, 8)
            .map((norm) => normToDisplay.get(norm) ?? norm);
        }
      }

      const matchRounded = Math.min(
        100,
        parseFloat(bestMatchPct.toFixed(1))
      );
      if (matchRounded <= 0) continue;

      matches.push({
        id: student.id,
        name: student.name,
        role: student.specialization ?? "Student",
        match: matchRounded,
        rating: student.rating?.toString() ?? "0",
        skills: bestMatchedLabels,
      });
    }

    matches.sort((a, b) => {
      if (b.match !== a.match) return b.match - a.match;
      const ar = parseFloat(a.rating) || 0;
      const br = parseFloat(b.rating) || 0;
      return br - ar;
    });

    const qualified = matches.filter((m) => m.match >= minMatch);
    const matchedCount = qualified.length;
    const computed = qualified.slice(0, 3);

    return NextResponse.json({
      success: true,
      data: computed,
      meta: { matchedCount, minMatch },
    });
  } catch (error) {
    console.error("STARTUP_TOP_MATCHES_GET_ERROR:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch top matches";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
