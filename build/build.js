// Generates index.html (English) and es/, ar/, ur/, bn/ pages from template.html + strings.js.
// Run from the repo root: node build/build.js
const fs = require("fs");
const path = require("path");
const strings = require("./strings");

const ROOT = path.join(__dirname, "..");
const SITE = "https://samiebelal.github.io/early-screening/";
const template = fs.readFileSync(path.join(__dirname, "template.html"), "utf8");

// word: "Language" in that language, shown on the floating language button.
const LANGS = [
  { code: "en", dir: "ltr", label: "English", word: "Language", folder: "" },
  { code: "es", dir: "ltr", label: "Español", word: "Idioma", folder: "es/" },
  { code: "ar", dir: "rtl", label: "العربية", word: "اللغة", folder: "ar/" },
  { code: "ur", dir: "rtl", label: "اردو", word: "زبان", folder: "ur/" },
  { code: "bn", dir: "ltr", label: "বাংলা", word: "ভাষা", folder: "bn/" },
];

const CHECK_MARK = '<svg class="tick" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>';

const ATKINSON = "family=Atkinson+Hyperlegible+Next:ital,wght@0,400;0,600;0,800;1,400";
const FONTS = {
  en: ATKINSON,
  es: ATKINSON,
  ar: "family=Noto+Sans+Arabic:wght@400;600;800&" + ATKINSON,
  ur: "family=Noto+Nastaliq+Urdu:wght@400;700&" + ATKINSON,
  bn: "family=Noto+Sans+Bengali:wght@400;600;800&" + ATKINSON,
};

const CHECK_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="#17324a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>';

const escAttr = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const ATTR_KEYS = new Set(["title", "description", "shareText", "timelineAria", "shareLabel", "copied", "copy"]);

for (const lang of LANGS) {
  const s = strings[lang.code];
  const root = lang.folder ? "../" : "";

  const langNav = LANGS.map((l) => {
    const href = root + l.folder || "./";
    const isCurrent = l.code === lang.code;
    const current = isCurrent ? ' aria-current="page"' : "";
    return `    <a href="${href}" lang="${l.code}" dir="${l.dir}" hreflang="${l.code}"${current}><span>${l.label}</span>${isCurrent ? CHECK_MARK : ""}</a>`;
  }).join("\n");

  // Other languages first, current one last, so the cycle settles on this page's word.
  const others = LANGS.filter((l) => l.code !== lang.code);
  const cycleWords = escAttr(JSON.stringify(
    [...others, lang].map((l) => ({ w: l.word, lang: l.code, dir: l.dir }))
  ));

  const alternates = LANGS.map(
    (l) => `<link rel="alternate" hreflang="${l.code}" href="${SITE}${l.folder}">`
  ).join("\n");

  const vars = {
    ...s,
    lang: lang.code,
    dir: lang.dir,
    root,
    langNav,
    langWord: lang.word,
    cycleWords,
    alternates,
    checkSvg: CHECK_SVG,
    fontsHref: `https://fonts.googleapis.com/css2?${FONTS[lang.code]}&display=swap`,
  };

  const html = template.replace(/{{(\w+)}}/g, (_, key) => {
    if (!(key in vars)) throw new Error(`Missing string "${key}" for ${lang.code}`);
    return ATTR_KEYS.has(key) ? escAttr(vars[key]) : vars[key];
  });

  const outDir = path.join(ROOT, lang.folder);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "index.html"), html);
  console.log(`wrote ${lang.folder || ""}index.html`);
}
