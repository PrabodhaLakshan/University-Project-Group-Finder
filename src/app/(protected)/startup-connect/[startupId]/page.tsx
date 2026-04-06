import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  MapPin,
  Sparkles,
  Star,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { COMPANY_DETAILS } from '@/app/modules/startup-connect/constants/company-details';
import { CompanyProfileReviewCta } from '@/app/modules/startup-connect/components/CompanyProfileReviewCta';
import { StartupRecentWorksSection } from '@/app/modules/startup-connect/components/StartupRecentWorksSection';
import { COMPANY_UUID_RE } from '@/app/api/startup-connect/_shared';
import { prisma } from '@/lib/prismaClient';

type StartupDetailsPageProps = {
  params: Promise<{ startupId: string }>;
};

async function resolveCompany(startupId: string) {
  const mock = COMPANY_DETAILS[startupId];
  if (mock) return mock;

  if (!COMPANY_UUID_RE.test(startupId)) return null;

  const row = await prisma.companies.findUnique({
    where: { id: startupId },
    select: {
      id: true,
      name: true,
      industry: true,
      location: true,
      about: true,
      logo_url: true,
      company_reviews: {
        orderBy: { created_at: 'desc' },
        take: 50,
        select: {
          id: true,
          rating: true,
          comment: true,
          created_at: true,
          users: { select: { name: true } },
        },
      },
    },
  });
  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    logoUrl: row.logo_url ?? '',
    industry: row.industry,
    location: row.location ?? 'Remote',
    about: row.about,
    reviews: row.company_reviews.map((r) => ({
      id: r.id,
      customer: r.users?.name?.trim() || 'Student',
      rating: r.rating,
      comment: r.comment,
      date: r.created_at
        ? r.created_at.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
        : '',
    })),
  };
}

export default async function StartupDetailsPage({ params }: StartupDetailsPageProps) {
  const { startupId } = await params;
  const company = await resolveCompany(startupId);

  if (!company) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 pt-20 pb-12">
        <div className="max-w-md w-full rounded-[2rem] border border-slate-200/80 bg-white p-10 text-center shadow-[0_24px_80px_-20px_rgba(15,23,42,0.15)]">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl font-black text-slate-400">
            ?
          </div>
          <h1 className="text-xl font-black uppercase tracking-tight text-slate-900">Startup not found</h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            This company profile isn&apos;t available right now.
          </p>
          <Link href="/startup-connect/browse-gigs" className="mt-8 inline-block">
            <Button className="rounded-2xl bg-blue-600 px-8 py-6 font-black text-[10px] uppercase tracking-widest text-white hover:bg-blue-700">
              <ArrowLeft size={14} className="mr-2 inline" />
              Back to Browse Gigs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const avgRating =
    company.reviews.length > 0
      ? (
          company.reviews.reduce((s, r) => s + r.rating, 0) / company.reviews.length
        ).toFixed(1)
      : null;

  return (
    <div className="relative min-h-screen pb-16 pt-6 sm:pt-10">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-blue-400/15 blur-3xl" />
        <div className="absolute -right-24 top-40 h-96 w-96 rounded-full bg-orange-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-64 w-[120%] -translate-x-1/2 bg-linear-to-t from-slate-50 to-transparent" />
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Link
          href="/startup-connect/browse-gigs"
          className="mb-6 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 transition-colors hover:text-blue-700"
        >
          <ArrowLeft size={14} /> Browse gigs
        </Link>

        {/* Hero card */}
        <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/90 shadow-[0_32px_80px_-24px_rgba(30,64,175,0.25)] backdrop-blur-sm sm:rounded-[2.5rem]">
          <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-br from-blue-600 via-blue-600 to-indigo-700" />
          <div className="absolute right-6 top-6 hidden sm:block">
            <span className="rounded-full bg-white/15 px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-white/90">
              Startup profile
            </span>
          </div>

          <div className="relative px-5 pb-8 pt-10 sm:px-10 sm:pb-10 sm:pt-12">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-3xl bg-linear-to-br from-orange-400/40 to-blue-500/30 blur-sm" />
                  <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-[1.35rem] border-4 border-white bg-white shadow-xl shadow-slate-200/80 sm:h-28 sm:w-28">
                    {company.logoUrl ? (
                      <img
                        src={company.logoUrl}
                        alt=""
                        className="h-full w-full object-contain p-2"
                      />
                    ) : (
                      <span className="text-3xl font-black text-blue-600 sm:text-4xl">
                        {company.name.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-center sm:pb-1 sm:text-left">
                  <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
                    {company.name}
                  </h1>
                  <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-blue-800 ring-1 ring-blue-100">
                      <Briefcase size={12} className="shrink-0" />
                      {company.industry}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-700 ring-1 ring-slate-200/80">
                      <MapPin size={12} className="shrink-0" />
                      {company.location}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:items-end">
                {avgRating && (
                  <div className="flex items-center gap-2 rounded-2xl bg-amber-50 px-4 py-2.5 ring-1 ring-amber-100">
                    <Star size={18} className="fill-amber-400 text-amber-500" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-amber-800/80">
                        Avg. rating
                      </p>
                      <p className="text-lg font-black leading-none text-amber-900">
                        {avgRating}{' '}
                        <span className="text-xs font-bold text-amber-700/80">
                          / 5
                        </span>
                      </p>
                    </div>
                  </div>
                )}
                <Link href="#recent-works" className="w-full sm:w-auto">
                  <Button className="h-12 w-full rounded-2xl bg-linear-to-r from-orange-500 to-orange-600 font-black text-[10px] uppercase tracking-widest text-white shadow-lg shadow-orange-200/50 hover:from-orange-600 hover:to-orange-700 sm:w-auto sm:px-8">
                    Recent works
                    <ExternalLink size={14} className="ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* About — creative block */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-blue-50/80 blur-2xl" />
            <div className="relative flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-200">
                <Sparkles size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-600">
                  Mission &amp; story
                </p>
                <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600 sm:text-base">
                  {company.about}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-dashed border-slate-200 bg-slate-50/80 p-6 text-center sm:p-8 lg:max-w-xs">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              On UniNexus
            </p>
            <p className="mt-2 text-xs font-bold leading-relaxed text-slate-600">
              Campus talent can explore this startup&apos;s gigs and apply with portfolios — all in one place.
            </p>
            <Link href="/startup-connect/browse-gigs" className="mt-4 block">
              <Button
                variant="outline"
                className="w-full rounded-xl border-blue-200 font-black text-[10px] uppercase tracking-widest text-blue-700 hover:bg-blue-50"
              >
                View open gigs <ArrowRight size={14} className="ml-2 inline" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent works (public portfolio) */}
        <StartupRecentWorksSection companyId={company.id} />

        {/* Reviews */}
        <div className="mt-10">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                What students say
              </p>
              <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 sm:text-2xl">
                Reviews
              </h2>
            </div>
            {company.reviews.length > 0 && (
              <p className="text-xs font-bold text-slate-500">
                {company.reviews.length}{' '}
                {company.reviews.length === 1 ? 'review' : 'reviews'}
              </p>
            )}
          </div>

          {company.reviews.length === 0 ? (
            <div className="rounded-[1.75rem] border border-slate-100 bg-linear-to-br from-slate-50 to-white p-8 text-center sm:p-10">
              <p className="text-sm font-black text-slate-700">No public reviews yet</p>
              <p className="mx-auto mt-2 max-w-sm text-xs font-medium text-slate-500">
                Completed collaborations can leave feedback here — check back soon.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {company.reviews.map((review) => (
                <div
                  key={review.id}
                  className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-orange-50 opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="relative flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-slate-100 to-slate-50 text-sm font-black text-slate-600 ring-1 ring-slate-100">
                      {review.customer.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-black text-slate-900">{review.customer}</p>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                          {review.date}
                        </span>
                      </div>
                      <div className="mt-1.5 flex gap-0.5">
                        {[...Array(5)].map((_, idx) => (
                          <Star
                            key={idx}
                            size={14}
                            className={
                              idx < review.rating
                                ? 'fill-amber-400 text-amber-500'
                                : 'fill-slate-100 text-slate-200'
                            }
                          />
                        ))}
                      </div>
                      <p className="mt-3 text-xs font-medium leading-relaxed text-slate-600">
                        &ldquo;{review.comment}&rdquo;
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {COMPANY_UUID_RE.test(company.id) ? (
            <CompanyProfileReviewCta companyId={company.id} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
