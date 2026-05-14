import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  ar: {
    translation: {
      "nav": {
        "home": "الرئيسية",
        "services": "خدماتنا",
        "gallery": "معرض الأعمال",
        "about": "من نحن",
        "contact": "تواصل معنا",
        "brand": "عبادي",
        "go_to_site": "الذهاب إلى الموقع"
      },
      "hero": {
        "title": "مطابخ وخزائن عصرية تناسب ذوقك",
        "subtitle": "صمم مطبخك وخزائنك بأحدث التصاميم العالمية مع أفضل جودة وأسعار منافسة.",
        "cta_consult": "احجز استشارة مجانية",
        "cta_gallery": "تصفح معرض الأعمال"
      },
      "features": {
        "title": "لماذا نحن الأفضل؟",
        "subtitle": "نقدم لك تجربة استثنائية من التصميم حتى التركيب.",
        "design": {
          "title": "قياس وتصميم مجاني",
          "desc": "نأتي إلى منزلك لأخذ القياسات الدقيقة وتقديم تصاميم ثلاثية الأبعاد مجاناً."
        },
        "diversity": {
          "title": "تصاميم متنوعة",
          "desc": "مجموعة واسعة من التصاميم الكلاسيكية والعصرية لتناسب جميع الأذواق."
        },
        "quality": {
          "title": "مواد عالية الجودة",
          "desc": "نستخدم أفضل أنواع الخشب والإكسسوارات من الشركات العالمية المعروفة."
        },
        "warranty": {
          "title": "ضمان 5 سنوات",
          "desc": "ضمان شامل على جميع المنتجات وخدمة ما بعد البيع الممتازة."
        }
      },
      "specialties": {
        "title": "خدماتنا",
        "subtitle": "نحن خبراء في تحويل رؤيتك إلى واقع ملموس في كل زاوية من منزلك.",
        "kitchens": {
          "title": "المطابخ العصرية",
          "list": ["تصاميم حديثة ومبتكرة", "مساحات تخزين ذكية", "إكسسوارات ألمانية"]
        },
        "cabinets": {
          "title": "الخزائن والدواليب",
          "list": ["تنظيم مثالي للملابس", "أبواب انزلاقية فاخرة", "إضاءة LED داخلية"]
        },
        "offices": {
          "title": "مكاتب ورفوف",
          "list": ["تصميم مريح للعمل", "تنظيم ذكي للملفات", "أسلوب عصري وبسيط"]
        },
        "laundry": {
          "title": "غرف غسيل وحمامات",
          "list": ["خامات مقاومة للرطوبة", "استغلال مثالي للمساحات", "تنظيم ذكي للمنظفات"]
        }
      },
      "portfolio": {
        "badge": "إبداعاتنا",
        "title": "معرض أعمالنا",
        "subtitle": "نحن لا نصنع الأثاث، نحن نشكل المساحات لتناسب أحلامك.",
        "tabs": {
          "kitchen": "مطابخ",
          "cabinet": "خزائن",
          "office": "مكاتب",
          "laundry": "حمامات",
          "kitchen_plural": "المطابخ",
          "cabinet_plural": "الخزائن",
          "office_plural": "المكاتب",
          "laundry_plural": "الحمامات"
        },
        "view_all": "عرض كل مشاريع",
        "no_details": "لا توجد تفاصيل إضافية لهذا العمل حالياً.",
        "contact_us": "تواصل معنا",
        "empty_category": "قريباً سيتم إضافة أعمال جديدة في هذا القسم."
      },
      "comparison": {
        "title": "نتائج مذهلة",
        "subtitle": "شاهد كيف نقوم بتحويل المساحات القديمة إلى تحف فنية عصرية.",
        "before": "قبل التجديد",
        "after": "بعد التجديد",
        "empty": "سيتم إضافة مقارنات قبل وبعد قريباً."
      },
      "contact": {
        "title": "تواصل معنا",
        "subtitle": "هل أنت جاهز للبدء؟ تواصل معنا اليوم لتحصل على استشارة مجانية.",
        "info": {
          "phone": "اتصل بنا",
          "email": "البريد الإلكتروني",
          "address": "موقعنا",
          "addressValue": "القدس"
        },
        "form": {
          "name": "الاسم الكامل",
          "phone": "رقم الجوال",
          "service": "اختر نوع الخدمة المطلوبة",
          "service_kitchen": "مطابخ",
          "service_cabinet": "خزائن ملابس",
          "service_office": "مكاتب",
          "service_laundry": "غرف غسيل وحمامات",
          "service_renovation": "تجديد وصيانة",
          "message": "كيف يمكننا مساعدتك؟",
          "submit": "إرسال الطلب",
          "submitting": "جاري الإرسال...",
          "alert_fill": "يرجى ملء الاسم ورقم الجوال على الأقل.",
          "error": "فشل إرسال الطلب، يرجى المحاولة لاحقاً."
        }
      },
      "about": {
        "title": "من نحن",
        "desc1": "مصنع متخصص في تصميم وتصنيع المطابخ حسب الطلب، بخبرة تمتد لـ ٢٦ عامًا في هذا المجال. نتميز بتصميم وتخطيط وتصنيع مطابخ عالية الجودة مع الاهتمام بأدق التفاصيل، باستخدام أفضل المواد، وتقديم خدمة شخصية مميزة لكل عميل. على مر السنين، أنجزنا مئات المشاريع الناجحة التي تجمع بين الابتكار والعملية والتصميم الرائع، والمصممة خصيصًا لتلبية احتياجات عملائنا.",
        "desc2": "",
        "stats": {
          "years": "سنوات خبرة",
          "projects": "مشروع مكتمل"
        }
      },
      "gallery_page": {
        "badge": "معرض الأعمال الشامل",
        "title": "إبداعات عبادي في تصميم الأخشاب",
        "subtitle": "استلهم فكرة مطبخك القادم من خلال تصفح مجموعتنا الواسعة من الموديلات والأنماط.",
        "filters": {
          "all": "الكل",
          "kitchen": "مطابخ",
          "cabinet": "خزائن",
          "office": "مكاتب",
          "laundry": "غسيل وحمامات"
        },
        "pagination": {
          "prev": "السابق",
          "next": "التالي"
        },
        "lightbox": {
          "no_details": "لا توجد تفاصيل إضافية لهذا العمل حالياً.",
          "inquiry": "استفسر عن هذا العمل"
        },
        "back_home": "العودة للرئيسية"
      },
      "results_page": {
        "badge": "قبل وبعد",
        "title": "نتائج مذهلة وتجديدات كاملة",
        "subtitle": "شاهد كيف نقوم بتحويل المساحات القديمة إلى تحف فنية عصرية تلبي احتياجات عملائنا.",
        "back_home": "العودة للرئيسية"
      },
      "footer": {
        "copyright": "© 2026 شركة قِطَاف للتكنولوجيا. جميع الحقوق محفوظة."
      }
    }
  },
  en: {
    translation: {
      "nav": {
        "home": "Home",
        "services": "Services",
        "gallery": "Gallery",
        "about": "About Us",
        "contact": "Contact Us",
        "brand": "Abadi",
        "go_to_site": "Go to Site"
      },
      "hero": {
        "title": "Modern Kitchens & Cabinets to Suit Your Taste",
        "subtitle": "Design your kitchen and cabinets with the latest international designs with the best quality and competitive prices.",
        "cta_consult": "Book a Free Consultation",
        "cta_gallery": "Browse Gallery"
      },
      "features": {
        "title": "Why Are We the Best?",
        "subtitle": "We offer an exceptional experience from design to installation.",
        "design": {
          "title": "Free Measurement & Design",
          "desc": "We come to your home for accurate measurements and provide free 3D designs."
        },
        "diversity": {
          "title": "Diverse Designs",
          "desc": "A wide range of classic and modern designs to suit all tastes."
        },
        "quality": {
          "title": "High Quality Materials",
          "desc": "We use the best types of wood and accessories from well-known international companies."
        },
        "warranty": {
          "title": "5 Year Warranty",
          "desc": "Comprehensive warranty on all products and excellent after-sales service."
        }
      },
      "specialties": {
        "title": "Our Specialties",
        "subtitle": "We are experts in turning your vision into reality in every corner of your home.",
        "kitchens": {
          "title": "Modern Kitchens",
          "list": ["Modern & Innovative Designs", "Smart Storage Spaces", "German Accessories"]
        },
        "cabinets": {
          "title": "Cabinets & Closets",
          "list": ["Perfect Clothing Organization", "Premium Sliding Doors", "Internal LED Lighting"]
        },
        "offices": {
          "title": "Offices & Shelving",
          "list": ["Ergonomic Work Design", "Smart File Organization", "Modern & Simple Style"]
        },
        "laundry": {
          "title": "Laundry Rooms & Bathrooms",
          "list": ["Moisture Resistant Materials", "Perfect Space Utilization", "Smart Detergent Organization"]
        }
      },
      "portfolio": {
        "badge": "Our Creations",
        "title": "Our Works Gallery",
        "subtitle": "We don’t just make furniture, we shape spaces to fit your dreams.",
        "tabs": {
          "kitchen": "Kitchens",
          "cabinet": "Cabinets",
          "office": "Offices",
          "laundry": "Bathrooms",
          "kitchen_plural": "Kitchen",
          "cabinet_plural": "Cabinet",
          "office_plural": "Office",
          "laundry_plural": "Bathroom"
        },
        "view_all": "View all",
        "no_details": "No additional details for this project yet.",
        "contact_us": "Contact Us",
        "empty_category": "New projects will be added soon to this section."
      },
      "comparison": {
        "title": "Stunning Results",
        "subtitle": "See how we transform old spaces into modern masterpieces.",
        "before": "Before Renovation",
        "after": "After Renovation",
        "empty": "Before and after comparisons will be added soon."
      },
      "contact": {
        "title": "Contact Us",
        "subtitle": "Ready to start? Contact us today for a free consultation.",
        "info": {
          "phone": "Call Us",
          "email": "Email Address",
          "address": "Our Location",
          "addressValue": "Jerusalem"
        },
        "form": {
          "name": "Full Name",
          "phone": "Phone Number",
          "service": "Select required service",
          "service_kitchen": "Kitchens",
          "service_cabinet": "Wardrobes",
          "service_office": "Offices",
          "service_laundry": "Laundry & Bath",
          "service_renovation": "Renovation",
          "message": "How can we help you?",
          "submit": "Send Request",
          "submitting": "Sending...",
          "alert_fill": "Please fill name and phone at least.",
          "error": "Failed to send, please try later."
        }
      },
      "about": {
        "title": "About Us",
        "desc1": "A factory specializing in the design and manufacture of custom-made kitchens, with 26 years of experience in this field. We excel in designing, planning, and manufacturing high-quality kitchens with attention to the smallest details, using the best materials, and providing a distinguished personal service to each client. Over the years, we have completed hundreds of successful projects that combine innovation, practicality, and great design, tailored specifically to meet our clients' needs.",
        "desc2": "",
        "stats": {
          "years": "Years Experience",
          "projects": "Finished Projects"
        }
      },
      "gallery_page": {
        "badge": "Full Portfolio",
        "title": "Abadi's Woodwork Creations",
        "subtitle": "Get inspired for your next kitchen by browsing our wide collection of models and styles.",
        "filters": {
          "all": "All",
          "kitchen": "Kitchens",
          "cabinet": "Cabinets",
          "office": "Offices",
          "laundry": "Laundry & Bath"
        },
        "pagination": {
          "prev": "Previous",
          "next": "Next"
        },
        "lightbox": {
          "no_details": "No additional details available for this work currently.",
          "inquiry": "Inquire about this work"
        },
        "back_home": "Back to Home"
      },
      "results_page": {
        "badge": "Before & After",
        "title": "Stunning Results & Full Renovations",
        "subtitle": "See how we transform old spaces into modern masterpieces that meet our clients' needs.",
        "back_home": "Back to Home"
      },
      "footer": {
        "copyright": "© 2026 Qitaf Technology Company. All rights reserved."
      }
    }
  },
  he: {
    translation: {
      "nav": {
        "home": "דף הבית",
        "services": "השירותים שלנו",
        "gallery": "גלריית עבודות",
        "about": "מי אנחנו",
        "contact": "צור קשר",
        "brand": "עבאדי",
        "go_to_site": "עבור לאתר"
      },
      "hero": {
        "title": "מטבחים וארונות מודרניים שמתאימים לטעם שלך",
        "subtitle": "עצב את המטבח והארונות שלך בעיצובים הבינלאומיים העדכניים ביותר עם האיכות הטובה ביותר ומחירים תחרותיים.",
        "cta_consult": "קבע ייעוץ חינם",
        "cta_gallery": "עיין בגלריית העבודות"
      },
      "features": {
        "title": "למה אנחנו הכי טובים?",
        "subtitle": "אנו מציעים חוויה יוצאת דופן מעיצוב ועד התקנה.",
        "design": {
          "title": "מדידה ועיצוב חינם",
          "desc": "אנחנו מגיעים אליך הביתה למדידות מדויקות ומספקים עיצובי תלת מימד בחינם."
        },
        "diversity": {
          "title": "עיצובים מגוונים",
          "desc": "גוון רחב של עיצובים קלאסיים ומודרניים שמתאימים לכל הטעמים."
        },
        "quality": {
          "title": "חומרי גלם איכותיים",
          "desc": "אנו משתמשים בסוגי העץ והאביזרים הטובים ביותר של חברות בינלאומיות מוכרות."
        },
        "warranty": {
          "title": "5 שנות אחריות",
          "desc": "אחריות מקיפה על כל המוצרים ושירות מעולה לאחר המכירה."
        }
      },
      "specialties": {
        "title": "ההתמחויות שלנו",
        "subtitle": "אנחנו מומחים בהפיכת החזון שלך למציאות בכל פינה בבית שלך.",
        "kitchens": {
          "title": "מטבחים מודרניים",
          "list": ["עיצובים חדישים וחדשניים", "חללי אחסון חכמים", "אביזרים גרמניים"]
        },
        "cabinets": {
          "title": "ארונות ובגדים",
          "list": ["ארגון בגדים מושלם", "דלתות הזזה יוקרתיות", "תאורת LED פנימית"]
        },
        "offices": {
          "title": "משרדים ומדפים",
          "list": ["עיצוב עבודה ארגונומי", "ארגון קבצים חכם", "סגנון מודרני ופשוט"]
        },
        "laundry": {
          "title": "חדרי כביסה וחדרי רחצה",
          "list": ["חומרים עמידים בפני לחות", "ניצול חלל מושלם", "ארגון חכם של חומרי ניקוי"]
        }
      },
      "portfolio": {
        "badge": "היצירות שלנו",
        "title": "גלריית העבודות שלנו",
        "subtitle": "אנחנו לא רק מייצרים רהיטים, אנחנו מעצבים חללים שמתאימים לחלומות שלכם.",
        "tabs": {
          "kitchen": "מטבחים",
          "cabinet": "ארונות",
          "office": "משרדים",
          "laundry": "אמבטיות",
          "kitchen_plural": "מטבחים",
          "cabinet_plural": "ארונות",
          "office_plural": "משרדים",
          "laundry_plural": "אמבטיות"
        },
        "view_all": "הצג את כל פרויקטי",
        "no_details": "אין כרגע פרטים נוספים לעבודה זו.",
        "contact_us": "צור קשר",
        "empty_category": "פרויקטים חדשים יתווספו בקרוב למחלקה זו."
      },
      "comparison": {
        "title": "תוצאות מדהימות",
        "subtitle": "ראה כיצד אנו הופכים חללים ישנים ליצירות מופת מודרניות.",
        "before": "לפני השיפוץ",
        "after": "אחרי השיפוץ",
        "empty": "השוואות לפני ואחרי יתווספו בקרוב."
      },
      "contact": {
        "title": "צור קשר",
        "subtitle": "מוכן להתחיל? צור איתנו קשר עוד היום לייעוץ חינם.",
        "info": {
          "phone": "התקשר אלינו",
          "email": "כתובת אימייל",
          "address": "המיקום שלנו",
          "addressValue": "ירושלים"
        },
        "form": {
          "name": "שם מלא",
          "phone": "מספר טלפון",
          "service": "בחר סוג שירות",
          "service_kitchen": "מטבחים",
          "service_cabinet": "ארונות בגדים",
          "service_office": "משרדים",
          "service_laundry": "חדרי כביסה ורחצה",
          "service_renovation": "חידוש ותחזוקה",
          "message": "איך אנחנו יכולים לעזור?",
          "submit": "שלח בקשה",
          "submitting": "שולח...",
          "alert_fill": "אנא מלא שם ומספר טלפון לפחות.",
          "error": "השליחה נכשלה, אנא נסה מאוחר יותר."
        }
      },
      "about": {
        "title": "מי אנחנו",
        "desc1": "מפעל המתמחה בעיצוב וייצור מטבחים בהתאמה אישית, עם 26 שנות ניסיון בתחום. אנו מצטיינים בעיצוב, תכנון וייצור מטבחים באיכות גבוהה עם תשומת לב לפרטים הקטנים ביותר, תוך שימוש בחומרים הטובים ביותר ומתן שירות אישי ומצוין לכל לקוח. במהלך השנים השלמנו מאות פרויקטים מוצלחים המשלבים חדשנות, פרקטיות ועיצוב נהדר, המותאמים אישית לצרכי לקוחותינו.",
        "desc2": "",
        "stats": {
          "years": "שנות ניסיון",
          "projects": "פרויקטים שהושלמו"
        }
      },
      "gallery_page": {
        "badge": "גלריית עבודות מקיפה",
        "title": "היצירות של אבאדי בעיצוב עץ",
        "subtitle": "קבל השראה למטבח הבא שלך על ידי עיון באוסף הרחב שלנו של דגמים וסגנונות.",
        "filters": {
          "all": "הכל",
          "kitchen": "מטבחים",
          "cabinet": "ארונות",
          "office": "משרדים",
          "laundry": "כביסה ורחצה"
        },
        "pagination": {
          "prev": "הקודם",
          "next": "הבא"
        },
        "lightbox": {
          "no_details": "אין כרגע פרטים נוספים לעבודה זו.",
          "inquiry": "שאל על עבודה זו"
        },
        "back_home": "חזרה לדף הבית"
      },
      "results_page": {
        "badge": "לפני ואחרי",
        "title": "תוצאות מדהימות ושיפוצים מלאים",
        "subtitle": "ראה כיצד אנו הופכים חללים ישנים ליצירות מופת מודרניות העונות על צרכי לקוחותינו.",
        "back_home": "חזרה לדף הבית"
      },
      "footer": {
        "copyright": "© 2026 חברת קטיף טכנולוגיה. כל הזכויות שמורות."
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
