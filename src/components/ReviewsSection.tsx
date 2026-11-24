import React from 'react';
import { Star, Quote, ArrowUpLeft } from 'lucide-react';
import { CLINIC_INFO, PATIENT_REVIEWS, PatientReview } from '../data/clinicData';
import { useT } from '../i18n';

/**
 * Real patient reviews quoted from the clinic's Google Maps listing, plus
 * links to read all reviews and to leave one. No ratings are shown here on
 * purpose: the live numbers are on Google and change over time.
 */
export const ReviewsSection: React.FC = () => {
  const t = useT();
  return (
    <section id="reviews" aria-labelledby="reviews-heading" className="py-8 sm:py-12 scroll-mt-24">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/35 text-[#9A740C] dark:text-[#F3D87D] text-xs font-extrabold mb-2.5">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{t("تقييمات حقيقية على جوجل")}</span>
          </div>
          <h2
            id="reviews-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[var(--ink)]"
          >{t("آراء مرضانا")}</h2>
        </div>
        <a
          href={CLINIC_INFO.googleListingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[var(--brand)] bg-[var(--surface)] px-3.5 py-2 rounded-xl border border-[var(--line)] hover:border-[var(--brand)] transition shrink-0"
        >
          <span>{t("اقرأ كل التقييمات على جوجل")}</span>
          <ArrowUpLeft className="w-4 h-4" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5">
        {PATIENT_REVIEWS.map((review: PatientReview) => (
          <figure
            key={review.id}
            className="rounded-2xl p-5 sm:p-6 bg-[var(--surface)] border border-[var(--line)] shadow-[var(--card-shadow)] flex flex-col justify-between"
          >
            <Quote className="w-6 h-6 text-[#C9A227] mb-2" aria-hidden="true" />
            <blockquote className="text-sm sm:text-base text-[var(--ink)] leading-relaxed" lang="ar" dir="rtl">
              {review.text}
            </blockquote>
            <figcaption className="mt-4 pt-3 border-t border-[var(--line)] text-xs sm:text-sm font-extrabold text-[var(--muted)]">
              {t(review.author)} · {t("مراجعة على خرائط جوجل")}
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-5 text-center">
        <a
          href={CLINIC_INFO.googleReviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#C9A227] hover:bg-[#B08C1C] text-[#1A1405] font-extrabold text-sm shadow-sm transition"
        >
          <Star className="w-4 h-4 fill-current" />
          <span>{t("قيّم زيارتك على جوجل")}</span>
        </a>
      </div>
    </section>
  );
};
