import mongoose from "mongoose";
import Book from "./models/Book.js";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const COVER_BASE = "/images/books";

const subjectCoverMap = {
  "नेपाली": `${COVER_BASE}/book_subject_nepali.svg`,
  "अंग्रेजी": `${COVER_BASE}/book_subject_english.svg`,
  "English": `${COVER_BASE}/book_subject_english.svg`,
  "गणित": `${COVER_BASE}/book_subject_math.svg`,
  "Math": `${COVER_BASE}/book_subject_math.svg`,
  "विज्ञान": `${COVER_BASE}/book_subject_science.svg`,
  "Science": `${COVER_BASE}/book_subject_science.svg`,
  "सामाजिक": `${COVER_BASE}/book_subject_social.svg`,
  "Social": `${COVER_BASE}/book_subject_social.svg`,
  "स्वास्थ्य": `${COVER_BASE}/book_subject_health.svg`,
  "Health": `${COVER_BASE}/book_subject_health.svg`,
  "भौतिक": `${COVER_BASE}/book_subject_physics.svg`,
  "Physics": `${COVER_BASE}/book_subject_physics.svg`,
  "रसायन": `${COVER_BASE}/book_subject_chemistry.svg`,
  "Chemistry": `${COVER_BASE}/book_subject_chemistry.svg`,
  "जीव": `${COVER_BASE}/book_subject_biology.svg`,
  "Biology": `${COVER_BASE}/book_subject_biology.svg`,
  "अर्थ": `${COVER_BASE}/book_subject_economics.svg`,
  "Economics": `${COVER_BASE}/book_subject_economics.svg`,
  "लेखा": `${COVER_BASE}/book_subject_account.svg`,
  "Account": `${COVER_BASE}/book_subject_account.svg`,
  "जनसङ्ख्या": `${COVER_BASE}/book_subject_population.svg`,
  "Population": `${COVER_BASE}/book_subject_population.svg`,
  "भूगोल": `${COVER_BASE}/book_subject_geography.svg`,
  "इतिहास": `${COVER_BASE}/book_subject_history.svg`,
  "History": `${COVER_BASE}/book_subject_history.svg`,
  "कम्प्युटर": `${COVER_BASE}/book_subject_computer.svg`,
  "Computer": `${COVER_BASE}/book_subject_computer.svg`,
  "व्यवसाय": `${COVER_BASE}/book_subject_business.svg`,
  "Business": `${COVER_BASE}/book_subject_business.svg`,
  "शिक्षा": `${COVER_BASE}/book_subject_education.svg`,
  "Education": `${COVER_BASE}/book_subject_education.svg`,
  "ऐच्छिक": `${COVER_BASE}/book_subject_optional.svg`,
  "Optional": `${COVER_BASE}/book_subject_optional.svg`,
  "सेरोफेरो": `${COVER_BASE}/book_subject_serofero.svg`,
  "Serofero": `${COVER_BASE}/book_subject_serofero.svg`,
};

function getCover(title) {
  for (const [key, path] of Object.entries(subjectCoverMap)) {
    if (title.includes(key)) return path;
  }
  return `${COVER_BASE}/book_subject_generic.svg`;
}

function getCategory(title, grade) {
  const g = grade || parseGrade(title);
  if (g >= 1 && g <= 12) return `Class ${g}`;
  return "General";
}

const devDig = { "०": 0, "१": 1, "२": 2, "३": 3, "४": 4, "५": 5, "६": 6, "७": 7, "८": 8, "९": 9 };

function parseGrade(title) {
  const pats = [
    /Grade\s*[-–]\s*(\d+)/, /Grade\s+(\d+)/, /\(Grade\s+(\d+)\)/,
    /कक्षा\s*[-–]\s*(\d+)/, /कक्षा\s+(\d+)/, /कक्षा[-\s]*(\d+)/,
    /कक्षा\s*[-–]\s*([०१२३४५६७८९]+)/, /कक्षा\s+([०१२३४५६७८९]+)/, /कक्षा[-\s]*([०१२३४५६७८९]+)/,
    /Class\s+(\d+)/,
  ];
  for (const p of pats) {
    const m = title.match(p);
    if (m) {
      const d = m[1];
      if (/^\d+$/.test(d)) return parseInt(d);
      let n = 0;
      for (const ch of d) n = n * 10 + (devDig[ch] ?? 0);
      return n;
    }
  }
  return 0;
}

function getAuthor(title, grade) {
  const g = grade || parseGrade(title);
  if (g >= 1 && g <= 12) return `CDC Nepal (कक्षा ${g} पाठ्यपुस्तक)`;
  return "Curriculum Development Centre, Nepal";
}

// ALL textbooks from class 1 to 12
const textbooks = [
  // ===== CLASS 1 =====
  { title: "मेरो नेपाली कक्षा १", url: "https://moecdc.gov.np/storage/gallery/1704094300.pdf" },
  { title: "मेरो नेपाली कक्षा १ (२०८२)", url: "https://giwmscdnone.gov.np/media/pdf_upload/%E0%A4%AE%E0%A5%87%E0%A4%B0%E0%A5%8B%20%E0%A4%A8%E0%A5%87%E0%A4%AA%E0%A4%BE%E0%A4%B2%E0%A5%80%20%E0%A4%95%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A4%BE%20%E0%A5%A7_yj4bcfx.pdf" },
  { title: "My English Book 1", url: "https://moecdc.gov.np/storage/gallery/1672307877.pdf" },
  { title: "मेरो गणित कक्षा १", url: "https://moecdc.gov.np/storage/gallery/1672308310.pdf" },
  { title: "Mathematics Grade 1", url: "https://moecdc.gov.np/storage/gallery/1708925298.pdf" },
  { title: "हाम्रो सेरोफेरो कक्षा १", url: "https://moecdc.gov.np/storage/gallery/1672308652.pdf" },

  // ===== CLASS 2 =====
  { title: "नेपाली कक्षा २", url: "https://moecdc.gov.np/storage/gallery/1672633608.pdf" },
  { title: "English Grade 2", url: "https://moecdc.gov.np/storage/gallery/1672556083.pdf" },
  { title: "गणित कक्षा २", url: "https://moecdc.gov.np/storage/gallery/1672567946.pdf" },
  { title: "Mathematics Grade 2", url: "https://moecdc.gov.np/storage/gallery/1708852295.pdf" },
  { title: "हाम्रो सेरोफेरो कक्षा २", url: "https://moecdc.gov.np/storage/gallery/1682058190.pdf" },

  // ===== CLASS 3 =====
  { title: "नेपाली कक्षा ३", url: "https://moecdc.gov.np/storage/gallery/1672633680.pdf" },
  { title: "English Grade 3", url: "https://moecdc.gov.np/storage/gallery/1672633746.pdf" },
  { title: "गणित कक्षा ३", url: "https://moecdc.gov.np/storage/gallery/1672633791.pdf" },
  { title: "Mathematics Grade 3", url: "https://moecdc.gov.np/storage/gallery/1708924606.pdf" },
  { title: "हाम्रो सेरोफेरो कक्षा ३", url: "https://moecdc.gov.np/storage/gallery/1672633882.pdf" },

  // ===== CLASS 4 =====
  { title: "नेपाली कक्षा ४", url: "https://moecdc.gov.np/storage/gallery/1681727544.pdf" },
  { title: "English Grade 4", url: "https://moecdc.gov.np/storage/gallery/1681728172.pdf" },
  { title: "गणित कक्षा ४", url: "https://moecdc.gov.np/storage/gallery/1681727585.pdf" },
  { title: "Mathematics Grade 4", url: "https://moecdc.gov.np/storage/gallery/1708926663.pdf" },
  { title: "सामाजिक अध्ययन कक्षा ४", url: "https://moecdc.gov.np/storage/gallery/1681727636.pdf" },
  { title: "विज्ञान कक्षा ४", url: "https://moecdc.gov.np/storage/gallery/1681728702.pdf" },
  { title: "Science Grade 4", url: "https://moecdc.gov.np/storage/gallery/1704704471.pdf" },
  { title: "स्वास्थ्य कक्षा ४", url: "https://moecdc.gov.np/storage/gallery/1681792950.pdf" },
  { title: "Health Grade 4", url: "https://moecdc.gov.np/storage/gallery/1704704216.pdf" },
  { title: "नेपाली कक्षा ४ (२०८२)", url: "https://giwmscdnone.gov.np/media/pdf_upload/4.Reduced-Nepali%2004_nztgffb.pdf" },
  { title: "स्वास्थ्य, शारीरिक तथा सिर्जनात्मक कला कक्षा ४ (२०८२)", url: "https://giwmscdnone.gov.np/media/pdf_upload/2.%20Reduced-class%204%20health%20final_1nd5zum.pdf" },

  // ===== CLASS 5 =====
  { title: "नेपाली कक्षा ५", url: "https://moecdc.gov.np/storage/gallery/1681211870.pdf" },
  { title: "English Grade 5", url: "https://moecdc.gov.np/storage/gallery/1681367111.pdf" },
  { title: "गणित कक्षा ५", url: "https://moecdc.gov.np/storage/gallery/1681211690.pdf" },
  { title: "Mathematics Grade 5", url: "https://moecdc.gov.np/storage/gallery/1709109482.pdf" },
  { title: "विज्ञान कक्षा ५", url: "https://moecdc.gov.np/storage/gallery/1681212072.pdf" },
  { title: "Science Grade 5", url: "https://moecdc.gov.np/storage/gallery/1709112362.pdf" },
  { title: "सामाजिक अध्ययन कक्षा ५", url: "https://moecdc.gov.np/storage/gallery/1681212176.pdf" },
  { title: "स्वास्थ्य कक्षा ५", url: "https://moecdc.gov.np/storage/gallery/1682061955.pdf" },
  { title: "नेपाली कक्षा ५ (२०८२)", url: "https://giwmscdnone.gov.np/media/pdf_upload/Nepali%2005%20Final%20File_foagqer.pdf" },
  { title: "स्वास्थ्य, शारीरिक तथा सिर्जनात्मक कला कक्षा ५ (२०८२)", url: "https://giwmscdnone.gov.np/media/pdf_upload/3.%20Reduced-class%205%20health%20final_yg4igv7.pdf" },

  // ===== CLASS 6 =====
  { title: "नेपाली कक्षा ६", url: "https://moecdc.gov.np/storage/gallery/1672799748.pdf" },
  { title: "English Grade 6", url: "https://moecdc.gov.np/storage/gallery/1672799804.pdf" },
  { title: "गणित कक्षा ६", url: "https://moecdc.gov.np/storage/gallery/1672799879.pdf" },
  { title: "Mathematics Grade 6", url: "https://moecdc.gov.np/storage/gallery/1708925838.pdf" },
  { title: "विज्ञान कक्षा ६", url: "https://moecdc.gov.np/storage/gallery/1672799965.pdf" },
  { title: "Science Grade 6", url: "https://moecdc.gov.np/storage/gallery/1709542968.pdf" },
  { title: "सामाजिक अध्ययन कक्षा ६", url: "https://moecdc.gov.np/storage/gallery/1672800056.pdf" },
  { title: "स्वास्थ्य कक्षा ६", url: "https://moecdc.gov.np/storage/gallery/1710760807.pdf" },
  { title: "Health Grade 6", url: "https://moecdc.gov.np/storage/gallery/1709191880.pdf" },
  { title: "अंग्रेजी कक्षा ६ (२०८२)", url: "https://giwmscdnone.gov.np/media/pdf_upload/3.%20Reducced-English%20Grade%206%20Final_fntvwhe.pdf" },
  { title: "नेपाली कक्षा ६ (२०८२)", url: "https://giwmscdnone.gov.np/media/pdf_upload/4.Reduced-class%206%20Nepali%20final_hy7w99r.pdf" },
  { title: "गणित कक्षा ६ (नेपाली संस्करण)", url: "https://giwmscdnone.gov.np/media/pdf_upload/%E0%A4%97%E0%A4%A3%E0%A4%BF%E0%A4%A4%20%E0%A4%95%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A4%BE%20-%E0%A5%AC%20(%E0%A4%A8%E0%A5%87%E0%A4%AA%E0%A4%BE%E0%A4%B2%E0%A5%80%20%E0%A4%B8%E0%A4%82%E0%A4%B8%E0%A5%8D%E0%A4%95%E0%A4%B0%E0%A4%A3)_u9wxqsf.pdf" },
  { title: "सामाजिक अध्ययन तथा मानवमूल्य शिक्षा कक्षा ६ (२०८२)", url: "https://giwmscdnone.gov.np/media/pdf_upload/5.Reduced-Class%206%20Social%20Final_l9n6lkg.pdf" },

  // ===== CLASS 7 =====
  { title: "नेपाली कक्षा ७", url: "https://moecdc.gov.np/storage/gallery/1672800491.pdf" },
  { title: "English Grade 7", url: "https://moecdc.gov.np/storage/gallery/1672800534.pdf" },
  { title: "गणित कक्षा ७", url: "https://moecdc.gov.np/storage/gallery/1672800575.pdf" },
  { title: "Mathematics Grade 7", url: "https://moecdc.gov.np/storage/gallery/1709112299.pdf" },
  { title: "विज्ञान कक्षा ७", url: "https://moecdc.gov.np/storage/gallery/1674294172.pdf" },
  { title: "Science Grade 7", url: "https://moecdc.gov.np/storage/gallery/1709186060.pdf" },
  { title: "सामाजिक अध्ययन कक्षा ७", url: "https://moecdc.gov.np/storage/gallery/1672800794.pdf" },
  { title: "स्वास्थ्य कक्षा ७", url: "https://moecdc.gov.np/storage/gallery/1672800992.pdf" },
  { title: "नेपाली कक्षा ७ (२०८२)", url: "https://giwmscdnone.gov.np/media/pdf_upload/7.Reduced-class%207%20Nepali%20final_lnxtmxf.pdf" },
  { title: "अंग्रेजी कक्षा ७ (२०८२)", url: "https://giwmscdnone.gov.np/media/pdf_upload/6.%20Reduced-class%207%20English%20final_lro4mmc.pdf" },
  { title: "सामाजिक अध्ययन तथा मानवमूल्य शिक्षा कक्षा ७ (२०८२)", url: "https://giwmscdnone.gov.np/media/pdf_upload/8.Reduced-class%207%20samajik%20Final_zq04sfi.pdf" },
  { title: "विज्ञान तथा प्रविधि कक्षा ७ (२०८२)", url: "https://giwmscdnone.gov.np/media/pdf_upload/9.Reduced-class%207%20science%20final_ypdi9pg.pdf" },
  { title: "स्वास्थ्य, शारीरिक तथा सिर्जनात्मक कला कक्षा ७ (२०८२)", url: "https://giwmscdnone.gov.np/media/pdf_upload/1.%20class%207%20health%20final-compressed_pqmbsce.pdf" },

  // ===== CLASS 8 =====
  { title: "अंग्रेजी कक्षा ८ (२०८२)", url: "https://giwmscdnone.gov.np/media/pdf_upload/1.%20Reduced-class%208%20English%20final_vfiq0xm.pdf" },
  { title: "नेपाली कक्षा ८ (२०८२)", url: "https://giwmscdnone.gov.np/media/pdf_upload/2.%20Reduced-class%208%20nepali%20final_ahsi1f6.pdf" },
  { title: "सामाजिक अध्ययन तथा मानवमूल्य शिक्षा कक्षा ८ (२०८२)", url: "https://giwmscdnone.gov.np/media/pdf_upload/3.%20Reduced-Class%208%20Social%20study%20final_nl4c3bh.pdf" },
  { title: "Science and Technology Grade 8", url: "https://moecdc.gov.np/storage/gallery/1687157819.pdf" },

  // ===== CLASS 9 =====
  { title: "सामाजिक अध्ययन कक्षा ९ (२०८२)", url: "https://giwmscdnone.gov.np/media/pdf_upload/7.%20Reduced-class%209%20samajik%20final_0fnw909.pdf" },
  { title: "विज्ञान तथा प्रविधि कक्षा ९ (२०८२)", url: "https://giwmscdnone.gov.np/media/pdf_upload/8.Reduced-class%209%20Science%20final_lyfjyve.pdf" },
  { title: "नेपाली कक्षा ९ (२०८२)", url: "https://giwmscdnone.gov.np/media/pdf_upload/6.Reduced-class%209%20Nepali_1tgrnzq.pdf" },
  { title: "अंग्रेजी कक्षा ९ (२०८२)", url: "https://giwmscdnone.gov.np/media/pdf_upload/5.%20Reduced-class%209%20English%20final_5hjggyv.pdf" },
  { title: "अंग्रेजी कक्षा ९", url: "https://moecdc.gov.np/storage/gallery/1688289325.pdf" },
  { title: "कार्यालय सञ्चालन तथा लेखा कक्षा ९ (२०८२)", url: "https://giwmscdnone.gov.np/media/pdf_upload/4.%20Reduced-class%209%20account%20final_9sk9qfx.pdf" },
  { title: "Optional Mathematics Grade 9", url: "https://giwmscdnone.gov.np/media/pdf_upload/Final%20opt%20math%20eng%20for%20press%209%20(2082-11-26)%201-12%20PM%20(1)_1iwtizb.pdf" },
  { title: "जनसङ्ख्या शिक्षा कक्षा ९", url: "https://giwmscdnone.gov.np/media/pdf_upload/class%209%20population%2022%20mangsir%202082%20Final_aohanvo.pdf" },
  { title: "इतिहास (कक्षा ९)", url: "https://giwmscdnone.gov.np/media/pdf_upload/%E0%A4%87%E0%A4%A4%E0%A4%BF%E0%A4%B9%E0%A4%BE%E0%A4%B8%20%E0%A4%95%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A4%BE-%E0%A5%AF_3kf761a.pdf" },

  // ===== CLASS 10 =====
  { title: "शिक्षा कक्षा १०", url: "https://giwmscdnone.gov.np/media/pdf_upload/%E0%A4%B6%E0%A4%BF%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A4%BE%20%E0%A4%95%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A4%BE-%E0%A5%A7%E0%A5%A6%2C%20%E0%A5%A8%E0%A5%A6%E0%A5%AD%E0%A5%AC_ucstbcc.pdf" },
  { title: "Optional English (Grade 10), 2020", url: "https://giwmscdnone.gov.np/media/pdf_upload/download%20(4)_fqnvhyr.pdf" },
  { title: "सामाजिक अध्ययन कक्षा १० (२०८२)", url: "https://giwmscdnone.gov.np/media/pdf_upload/1.%20Reduced-class%2010%20Samajik%20Final%202082.5.5_uymulzg.pdf" },
  { title: "सामाजिक अध्ययन कक्षा १०", url: "https://giwmscdnone.gov.np/media/pdf_upload/updated%E0%A4%B8%E0%A4%BE%E0%A4%AE%E0%A4%BE%E0%A4%9C%E0%A4%BF%E0%A4%95%20%E0%A4%85%E0%A4%A7%E0%A5%8D%E0%A4%AF%E0%A4%AF%E0%A4%A8%20%E0%A4%95%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A4%BE%20%E0%A5%A7%E0%A5%A6_seu2bim_vcjwwer.pdf" },
  { title: "कार्यालय सञ्चालन तथा लेखा कक्षा १०", url: "https://giwmscdnone.gov.np/media/pdf_upload/Grade%2010_Account%20final_zeapqrn.pdf" },
  { title: "नेपाली कक्षा १० (२०८२)", url: "https://giwmscdnone.gov.np/media/pdf_upload/class%2010%20Nepali%20Final_kjvwvtg.pdf" },
  { title: "अंग्रेजी कक्षा १० (२०८२)", url: "https://giwmscdnone.gov.np/media/pdf_upload/9.Reduced-class%2010%20English%20Final_hsjc8bm.pdf" },
  { title: "विज्ञान तथा प्रविधि कक्षा १० (२०८२)", url: "https://giwmscdnone.gov.np/media/pdf_upload/2.%20Reduced-class%2010%20science%20Final%2011.2.2025_zbgnya7.pdf" },
  { title: "नेपाली कक्षा १०", url: "https://moecdc.gov.np/storage/gallery/1681370216.pdf" },
  { title: "अंग्रेजी कक्षा १०", url: "https://moecdc.gov.np/storage/gallery/1681716079.pdf" },
  { title: "गणित कक्षा १०", url: "https://moecdc.gov.np/storage/gallery/1681715186.pdf" },
  { title: "Mathematics Grade 10", url: "https://moecdc.gov.np/storage/gallery/1687066510.pdf" },
  { title: "विज्ञान कक्षा १० भाग १", url: "https://moecdc.gov.np/storage/gallery/1682668847.pdf" },
  { title: "विज्ञान कक्षा १० भाग २", url: "https://moecdc.gov.np/storage/gallery/1682668904.pdf" },
  { title: "Science Grade 10", url: "https://moecdc.gov.np/storage/gallery/1692097269.pdf" },
  { title: "सामाजिक अध्ययन कक्षा १०", url: "https://moecdc.gov.np/storage/gallery/1687942336.pdf" },
  { title: "ऐच्छिक गणित कक्षा १०", url: "https://giwmscdnone.gov.np/media/pdf_upload/Final%20OPT%20math%20class%2010%20for%20Press%20(11-16)_cljqcad.pdf" },
  { title: "अर्थशास्त्र कक्षा १०", url: "https://giwmscdnone.gov.np/media/pdf_upload/Class%2010%20Economics%20Final%20Edit%202082-11-16_ysjzl2g.pdf" },
  { title: "अर्थशास्त्र कक्षा १० (२०७५)", url: "https://giwmscdnone.gov.np/media/pdf_upload/%E0%A4%85%E0%A4%B0%E0%A5%8D%E0%A4%A5%E0%A4%B6%E0%A4%BE%E0%A4%B8%E0%A5%8D%E0%A4%A4%E0%A5%8D%E0%A4%B0%20%E0%A4%95%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A4%BE-%E0%A5%A7%E0%A5%A6%2C%20%E0%A5%A8%E0%A5%A6%E0%A5%AD%E0%A5%AB_doqflvd.pdf" },
  { title: "अर्थशास्र कक्षा १० (२०७५) सच्याइएको प्रति", url: "https://giwmscdnone.gov.np/media/pdf_upload/Economics%20(Grade-10)%20(final%20corrected%207-19_4ey50sb.pdf" },
  { title: "भूगोल कक्षा १०", url: "https://giwmscdnone.gov.np/media/pdf_upload/download%20(3)_nyy1bgm.pdf" },
  { title: "कम्प्युटर विज्ञान (कक्षा १०)", url: "https://giwmscdnone.gov.np/media/pdf_upload/Computer%20Science%20-%20Grade%2010_tazdzp7.pdf" },

  // ===== CLASS 11 =====
  { title: "Physics Grade 11", url: "https://giwmscdnone.gov.np/media/pdf_upload/1.%20Reduced-%20Grde-11-Physics_ogc1tkt.pdf" },
  { title: "Chemistry Grade 11", url: "https://giwmscdnone.gov.np/media/pdf_upload/5.%20Reduced-Chemistry%20grade%2011_jndm9il.pdf" },
  { title: "Biology Grade 11", url: "https://giwmscdnone.gov.np/media/pdf_upload/3.%20Reduced-Biology_grade_11_ck4uozj.pdf" },
  { title: "ऐच्छिक अंग्रेजी (कक्षा ११)", url: "https://giwmscdnone.gov.np/media/pdf_upload/Optional%20English%20Grade-11_x851zhx.pdf" },
  { title: "लेखाविधि (कक्षा ११)", url: "https://giwmscdnone.gov.np/media/pdf_upload/Grade%2011_account%20final_orerrsn.pdf" },
  { title: "व्यवसाय अध्ययन (कक्षा ११)", url: "https://giwmscdnone.gov.np/media/pdf_upload/%E0%A4%B5%E0%A5%8D%E0%A4%AF%E0%A4%B5%E0%A4%B8%E0%A4%BE%E0%A4%AF%20%E0%A4%85%E0%A4%A7%E0%A5%8D%E0%A4%AF%E0%A4%AF%E0%A4%A8%20%E0%A4%95%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A4%BE-%E0%A5%A7%E0%A5%A7_kwhxwfa.pdf" },

  // ===== CLASS 12 =====
  { title: "Physics Grade 12", url: "https://giwmscdnone.gov.np/media/pdf_upload/6.%20Physics%20Grade%2012_hlufw8m.pdf" },
  { title: "Biology Grade 12", url: "https://giwmscdnone.gov.np/media/pdf_upload/2.%20Reduced-Biology%20Class%2012_twjkcfx.pdf" },
  { title: "Chemistry Grade 12", url: "https://giwmscdnone.gov.np/media/pdf_upload/4.%20Reduced-Chemistry%20Class%2012_uy406wi.pdf" },
  { title: "English Grade 12", url: "https://moecdc.gov.np/storage/gallery/1673319459.pdf" },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB\n");

    let added = 0, skipped = 0;

    for (const t of textbooks) {
      const grade = parseGrade(t.title);
      const cover = getCover(t.title);
      const sub = grade >= 1 && grade <= 12 ? `Class ${grade}` : "General";
      const cat = getCategory(t.title, grade);
      const author = getAuthor(t.title, grade);

      const exists = await Book.findOne({ title: t.title, author });
      if (exists) {
        skipped++;
        continue;
      }

      await Book.create({
        title: t.title,
        author,
        category: cat,
        subcategory: sub,
        description: `${t.title} - CDC Nepal Official Textbook${grade >= 1 && grade <= 12 ? ` (Grade ${grade})` : ""}. Published by Curriculum Development Centre, Sanothimi, Bhaktapur, Nepal.`,
        coverImage: cover,
        publishYear: 2025,
        price: 0,
        totalCopies: 1,
        availableCopies: 1,
        status: "available",
        tags: ["textbook", "cdc", "nepal", `class-${grade}`, cat.toLowerCase()],
        source: "CDC Nepal",
        sourceUrl: t.url,
      });
      console.log(`  [${cat}] ${t.title} (${sub})`);
      added++;
    }

    console.log(`\nDone! Added: ${added}, Skipped: ${skipped}`);
    mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

seed();
