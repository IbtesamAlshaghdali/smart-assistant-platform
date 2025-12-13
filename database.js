// database.js
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ✅ 1) بيانات Supabase
const SUPABASE_URL = "https://ytdnlgnbpctyjthervxq.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_yJ-LXy8mZon6kLe2Ia4DzA_7P7JR7fu";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// =====================
// Language
// =====================
// ✅ أقوى: يقرأ localStorage، وإذا ما موجودة يقرأ لغة الصفحة نفسها
export function getLang() {
  const stored = localStorage.getItem("site_lang");
  if (stored === "ar" || stored === "en") return stored;

  const docLang = (document?.documentElement?.lang || "").toLowerCase();
  if (docLang.startsWith("en")) return "en";
  return "ar";
}

// (اختياري) لو احتجتي تحفظينها من أي مكان
export function setLang(lang) {
  const v = (lang === "en") ? "en" : "ar";
  localStorage.setItem("site_lang", v);
  document.documentElement.lang = v;
  document.documentElement.dir  = (v === "ar") ? "rtl" : "ltr";
}

// =====================
// Helpers
// =====================
function norm(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function pick(row, keys) {
  for (const k of keys) {
    if (row && row[k] != null && String(row[k]).trim() !== "") return String(row[k]);
  }
  return "";
}

// ✅ نمرر lang بدل ما تستدعي getLang كل مرة
function pickLang(lang, row, arKeys, enKeys, fallbackKeys = []) {
  const keys = lang === "en" ? enKeys : arKeys;

  // أولاً جرّب مفاتيح اللغة
  let v = pick(row, keys);
  if (v) return v;

  // ثانياً fallback
  v = pick(row, fallbackKeys);
  return v || "";
}

function includesAny(text, arr) {
  const t = norm(text);
  return arr.some(k => t.includes(norm(k)));
}

// =====================
// Programs (Majors)  ✅ programs: title_ar, title_en, description_ar, description_en, sort_order, is_active
// =====================
export async function getPrograms() {
  const lang = getLang();

  const { data, error } = await supabase
    .from("programs")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;

  return (data || [])
    .filter(r => r.is_active !== false)
    .map(r => {
      const name = pickLang(
        lang,
        r,
        ["title_ar"],
        ["title_en"],
        ["title", "title_ar", "title_en"]
      );

      const desc = pickLang(
        lang,
        r,
        ["description_ar"],
        ["description_en"],
        ["description", "description_ar", "description_en"]
      );

      return { ...r, name, desc };
    });
}

export async function programsAsText() {
  const lang = getLang();
  const rows = await getPrograms();

  if (!rows.length) {
    return lang === "en"
      ? "No majors are available right now."
      : "لا توجد تخصصات متاحة حالياً.";
  }

  const list = rows.map(x => `• ${x.name}`).join("\n");

  return lang === "en"
    ? `College majors:\n${list}`
    : `تخصصات كلية إدارة الأعمال:\n${list}`;
}

// =====================
// FAQ ✅ faq: question_ar, question_en, answer_ar, answer_en, sort_order, is_active
// =====================
export async function getFaq() {
  const lang = getLang();

  const { data, error } = await supabase
    .from("faq")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;

  return (data || [])
    .filter(r => r.is_active !== false)
    .map(r => {
      const question = pickLang(
        lang,
        r,
        ["question_ar"],
        ["question_en"],
        ["question", "q", "question_ar", "question_en"]
      );

      const answer = pickLang(
        lang,
        r,
        ["answer_ar"],
        ["answer_en"],
        ["answer", "a", "answer_ar", "answer_en"]
      );

      return { ...r, question, answer };
    });
}

// =====================
// Bot Responses ✅ bot_responses: user_question_ar/en, bot_answer_ar/en, keywords, sort_order, is_active
// =====================
export async function getBotResponses() {
  const { data, error } = await supabase
    .from("bot_responses")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;

  return (data || []).filter(r => r.is_active !== false);
}

/**
 * منطق البوت:
 * 1) أسئلة التخصصات → من programs
 * 2) غير ذلك → يطابق من bot_responses:
 *    - يطابق على user_question (حسب اللغة) أو keywords (إن وجدت)
 */
export async function getBotAnswer(userText) {
  const lang = getLang();
  const q = norm(userText);

  // (1) majors trigger
  const majorsTriggersAr = ["تخصصات", "التخصصات", "كلية", "ادارة الاعمال", "إدارة الأعمال", "جامعة حائل"];
  const majorsTriggersEn = ["majors", "programs", "specializations", "business administration", "university of hail"];

  if (includesAny(q, [...majorsTriggersAr, ...majorsTriggersEn])) {
    return await programsAsText();
  }

  // (2) match from bot_responses
  const rows = await getBotResponses();

  const scored = rows.map(r => {
    const trigger = pickLang(
      lang,
      r,
      ["user_question_ar"],
      ["user_question_en"],
      ["user_question", "user_question_ar", "user_question_en"]
    );

    // ✅ إذا عندك مستقبلًا keywords_ar/keywords_en بيشتغل تلقائي
    const keywords = pickLang(
      lang,
      r,
      ["keywords_ar", "keywords"],
      ["keywords_en", "keywords"],
      ["keywords"]
    );

    const t = norm(trigger);
    const k = norm(keywords);

    let score = 0;

    // تطابق قوي
    if (t && (q === t)) score += 200 + t.length;

    // احتواء
    if (t && (q.includes(t) || t.includes(q))) score += 100 + t.length;

    // keywords
    if (k) {
      const parts = k.split(",").map(x => norm(x)).filter(Boolean);
      const hits = parts.filter(p => p && q.includes(p)).length;
      score += hits * 12;
    }

    return { r, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const hit = scored[0];

  if (!hit || hit.score < 20) {
    return lang === "en"
      ? "I couldn't find a matching answer. Try a shorter question or different keywords."
      : "ما لقيت إجابة مطابقة. جرّبي تكتبين السؤال بشكل أقصر أو بكلمات مختلفة.";
  }

  const answer = pickLang(
    lang,
    hit.r,
    ["bot_answer_ar"],
    ["bot_answer_en"],
    ["bot_answer", "bot_answer_ar", "bot_answer_en"]
  );

  return answer || (lang === "en" ? "No answer available." : "لا توجد إجابة متاحة.");
}
