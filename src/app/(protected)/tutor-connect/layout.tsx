import TutorLayout from "@/app/modules/tutor-connect/components/ui/TutorLayout";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TutorLayout>{children}</TutorLayout>;
}