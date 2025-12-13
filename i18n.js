export function initLang() {
  // ✅ لغة محفوظة بين الصفحات
  let lang = localStorage.getItem("site_lang") || "ar";

  const t = {
    ar: {
      // ===== Brand / Header =====
      brandTitle: "كلية إدارة الأعمال",
      brandSub: "جامعة حائل",

      // ===== Nav =====
      navHome: "الرئيسية",
      navAbout: "عن الموقع",
      navFaq: "الأسئلة الشائعة",
      navBot: "المساعد الذكي",
      navContact: "للتواصل",

      // ===== Home (Hero) =====
      heroTitle: "مرحباً بك في منصة المساعد الذكي لكلية ادارة الأعمال",
      heroDesc:
        "هذه المنصة تسهّل عليك الوصول للمعلومات بسرعة: الأسئلة الشائعة، المساعد الذكي، وروابط مهمة مثل بوابة الدخول الموحد وموقع الكلية.",
      hint: "جرّب تسأل البوت: “تخصصات كلية إدارة الأعمال جامعة حائل”.",

      // ===== About =====
      aboutTitle: "عن الموقع",
      aboutLead:
        "منصة رقمية مخصصة لطلاب كلية إدارة الأعمال بجامعة حائل، تهدف إلى تسهيل الوصول للمعلومات والخدمات الأكاديمية في مكان واحد.",

      aboutCard1Title: "فكرة الموقع",
      aboutCard1Text:
        "تقديم منصة مساعدة تعتمد على الأسئلة الشائعة والمساعد الذكي لتقليل الجهد والوقت على الطالب.",

      aboutCard2Title: "الأهداف",
      aboutGoal1: "تجميع المعلومات المهمة في موقع واحد.",
      aboutGoal2: "تسهيل الوصول للخطة الدراسية والتخصصات.",
      aboutGoal3: "تحسين تجربة الطالب الرقمية.",

      aboutCard3Title: "الطموحات",
      aboutAsp1: "أن يكون الموقع المرجع الأول لطلاب الكلية.",
      aboutAsp2: "أن يصبح قسمًا رسميًا ضمن موقع كلية إدارة الأعمال.",

      // ===== Pages =====
      faqTitle: "الأسئلة الشائعة",
      botTitle: "المساعد الذكي",
      contactTitle: "للتواصل",

      // ===== Chatbot hint (inside bot page) =====
      botHint: "💡 تلميح: جرّب تسأل البوت عن تخصصات الكلية أو الخطة الدراسية",

      // ===== Contact cards =====
      contactCard1Title: "منصة X",
      contactCard2Title: "يوتيوب",
      contactCard3Title: "بوابة الدخول الموحد",
      contactCard4Title: "موقع الكلية",

      // ===== Footer =====
      rights: "جميع الحقوق محفوظة لجامعة حائل - كلية ادارة الأعمال 2025-2026"
    },

    en: {
      // ===== Brand / Header =====
      brandTitle: "College of Business Administration",
      brandSub: "University of Hail",

      // ===== Nav =====
      navHome: "Home",
      navAbout: "About",
      navFaq: "FAQ",
      navBot: "Smart Assistant",
      navContact: "Contact",

      // ===== Home (Hero) =====
      heroTitle: "Welcome to the Smart Assistant Platform",
      heroDesc:
        "This platform helps students quickly access FAQs, the smart assistant, and important university links.",
      hint: "Try asking the bot: “Business Administration majors at University of Hail”.",

      // ===== About =====
aboutTitle: "About",
aboutLead:
  "A digital platform dedicated to Business Administration students at the University of Hail, aiming to facilitate access to academic information and services in one place.",

aboutCard1Title: "Website Idea",
aboutCard1Text:
  "Providing a support platform based on automated responses and frequently asked questions to reduce student effort and save time when searching for academic inquiries.",

aboutCard2Title: "Goals",
aboutGoal1: "Collect important information in one place.",
aboutGoal2: "Make it easier to access answers.",
aboutGoal3: "Improve the digital student experience.",

aboutCard3Title: "Aspirations",
aboutAsp1: "To become the primary reference for college students.",
aboutAsp2: "To become an official section within the College of Business Administration website.",
      // ===== Pages =====
      faqTitle: "Frequently Asked Questions",
      botTitle: "Smart Assistant",
      contactTitle: "Contact",

      // ===== Chatbot hint (inside bot page) =====
      botHint: "💡 Tip: Try asking the bot about majors or the study plan.",

      // ===== Contact cards =====
      contactCard1Title: "X Platform",
      contactCard2Title: "YouTube",
      contactCard3Title: "Single Sign-On Portal",
      contactCard4Title: "College Website",

      // ===== Footer =====
      rights: "All rights reserved to University of Hail – College of Business Administration 2025–2026"
    }
  };

  function apply() {
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === "ar") ? "rtl" : "ltr";

    // ✅ طبق الترجمة على أي عنصر موجود (لو مو موجود نتجاهله)
    Object.keys(t[lang]).forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = t[lang][id];
    });

    // ✅ احفظ اللغة
    localStorage.setItem("site_lang", lang);
  }

  // ✅ اربط الزر لو موجود (بدون ما نوقف الدالة لو مو موجود)
  const btn = document.getElementById("langBtn");
  if (btn) {
    btn.onclick = () => {
      lang = (lang === "ar") ? "en" : "ar";
      apply();
    };
  }

  // ✅ طبق مباشرة عند فتح أي صفحة
  apply();
}
