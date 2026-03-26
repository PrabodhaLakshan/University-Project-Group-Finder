import Navbar from "@/components/Navbar";

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-semibold">Find your best project team.</h1>
        <p className="mt-2 text-gray-600">
          Build your profile, match by specialization, and chat with members.
        </p>
      </main>
    </div>
  );
}
