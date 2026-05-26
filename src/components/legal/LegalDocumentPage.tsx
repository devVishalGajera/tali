import Link from "next/link";
import { getTermsApi } from "@/lib/api/guest";

interface Props {
  eyebrow:     string;
  title:       string;
  description: string;
}

function formatDate(raw?: string): string | null {
  if (!raw) return null;
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", {
    day:   "numeric",
    month: "long",
    year:  "numeric",
  });
}

const LegalDocumentPage = async ({ eyebrow, title, description }: Props) => {
  const data = await getTermsApi();
  const html = data?.term ?? "";
  const lastUpdated = formatDate(data?.updated_at);

  return (
    <main className="w-full bg-[#FAFAFA] min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#006B4D] to-[#00513A] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-16 lg:py-20">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-white/70 mb-3">
            {eyebrow}
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-3xl">
            {description}
          </p>
          {lastUpdated && (
            <p className="text-xs text-white/60 mt-5">Last updated: {lastUpdated}</p>
          )}
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-10 md:py-14">
        <article className="bg-white border border-[#E8E8E8] rounded-2xl p-5 sm:p-8 md:p-10">
          {html ? (
            <div
              className="
                [&_p]:text-sm sm:[&_p]:text-[15px] [&_p]:text-[#1D1D1D] [&_p]:leading-relaxed [&_p]:mb-3
                [&_strong]:font-semibold [&_strong]:text-[#1D1D1D]
                [&_b]:font-semibold [&_b]:text-[#1D1D1D]
                [&_em]:italic
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3 [&_ul]:text-sm sm:[&_ul]:text-[15px] [&_ul]:text-[#1D1D1D] [&_ul]:leading-relaxed [&_ul]:space-y-1.5 [&_li]:marker:text-[#006B4D]
                [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-3 [&_ol]:text-sm sm:[&_ol]:text-[15px] [&_ol]:text-[#1D1D1D] [&_ol]:leading-relaxed [&_ol]:space-y-1.5
                [&_a]:text-[#006B4D] [&_a]:underline hover:[&_a]:no-underline [&_a]:break-words
                [&_h1]:text-2xl sm:[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-[#1D1D1D] [&_h1]:mt-8 [&_h1]:mb-4 first:[&_h1]:mt-0
                [&_h2]:text-xl sm:[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#1D1D1D] [&_h2]:mt-7 [&_h2]:mb-3
                [&_h3]:text-lg sm:[&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#1D1D1D] [&_h3]:mt-6 [&_h3]:mb-2
                [&_h4]:text-base sm:[&_h4]:text-lg [&_h4]:font-bold [&_h4]:text-[#1D1D1D] [&_h4]:mt-5 [&_h4]:mb-2
                [&_table]:w-full [&_table]:text-sm [&_table]:my-4 [&_th]:text-left [&_th]:font-semibold [&_th]:p-2 [&_th]:border [&_th]:border-[#E8E8E8] [&_td]:p-2 [&_td]:border [&_td]:border-[#E8E8E8] [&_td]:align-top
                [&_blockquote]:border-l-4 [&_blockquote]:border-[#006B4D]/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-3
                [&_br]:block [&_br]:my-1
              "
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-12 h-12 rounded-full bg-[#006B4D]/10 text-[#006B4D] flex items-center justify-center mb-4">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-[#1D1D1D] mb-2">Content unavailable</h2>
              <p className="text-sm text-[#1D1D1D80] max-w-md mx-auto">
                We couldn&apos;t load this content right now. Please try again in a few
                moments, or reach out to our support team if the issue persists.
              </p>
            </div>
          )}

          {/* CTA */}
          <div className="mt-10 pt-8 border-t border-[#F0F0F0]">
            <p className="text-sm text-[#1D1D1D80] mb-3">
              Have questions about this policy?
            </p>
            <Link
              href="/support"
              className="inline-flex items-center gap-2 bg-[#006B4D] hover:bg-[#005a3f] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              Contact Customer Support
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
};

export default LegalDocumentPage;
