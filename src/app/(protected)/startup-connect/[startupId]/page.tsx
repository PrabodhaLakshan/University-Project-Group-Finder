import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { COMPANY_DETAILS } from '@/app/modules/startup-connect/constants/company-details';

type StartupDetailsPageProps = {
  params: Promise<{ startupId: string }>;
};

export default async function StartupDetailsPage({ params }: StartupDetailsPageProps) {
  const { startupId } = await params;
  const company = COMPANY_DETAILS[startupId];

  if (!company) {
    return (
      <div className="mt-24 max-w-3xl mx-auto px-6">
        <div className="rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-black uppercase text-slate-900">Startup not found</h1>
          <p className="text-sm font-medium text-slate-500 mt-3">This company profile is not available right now.</p>
          <Link href="/startup-connect/browse-gigs">
            <Button className="mt-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase tracking-widest">
              Back to Browse Gigs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-24 max-w-5xl mx-auto px-6 pb-12">
      <div className="rounded-[32px] border border-slate-100 bg-white p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl border border-slate-200 bg-white overflow-hidden flex items-center justify-center shrink-0">
              {company.logoUrl ? (
                <img src={company.logoUrl} alt={`${company.name} logo`} className="w-11 h-11 object-contain" />
              ) : (
                <span className="text-lg font-black text-slate-500">{company.name.charAt(0)}</span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase text-slate-900 tracking-tight">{company.name}</h1>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mt-1">
                {company.industry} • {company.location}
              </p>
            </div>
          </div>

          <Link href="/startup-connect/my-projects">
            <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase tracking-widest">
              Recente works <ArrowRight size={14} className="ml-2" />
            </Button>
          </Link>
        </div>

        <div className="mt-6">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Company Details</p>
          <p className="text-sm text-slate-600 font-medium leading-relaxed">{company.about}</p>
        </div>

        <div className="mt-8">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Customer Reviews</p>
          <div className="space-y-3">
            {company.reviews.map((review) => (
              <div key={review.id} className="rounded-2xl border border-slate-100 p-4 bg-slate-50/60">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-black text-slate-900">{review.customer}</p>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{review.date}</span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(review.rating)].map((_, idx) => (
                    <Star key={idx} size={13} className="text-orange-500 fill-orange-500" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 font-medium">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}