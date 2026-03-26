import TutorBookingPage from "@/app/modules/tutor-connect/components/ui/TutorBookingPage";

export default function Page({ params }: { params: { id: string } }) {
  return <TutorBookingPage params={params} />;
}
