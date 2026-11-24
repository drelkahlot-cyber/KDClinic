import React from 'react';
import { MessageCircle, Phone, MapPin, CalendarCheck, CheckCircle2, ArrowUpLeft, HelpCircle, Home } from 'lucide-react';
import { CLINIC_INFO, SERVICES_LIST, OPENING_HOURS, buildWhatsAppUrl } from '../data/clinicData';
import { SERVICE_PAGES, ServicePageData, servicePath } from '../data/servicePages';

/**
 * Landing page for one service (Arabic only), e.g. /services/dental-implants/.
 * Rendered inside the normal page shell (header, footer, mobile action bar).
 */
export const ServicePage: React.FC<{ page: ServicePageData }> = ({ page }) => {
  const service = SERVICES_LIST.find((s) => s.id === page.serviceId);
  const whatsappHref = service ? buildWhatsAppUrl(service.whatsappText) : CLINIC_INFO.whatsappDefaultUrl;
  const others = SERVICE_PAGES.filter((p) => p.slug !== page.slug);

  return (
    <article className="py-6 sm:py-10">
      {/* Breadcrumb */}
      <nav aria-label="مسار الصفحة" className="text-xs sm:text-sm text-[var(--muted)] mb-4">
        <a href="/" className="inline-flex items-center gap-1 hover:text-[var(--brand)]">
          <Home className="w-3.5 h-3.5" />
          <span>{CLINIC_INFO.nameAr}</span>
        </a>
        <span className="mx-2">/</span>
        <span className="text-[var(--ink)] font-bold">{page.h1}</span>
      </nav>

      <header className="rounded-3xl p-6 sm:p-8 bg-[var(--surface)] border border-[var(--line)] shadow-[var(--card-shadow)] relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-l from-[#0F5C6E] via-[#C9A227] to-[#1E9E55]" />
        <h1 className="text-2xl sm:text-4xl font-black text-[var(--ink)] leading-snug">{page.h1}</h1>
        <p className="mt-2 text-sm sm:text-base font-bold text-[var(--brand)]">
          {CLINIC_INFO.doctorName} — {CLINIC_INFO.doctorTitle}
        </p>
        <div className="mt-4 space-y-3 text-sm sm:text-base text-[var(--ink)] leading-relaxed">
          {page.intro.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#1E9E55] hover:bg-[#178044] text-white font-extrabold text-sm shadow-sm transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span>احجز على واتساب</span>
          </a>
          <a
            href={`tel:${CLINIC_INFO.phonePrimary}`}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[var(--brand)] text-[var(--brand-ink)] font-extrabold text-sm shadow-sm"
          >
            <Phone className="w-4 h-4" />
            <span className="font-num" dir="ltr">{CLINIC_INFO.phonePrimary}</span>
          </a>
          <a
            href={CLINIC_INFO.vezeetaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#0066BE] hover:bg-[#00529B] text-white font-extrabold text-sm shadow-sm transition"
          >
            <CalendarCheck className="w-4 h-4" />
            <span>فيزيتا</span>
          </a>
          <a
            href={CLINIC_INFO.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)] font-extrabold text-sm"
          >
            <MapPin className="w-4 h-4 text-[var(--brand)]" />
            <span>موقع العيادة</span>
          </a>
        </div>
      </header>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <section className="rounded-3xl p-6 bg-[var(--surface)] border border-[var(--line)] shadow-[var(--card-shadow)]">
          <h2 className="text-lg sm:text-xl font-black text-[var(--ink)]">{page.whenTitle}</h2>
          <ul className="mt-3 space-y-2">
            {page.when.map((w) => (
              <li key={w} className="flex items-start gap-2 text-sm sm:text-base text-[var(--ink)]">
                <CheckCircle2 className="w-4 h-4 mt-1 text-[#1E9E55] shrink-0" />
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl p-6 bg-[var(--surface)] border border-[var(--line)] shadow-[var(--card-shadow)]">
          <h2 className="text-lg sm:text-xl font-black text-[var(--ink)]">خطوات العلاج في العيادة</h2>
          <ol className="mt-3 space-y-2">
            {page.steps.map((s, i) => (
              <li key={s} className="flex items-start gap-3 text-sm sm:text-base text-[var(--ink)]">
                <span className="w-6 h-6 rounded-full bg-[var(--brand)] text-[var(--brand-ink)] text-xs font-black flex items-center justify-center shrink-0 font-num">
                  {i + 1}
                </span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {page.relatedCase && (
        <figure className="mt-6 kdc-case-frame rounded-3xl p-4 sm:p-6 text-white">
          <img
            src={page.relatedCase.image}
            alt={page.relatedCase.caption}
            loading="lazy"
            decoding="async"
            className="w-full rounded-2xl border border-[#D4AF37]/50"
          />
          <figcaption className="mt-3 text-sm font-bold text-[#F3D87D]">{page.relatedCase.caption}</figcaption>
        </figure>
      )}

      <section className="mt-6" aria-labelledby="service-faq-heading">
        <h2 id="service-faq-heading" className="text-lg sm:text-xl font-black text-[var(--ink)] flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[var(--brand)]" />
          <span>أسئلة شائعة</span>
        </h2>
        <div className="mt-3 grid gap-2.5">
          {page.faqs.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl bg-[var(--surface)] border border-[var(--line)] open:border-[var(--brand)]"
            >
              <summary className="cursor-pointer list-none p-4 text-sm sm:text-base font-extrabold text-[var(--ink)] [&::-webkit-details-marker]:hidden">
                <h3>{f.q}</h3>
              </summary>
              <p className="px-4 pb-4 text-sm text-[var(--muted)] leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-3xl p-6 bg-[var(--surface)] border border-[var(--line)]">
        <h2 className="text-base sm:text-lg font-black text-[var(--ink)]">العنوان والمواعيد</h2>
        <p className="mt-2 text-sm sm:text-base text-[var(--ink)]">{CLINIC_INFO.addressFull}</p>
        <p className="mt-1 text-sm text-[var(--muted)]">
          {OPENING_HOURS.days}: {OPENING_HOURS.time} — {OPENING_HOURS.closed}
        </p>
      </section>

      <nav aria-label="خدمات أخرى" className="mt-6">
        <h2 className="text-base sm:text-lg font-black text-[var(--ink)]">خدمات أخرى في العيادة</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {others.map((o) => (
            <a
              key={o.slug}
              href={servicePath(o.slug)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--surface)] border border-[var(--line)] hover:border-[var(--brand)] text-xs sm:text-sm font-bold text-[var(--ink)] transition"
            >
              <span>{o.h1.replace(' في جسر السويس', '')}</span>
              <ArrowUpLeft className="w-3.5 h-3.5" />
            </a>
          ))}
          <a
            href="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--brand)] text-[var(--brand-ink)] text-xs sm:text-sm font-bold"
          >
            <Home className="w-3.5 h-3.5" />
            <span>الصفحة الرئيسية للعيادة</span>
          </a>
        </div>
      </nav>
    </article>
  );
};
