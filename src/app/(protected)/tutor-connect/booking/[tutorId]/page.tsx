import TutorProfilePage from "@/app/modules/tutor-connect/components/ui/TutorProfilePage";

type PageProps = {
  params: Promise<{
    tutorId: string;
  }>;
};

export default async function BookingTutorPage({ params }: PageProps) {
  const { tutorId } = await params;

  return <TutorProfilePage tutorId={tutorId} />;
}