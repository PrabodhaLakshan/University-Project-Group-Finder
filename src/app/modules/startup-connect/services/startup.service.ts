import { prisma } from "@/lib/prismaClient";
// service එකේ ඉඳන් lib එකට යන්න පියවර 3ක් පසුපසට
export const getGigsWithMatchingScore = async (userId: string) => {
  // 1. මුලින්ම ලොග් වෙලා ඉන්න ශිෂ්‍යයාගේ skills ටික ගන්නවා
  const student = await prisma.users.findUnique({
    where: { id: userId },
    select: { skills: true }
  });

  // 2. දැනට තියෙන සියලුම Gigs (Jobs) ටික ගන්නවා
  // (ඔයාගේ schema එකේ දැනට Gigs table එක නැත්නම්, අපි ඒක පස්සේ add කරමු. දැනට මම groups table එක උදාහරණයකට ගන්නවා)
  const gigs = await prisma.groups.findMany({
    include: { users: true } // Founder ගේ විස්තර ගන්න
  });

  if (!student) return [];

  // 3. Matching Score එක Calculate කරන Logic එක
  const studentSkills = student.skills || [];

  const formattedGigs = gigs.map((gig) => {
    // මෙතනදී අපි හිතමු group එකේ නම තමයි job title එක කියලා
    // ඇත්තම Gig table එක හැදුවම මේක මීට වඩා ලෙහෙසි වෙනවා
    const requiredSkills = ["Next.js", "React"]; // දැනට dummy skills ටිකක් ගමු
    
    const matchedSkills = requiredSkills.filter(skill => 
      studentSkills.includes(skill)
    );

    const score = requiredSkills.length > 0 
      ? Math.round((matchedSkills.length / requiredSkills.length) * 100) 
      : 0;

    return {
      id: gig.id,
      title: gig.name || "Untitled Project",
      founder_name: gig.users?.name || "Unknown Founder",
      required_skills: requiredSkills,
      match_score: score,
      budget: "Negotiable", // DB එකේ budget එක නැති නිසා
    };
  });

  return formattedGigs;
};