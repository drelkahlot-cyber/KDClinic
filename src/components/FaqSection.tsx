import React from 'react';
import { useT } from '../i18n';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { FAQ_LIST, FaqItem } from '../data/clinicData';

/**
 * Common patient questions. Uses native <details> so every answer is in the
 * HTML (readable by search engines) and works without JavaScript.
 */
export const FaqSection: React.FC = () => {
  const t = useT();
  return (
    <section id="faq" aria-labelledby="faq-heading" className="py-8 sm:py-12 scroll-mt-24">
      <div className="mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F5C6E]/10 dark:bg-[#2AA6BE]/15 border border-[#0F5C6E]/20 dark:border-[#2AA6BE]/30 text-[#0F5C6E] dark:text-[#2AA6BE] text-xs font-extrabold mb-2.5">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{t("أسئلة المرضى")}</span>
        </div>
        <h2
          id="faq-heading"
          className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[var(--ink)]"
        >{t("الأسئلة الشائعة عن عيادة الكحلوت للأسنان")}</h2>
      </div>

      <div className="grid gap-2.5 sm:gap-3">
        {FAQ_LIST.map((item: FaqItem) => (
          <details
            key={item.id}
            className="group rounded-2xl bg-[var(--surface)] border border-[var(--line)] shadow-[var(--card-shadow)] open:border-[var(--brand)] transition-colors"
          >
            <summary className="flex items-center justify-between gap-3 cursor-pointer list-none p-4 sm:p-5 text-sm sm:text-base font-extrabold text-[var(--ink)] [&::-webkit-details-marker]:hidden">
              <h3 className="leading-snug">{t(item.question)}</h3>
              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 shrink-0 text-[var(--muted)] transition-transform group-open:rotate-180" />
            </summary>
            <p className="px-4 pb-4 sm:px-5 sm:pb-5 -mt-1 text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
              {t(item.answer)}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
};
