import clinicImg1 from '../assets/images/clinic-1.jpg';
import clinicImg2 from '../assets/images/clinic-2.jpg';
import clinicImg3 from '../assets/images/clinic-3.jpg';
import clinicImg4 from '../assets/images/clinic-4.jpg';
import clinicImg5 from '../assets/images/clinic-5.jpg';
import clinicImg6 from '../assets/images/clinic-6.jpg';
import caseImg1 from '../assets/images/case-1.jpg';
import caseImg2 from '../assets/images/case-2.jpg';
import caseImg3 from '../assets/images/case-3.jpg';
import caseImg4 from '../assets/images/case-4.jpg';

export interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'surgical' | 'cosmetic' | 'general';
  badge?: string;
  whatsappText: string;
}

export interface ClinicalCaseItem {
  id: string;
  title: string;
  category: string;
  procedureSummary: string;
  beforeNote: string;
  afterNote: string;
  image: string;
  whatsappInquiry: string;
}

export interface ClinicRoomItem {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  image: string;
  spanClass: string;
}

export const CLINIC_INFO = {
  nameAr: 'عيادة الكحلوت للأسنان',
  nameEn: 'ELKAHLOT DENTAL CLINIC',
  shortCode: 'KDC',
  doctorName: 'د. عبدالرحمن الكحلوت',
  doctorTitle: 'أخصائي جراحة وزراعة وتجميل الأسنان',
  doctorMembership: 'عضو الجمعية المصرية لزراعة الأسنان',
  tagline: 'زراعة وتجميل الفم والأسنان',
  phonePrimary: '01019616260',
  phonePrimaryIntl: '+201019616260',
  phoneWhatsapp: '01006641810',
  phoneWhatsappIntl: '201006641810',
  whatsappDefaultUrl:
    'https://wa.me/201006641810?text=%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%AD%D8%AC%D8%B2%20%D9%83%D8%B4%D9%81',
  addressShort: '٦٤ شارع عبدالعزيز حجازي، التجاريين، جسر السويس',
  addressLandmark: 'بجوار محطة مترو الهايكستب - القاهرة',
  addressFull: '٦٤ شارع عبدالعزيز حجازي، التجاريين، جسر السويس، بجوار محطة مترو الهايكستب - القاهرة',
  mapsUrl:
    'https://www.google.com/maps/place/%D8%B9%D9%8A%D8%A7%D8%AF%D8%A9+%D8%A7%D9%84%D9%83%D8%AD%D9%84%D9%88%D8%AA+%D9%84%D9%84%D8%A7%D8%B3%D9%86%D8%A7%D9%86%E2%80%AD/@30.1434572,31.4008353,19z/data=!4m6!3m5!1s0x145817f20c7771ef:0x448a435c7e12c875!8m2!3d30.1438252!4d31.4007022!16s%2Fg%2F11k9kjqbrd',
  instagramUrl: 'https://www.instagram.com/elkahlot_dental_clinic?srtk=a2I4bmN1bGo1bWU4',
  instagramHandle: '@elkahlot_dental_clinic',
  facebookUrl: 'https://www.facebook.com/share/1DzCcQCesE/',
  // Opens Google's "write a review" box for the clinic's verified Maps listing.
  googleReviewUrl: 'https://g.page/r/CXXIEn5cQ4pEEBM/review',
  // Public Google Maps listing (reviews tab opens from here).
  googleListingUrl: 'https://www.google.com/maps?cid=4938834005896382581',
  vezeetaUrl:
    'https://www.vezeeta.com/ar/dr/%D8%AF%D9%83%D8%AA%D9%88%D8%B1-%D8%B9%D8%A8%D8%AF%D8%A7%D9%84%D8%B1%D8%AD%D9%85%D9%86-%D8%A7%D9%84%D9%83%D8%AD%D9%84%D9%88%D8%AA-%D8%A7%D8%B3%D9%86%D8%A7%D9%86',
} as const;

export function buildWhatsAppUrl(customMessage: string): string {
  const encoded = encodeURIComponent(customMessage.trim());
  return `https://wa.me/${CLINIC_INFO.phoneWhatsappIntl}?text=${encoded}`;
}

export function downloadClinicVCard(): void {
  const vcardLines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${CLINIC_INFO.nameAr} - ${CLINIC_INFO.doctorName}`,
    `ORG:${CLINIC_INFO.nameAr} (${CLINIC_INFO.shortCode})`,
    `TITLE:${CLINIC_INFO.doctorTitle}`,
    `TEL;TYPE=WORK,VOICE:${CLINIC_INFO.phonePrimaryIntl}`,
    `TEL;TYPE=CELL,VOICE:+${CLINIC_INFO.phoneWhatsappIntl}`,
    `ADR;TYPE=WORK:;;${CLINIC_INFO.addressShort} - ${CLINIC_INFO.addressLandmark};القاهرة;;11769;مصر`,
    'URL:https://www.kahlotdental.com/',
    `NOTE:${CLINIC_INFO.doctorTitle} - ${CLINIC_INFO.doctorMembership}`,
    'END:VCARD',
  ].join('\r\n');

  const blob = new Blob([vcardLines], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'ElKahlot-Dental-Clinic-KDC.vcf');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export const SERVICES_LIST: ServiceItem[] = [
  {
    id: 'implants',
    title: 'زراعة الأسنان',
    subtitle: 'تعويض الأسنان المفقودة بغرسات تيتانيوم عالية الثبات تدوم طويلاً بمظهر طبيعي تماماً',
    category: 'surgical',
    badge: 'تخصص دقيق',
    whatsappText: 'مرحباً عيادة د. عبدالرحمن الكحلوت، أريد حجز موعد واستفسار بخصوص زراعة الأسنان',
  },
  {
    id: 'oral-surgery',
    title: 'جراحة الفم والأسنان',
    subtitle: 'إجراءات جراحية دقيقة وآمنة تحت إشراف أخصائي جراحة الفم والأسنان بأعلى معايير التعقيم',
    category: 'surgical',
    whatsappText: 'مرحباً عيادة د. عبدالرحمن الكحلوت، أريد حجز موعد بخصوص جراحة الفم والأسنان',
  },
  {
    id: 'jaw-rehab',
    title: 'إعادة تأهيل الفكين',
    subtitle: 'خطط علاجية متكاملة لاستعادة كفاءة المضغ وتناسق الفكين والابتسامة بالكامل',
    category: 'surgical',
    badge: 'تأهيل شامل',
    whatsappText: 'مرحباً عيادة د. عبدالرحمن الكحلوت، أريد استشارة بخصوص إعادة تأهيل الفكين',
  },
  {
    id: 'hollywood-smile',
    title: 'تجميل الأسنان وابتسامة هوليود',
    subtitle: 'تركيبات الزيركون والإيماكس وعدسات الأسنان التجميلية لتصميم ابتسامة مشرقة ومتناسقة',
    category: 'cosmetic',
    badge: 'الأكثر طلباً',
    whatsappText: 'مرحباً عيادة د. عبدالرحمن الكحلوت، أريد حجز موعد بخصوص تجميل الأسنان وابتسامة هوليود',
  },
  {
    id: 'root-canal',
    title: 'حشو عصب',
    subtitle: 'علاج الجذور والأعصاب بأحدث التقنيات الرقمية للحفاظ على السن الطبيعي بدون ألم',
    category: 'general',
    whatsappText: 'مرحباً عيادة د. عبدالرحمن الكحلوت، أريد حجز موعد كشف بخصوص حشو عصب',
  },
  {
    id: 'regular-filling',
    title: 'حشو عادي',
    subtitle: 'حشوات تجميلية ضوئية (كومبوزيت) مطابقة للون الأسنان الطبيعي بدقة ومتانة عالية',
    category: 'general',
    whatsappText: 'مرحباً عيادة د. عبدالرحمن الكحلوت، أريد حجز موعد بخصوص حشو الأسنان',
  },
  {
    id: 'orthodontics',
    title: 'تقويم الأسنان',
    subtitle: 'تصحيح اصطفاف الأسنان وإطباق الفكين للحصول على ابتسامة صحية ومتوازنة',
    category: 'cosmetic',
    whatsappText: 'مرحباً عيادة د. عبدالرحمن الكحلوت، أريد حجز موعد بخصوص تقويم الأسنان',
  },
  {
    id: 'pediatric',
    title: 'أسنان الأطفال',
    subtitle: 'رعاية طبية لطيفة ومتخصصة لعلاج وحماية أسنان الأطفال في بيئة مريحة ومطمئنة',
    category: 'general',
    whatsappText: 'مرحباً عيادة د. عبدالرحمن الكحلوت، أريد حجز موعد كشف أسنان أطفال',
  },
  {
    id: 'consultation',
    title: 'كشف واستشارة',
    subtitle: 'فحص إكلينيكي شامل وتشخيص دقيق مع شرح خطة العلاج المناسبة لحالتك بالتفصيل',
    category: 'general',
    badge: 'احجز الآن',
    whatsappText: 'مرحباً عيادة د. عبدالرحمن الكحلوت، أريد حجز موعد كشف واستشارة',
  },
];

export const CLINICAL_CASES: ClinicalCaseItem[] = [
  {
    id: 'case-1',
    title: 'إعادة تأهيل وتجميل الفكين بالكامل (ابتسامة متكاملة)',
    category: 'إعادة تأهيل الفكين وابتسامة هوليود',
    procedureSummary: 'استبدال التركيبات القديمة غير المتناسقة وإعادة تأهيل الفكين العلوي والسفلي بتركيبات تجميلية عالية الشفافية وعلاج اللثة لاستعادة التناسق والإطباق المثالي.',
    beforeNote: 'تركيبات علوية قديمة غير متناسقة مع تآكل وتصبغ بالأسنان السفلية وتراجع في اللثة',
    afterNote: 'ابتسامة متكاملة وإطباق متناسق للفكين العلوي والسفلي بلون أبيض طبيعي مشرق',
    image: caseImg1,
    whatsappInquiry: 'مرحباً د. عبدالرحمن، شاهدت الحالة الأولى (إعادة تأهيل وتجميل الفكين بالكامل) وأريد حجز كشف لحالة مشابهة',
  },
  {
    id: 'case-2',
    title: 'إزالة التكلسات الشديدة وتأهيل الأسنان السفلية',
    category: 'علاج لثة وتركيبات تجميلية',
    procedureSummary: 'إزالة تراكمات الجير العميقة والتصبغات الشديدة من الأسنان السفلية مع علاج التهابات اللثة وإعادة بناء الأسنان بتركيبات خزفية ناصعة.',
    beforeNote: 'تراكمات جيرية شديدة جداً وتصبغات مع التهاب حاد في اللثة السفلية',
    afterNote: 'أسنان سفلية نظيفة وناصعة مع استعادة صحة اللثة بالكامل',
    image: caseImg2,
    whatsappInquiry: 'مرحباً د. عبدالرحمن، شاهدت الحالة الثانية (إزالة التكلسات وتأهيل الأسنان السفلية) وأريد الاستفسار عن حالة مشابهة',
  },
  {
    id: 'case-3',
    title: 'تركيبات الزيركون التجميلية للأسنان الأمامية العلوية',
    category: 'تجميل الأسنان الأمامية',
    procedureSummary: 'ترميم الأسنان الأمامية العلوية المكسورة والمتهدمة بتركيبات زيركون دقيقة تحاكي شكل ولون الأسنان الطبيعية مع سد الفراغات.',
    beforeNote: 'كسور وتهدم في الأسنان الأمامية العلوية مع فراغات وعدم تناسق واضح',
    afterNote: 'تناسق تام في شكل وطول ولون الأسنان الأمامية مع انسجام اللثة',
    image: caseImg3,
    whatsappInquiry: 'مرحباً د. عبدالرحمن، شاهدت الحالة الثالثة (تركيبات الزيركون للأسنان الأمامية) وأريد حجز استشارة',
  },
  {
    id: 'case-4',
    title: 'إعادة تأهيل شامل للفك السفلي بالتركيبات الثابتة',
    category: 'إعادة تأهيل الفكين والتركيبات الثابتة',
    procedureSummary: 'تعويض الأسنان المفقودة في الفك السفلي بجسر تعويضي ثابت كامل لاستعادة كفاءة المضغ والمظهر الجمالي الطبيعي.',
    beforeNote: 'فقدان عدد من الأسنان السفلية مع تصبغ وتحضير الدعامات المتبقية',
    afterNote: 'قوس سني سفلي مكتمل وثابت بمظهر طبيعي يعيد الوظيفة الكاملة',
    image: caseImg4,
    whatsappInquiry: 'مرحباً د. عبدالرحمن، شاهدت الحالة الرابعة (إعادة تأهيل الفك السفلي بالتركيبات الثابتة) وأريد حجز موعد كشف',
  },
];

export const CLINIC_ROOMS: ClinicRoomItem[] = [
  {
    id: 'room-6',
    title: 'كاونتر الاستقبال ومنصة تقييم الخدمة',
    subtitle: 'استقبال شامل بمنصة تقييم الخدمة الذكية (Rate Us) وكاونتر تنسيق المواعيد ومقاعد انتظار مريحة.',
    badge: 'الاستقبال الرئيسي',
    image: clinicImg6,
    spanClass: 'md:col-span-2 lg:col-span-7',
  },
  {
    id: 'room-1',
    title: 'غرفة الكشف والعلاج الرئيسية',
    subtitle: 'غرفة علاج مجهزة بأحدث كرسي أسنان طبي ودواليب تعقيم وأدراج منظمة لجميع الأدوات والمعدات الطبية.',
    badge: 'وحدة العلاج المتكاملة',
    image: clinicImg1,
    spanClass: 'md:col-span-1 lg:col-span-5',
  },
  {
    id: 'room-5',
    title: 'مكتب الدكتور وغرفة الاستشارة',
    subtitle: 'مساحة مخصصة تجمع بين كرسي الكشف ومكتب الدكتور لمناقشة خطة العلاج ومراحل الإجراء الطبي بخصوصية تامة.',
    badge: 'مكتب د. عبدالرحمن الكحلوت',
    image: clinicImg5,
    spanClass: 'md:col-span-1 lg:col-span-5',
  },
  {
    id: 'room-4',
    title: 'صالة استراحة المراجعين',
    subtitle: 'صالة انتظار واسعة بكنبة مريحة ومقاعد وثيرة ونجفة عصرية مع كاونتر استقبال لتجربة مريحة ومطمئنة.',
    badge: 'صالة الانتظار',
    image: clinicImg4,
    spanClass: 'md:col-span-2 lg:col-span-7',
  },
  {
    id: 'room-3',
    title: 'منطقة الاستقبال والانتظار',
    subtitle: 'استقبال أنيق بكاونتر خشبي وجدار أخضر مميز مع مقاعد مريحة ومنظومة كمبيوتر لتنسيق المواعيد.',
    badge: 'خدمة المراجعين',
    image: clinicImg3,
    spanClass: 'md:col-span-1 lg:col-span-6',
  },
  {
    id: 'room-2',
    title: 'الممر الداخلي للعيادة',
    subtitle: 'ممر بتصميم معماري حديث بإضاءة LED خطية مدمجة وأرضيات رخامية لامعة تعكس معايير النظافة الفائقة.',
    badge: 'التصميم الداخلي',
    image: clinicImg2,
    spanClass: 'md:col-span-1 lg:col-span-6',
  },
];

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

// Shown on the page (FaqSection) and published as FAQPage structured data at
// build time (scripts/prerender.mjs), so the two always match.
export const FAQ_LIST: FaqItem[] = [
  {
    id: 'location',
    question: 'أين تقع عيادة الكحلوت للأسنان؟',
    answer:
      'العيادة في ٦٤ شارع عبدالعزيز حجازي، التجاريين، جسر السويس، بجوار محطة مترو الهايكستب - القاهرة. ويمكنك فتح موقع العيادة على خرائط جوجل مباشرة من زر الخريطة في الصفحة.',
  },
  {
    id: 'booking',
    question: 'كيف أحجز موعداً في العيادة؟',
    answer:
      'يمكنك الحجز برسالة واتساب على الرقم 01006641810، أو الاتصال بالعيادة على 01019616260، أو الحجز أونلاين عبر صفحة الدكتور على فيزيتا.',
  },
  {
    id: 'insurance',
    question: 'هل العيادة متعاقدة مع التأمين الطبي؟',
    answer:
      'نعم، العيادة متعاقدة مع جميع شركات التأمين الطبي والهيئات والنقابات الحكومية وقطاع البترول. تواصل معنا على واتساب لتأكيد تفاصيل تعاقدك قبل الزيارة.',
  },
  {
    id: 'services',
    question: 'ما الخدمات التي تقدمها العيادة؟',
    answer:
      'زراعة الأسنان، جراحة الفم والأسنان، إعادة تأهيل الفكين، تجميل الأسنان وابتسامة هوليود (زيركون وإيماكس وعدسات)، حشو العصب، الحشو التجميلي، تقويم الأسنان، أسنان الأطفال، والكشف والاستشارة.',
  },
  {
    id: 'doctor',
    question: 'من يعمل في العيادة؟',
    answer:
      'يعمل في العيادة د. عبدالرحمن الكحلوت، أخصائي جراحة وزراعة وتجميل الأسنان وعضو الجمعية المصرية لزراعة الأسنان، ومعه مجموعة من الأخصائيين في كل تخصصات طب الأسنان.',
  },
  {
    id: 'metro',
    question: 'هل العيادة قريبة من المترو؟',
    answer:
      'نعم، العيادة بجوار محطة مترو الهايكستب في جسر السويس، فالوصول إليها سهل بالمترو.',
  },
];

// Opening hours, same as the clinic's Google Business Profile. Keep in sync
// with "openingHoursSpecification" in index.html.
export const OPENING_HOURS = {
  days: 'السبت - الخميس',
  time: '2:00 ظهراً - 10:00 مساءً',
  closed: 'الجمعة: إجازة',
} as const;

export interface PatientReview {
  id: string;
  author: string;
  text: string;
  source: 'google' | 'vezeeta' | 'clinido';
}

// Overall ratings on each booking/review platform, as shown on their pages
// on the date below. Update the numbers and date together.
export const REVIEW_PLATFORMS = {
  checkedOn: 'نوفمبر 2026',
  google: { rating: '4.6', count: 10 },
  vezeeta: { rating: '4.5', count: 12 },
  clinido: { rating: '5.0', count: 2 },
} as const;

export const CLINIDO_URL = 'https://clinido.com/ar/drprofile/1371111/35334';

// Real patient reviews, quoted word for word from the clinic's Google Maps
// listing (first name + initial only). Add new ones the same way; never edit
// or invent review text.
export const PATIENT_REVIEWS: PatientReview[] = [
  {
    id: 'review-wael',
    source: 'google',
    author: 'وائل ي.',
    text: 'تجربة فوق الممتازة بعد معاناة اربع سنوات مع اسناني، دكتور صاحب خبرة ومواكب لكل جديد من خلال استخدام الاجهزة الحديثة الخاصة بطب الأسنان والأهم انه باله طويل وبيوضح تماما خطوات العلاج الى جانب انه الاسعار معقولة جدا بالمقارنة مع تجارب سابقة. بارك الله في علمك وعملك دكتور والشكر موصول ايضا لطاقم العيادة',
  },
  {
    id: 'review-reeman',
    source: 'google',
    author: 'ريمان ع.',
    text: 'نظافة ، تعقيم ، حسن تعامل ، شطااارة ومراعاة من الدكتور ربنا يبارك له',
  },
  {
    id: 'review-basma',
    source: 'google',
    author: 'بسمة أ.',
    text: 'دكتور ممتاااز والله والعيادة نضيفة واسعاره كويسة جدا والمعاملة ممتازة',
  },
  {
    id: 'review-mohanad',
    source: 'google',
    author: 'مهند أ.',
    text: 'ممتاز وشاطر وامين',
  },
  {
    id: 'review-menna',
    source: 'google',
    author: 'منة أ.',
    text: 'خدمة ممتازة ودكتور شاطر♥️',
  },
  {
    id: 'review-maha-clinido',
    source: 'clinido',
    author: 'مها ح.',
    text: 'دكتور ممتاز',
  },
  {
    id: 'review-mohamed-vezeeta',
    source: 'vezeeta',
    author: 'محمد ع.',
    text: 'دكتور كويس',
  },
];

// Nearby areas our patients come from (shown in the location section and
// published as areaServed). Keep it to areas that really are close by.
export const SERVED_AREAS: string[] = [
  'التجاريين',
  'جسر السويس',
  'شارع جمال عبدالناصر',
  'مدينة قباء',
  'مدينة السلام',
  'الهايكستب',
  'شيراتون',
  'مدينة نصر',
  'مدينة العبور',
  'مصر الجديدة',
  'عين شمس',
];
