import Navbar from "@/components/Navbar";

export default function UniMartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}
