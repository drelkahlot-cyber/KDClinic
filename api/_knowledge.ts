/**
 * What the website chat bot knows about the clinic, and its quick answers.
 *
 * Keep in sync with src/data/clinicData.ts (CLINIC_INFO, OPENING_HOURS,
 * FAQ_LIST, SERVICES_LIST). It is copied here because clinicData.ts imports
 * images, which a server function cannot load.
 *
 * Files in /api whose names start with "_" are not routes on Vercel.
 */

export const WHATSAPP = '01006641810';
export const WHATSAPP_URL = 'https://wa.me/201006641810';
export const PHONE = '01019616260';

export const CLINIC_FACTS = `
- الاسم: عيادة الكحلوت للأسنان (ELKAHLOT DENTAL CLINIC - KDC). الموقع: www.kahlotdental.com
- الدكتور: د. عبدالرحمن الكحلوت، أخصائي جراحة وزراعة وتجميل الأسنان، عضو الجمعية المصرية لزراعة الأسنان. ومعه أخصائيين في كل تخصصات الأسنان.
- العنوان: ٦٤ شارع عبدالعزيز حجازي، التجاريين، جسر السويس، بجوار محطة مترو الهايكستب - القاهرة. خريطة جوجل: https://www.google.com/maps?cid=4938834005896382581
- المواعيد: السبت للخميس من 2 الضهر لـ 10 بالليل. الجمعة إجازة.
- الحجز: واتساب ${WHATSAPP} (${WHATSAPP_URL})، أو تليفون ${PHONE}، أو أونلاين على فيزيتا.
- التأمين: العيادة متعاقدة مع شركات التأمين الطبي والهيئات والنقابات الحكومية وقطاع البترول. المريض يبعت واتساب باسم جهته عشان نأكد تفاصيل تعاقده قبل الزيارة.
- الخدمات: زراعة الأسنان، جراحة الفم والأسنان، خلع ضرس العقل، إعادة تأهيل الفكين، تجميل الأسنان وابتسامة هوليود (زيركون وإيماكس وعدسات)، حشو العصب، الحشو التجميلي (كومبوزيت)، تنضيف الجير وعلاج اللثة، تقويم الأسنان، أسنان الأطفال، والكشف والاستشارة.
- مناطق قريبة بيجي منها مرضى: التجاريين، جسر السويس، الهايكستب، مدينة قباء، مدينة السلام، شيراتون، مدينة نصر، العبور، مصر الجديدة، النزهة، عين شمس. وبيجيلنا مرضى من كل المحافظات ومن برّه مصر.
- الأسعار: الموقع ما بيكتبش أسعار، لأن السعر بيتحدد بعد الكشف حسب الحالة. للسعر التقريبي يبعت واتساب.
`.trim();

export function systemPrompt(lang: 'ar' | 'en'): string {
  return `
You are the website assistant of a dental clinic in Cairo. You answer visitors' questions about the clinic and help them book.

Clinic facts (the ONLY facts you may state):
${CLINIC_FACTS}

Rules:
1. Reply in ${lang === 'en' ? 'English' : 'friendly Egyptian Arabic (عامية مصرية)'}; if the visitor writes in another language, reply in theirs.
2. Keep replies short: 1 to 4 sentences.
3. Never invent prices, discounts, offers, doctor names, insurers or opening times. If you don't know, say so and point to WhatsApp ${WHATSAPP}.
4. Never diagnose, prescribe medicine or doses, or say whether a treatment fits the visitor. You may explain in general terms what a treatment is. For their own case: "the doctor decides after the examination", and suggest booking.
5. Severe pain, swelling of the face, bleeding that won't stop, trauma or trouble breathing: tell them to call ${PHONE} now, or go to the nearest emergency department if the clinic is closed.
6. Don't ask for names, phone numbers or medical details. If they want to book, send them to WhatsApp ${WHATSAPP_URL} or the phone ${PHONE}.
7. Only talk about the clinic and dental topics. Politely decline anything else.
8. Plain text only, no markdown, no lists.
`.trim();
}

interface QuickAnswer {
  keys: RegExp;
  ar: string;
  en: string;
}

/** Answers used when the AI is not set up, is over its free quota, or fails. */
const QUICK_ANSWERS: QuickAnswer[] = [
  {
    keys: /مواعيد|ميعاد|امتى|إمتى|مفتوح|بتفتح|بتقفل|الجمعة|ساعة|hours|open|close|friday|time/i,
    ar: 'مواعيدنا السبت للخميس من 2 الضهر لـ 10 بالليل، والجمعة إجازة.',
    en: 'We are open Saturday to Thursday, 2 PM to 10 PM. Closed on Fridays.',
  },
  {
    keys: /عنوان|مكان|فين|موقع|مترو|خريطة|location|address|where|metro|map/i,
    ar: 'العيادة في ٦٤ شارع عبدالعزيز حجازي، التجاريين، جسر السويس، جنب محطة مترو الهايكستب. الخريطة: https://www.google.com/maps?cid=4938834005896382581',
    en: 'We are at 64 Abdelaziz Hegazy St, El Tegareyeen, Gesr El Suez, next to El Haykestep metro station, Cairo. Map: https://www.google.com/maps?cid=4938834005896382581',
  },
  {
    keys: /تأمين|تامين|نقابة|نقابه|بترول|هيئة|insurance|syndicate/i,
    ar: `أيوه، العيادة متعاقدة مع شركات التأمين الطبي والهيئات والنقابات الحكومية وقطاع البترول. ابعتلنا اسم جهتك على واتساب ${WHATSAPP} ونأكدلك التفاصيل قبل الزيارة.`,
    en: `Yes, the clinic works with medical insurance companies, government bodies, syndicates and the petroleum sector. Send us the name of yours on WhatsApp ${WHATSAPP} and we will confirm the details before your visit.`,
  },
  {
    keys: /سعر|أسعار|اسعار|بكام|تكلفة|كام|price|cost|how much/i,
    ar: `السعر بيتحدد بعد الكشف حسب حالتك. ابعتلنا على واتساب ${WHATSAPP} ونقولك السعر التقريبي.`,
    en: `The price depends on your case and is set after the examination. Message us on WhatsApp ${WHATSAPP} for an estimate.`,
  },
  {
    keys: /حجز|احجز|أحجز|book|appointment|reserve/i,
    ar: `تقدر تحجز على واتساب ${WHATSAPP_URL} أو تتصل على ${PHONE}.`,
    en: `You can book on WhatsApp ${WHATSAPP_URL} or call ${PHONE}.`,
  },
  {
    keys: /خدمات|بتعملوا|زراعة|تجميل|تقويم|عصب|حشو|خلع|عقل|أطفال|اطفال|تنضيف|تنظيف|جير|services|implant|veneer|braces|root canal|filling|extraction|cleaning/i,
    ar: `بنعمل زراعة الأسنان، والجراحة وخلع ضرس العقل، وتجميل الأسنان وابتسامة هوليود، وحشو العصب والحشو التجميلي، وتنضيف الجير، والتقويم، وأسنان الأطفال. للتفاصيل ابعتلنا واتساب ${WHATSAPP}.`,
    en: `We offer dental implants, oral surgery and wisdom tooth removal, cosmetic dentistry and Hollywood smile, root canal and white fillings, scaling and gum care, orthodontics and kids' dentistry. Message us on WhatsApp ${WHATSAPP} for details.`,
  },
  {
    keys: /(?:^|\s)(?:ال)?[أا]لم(?:\s|$)|وجع|بيوجع|(?:^|\s)ورم|وارم|نزيف|طوارئ|\bpain|\bhurt|swell|bleed|emergenc/i,
    ar: `لو الألم شديد أو في ورم أو نزيف، اتصل بينا دلوقتي على ${PHONE}. ولو العيادة قافلة، روح أقرب طوارئ.`,
    en: `If the pain is severe or you have swelling or bleeding, call us now on ${PHONE}. If the clinic is closed, go to the nearest emergency department.`,
  },
];

export function quickAnswer(text: string, lang: 'ar' | 'en'): string {
  const hit = QUICK_ANSWERS.find((q) => q.keys.test(text));
  if (hit) return hit[lang];
  return lang === 'en'
    ? `I can't answer that here. Please message us on WhatsApp ${WHATSAPP} or call ${PHONE}.`
    : `مش هقدر أجاوب على ده هنا. ابعتلنا على واتساب ${WHATSAPP} أو اتصل على ${PHONE} وهنرد عليك.`;
}
