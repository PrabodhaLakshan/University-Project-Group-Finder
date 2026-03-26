import { NextResponse } from "next/server";

export async function GET() {
  const tutors = [
    {
      id: 1,
      name: "Nimal Perera",
      subject: "Mathematics",
      university: "University of Colombo",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Samanthi Silva",
      subject: "Physics",
      university: "University of Moratuwa",
      rating: 4.6,
    },
  ];

  return NextResponse.json(tutors);
}
