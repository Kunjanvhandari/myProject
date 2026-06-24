import mongoose from "mongoose";
import Book from "./models/Book.js";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const subjectCoverMap = {
  "नेपाली": "/images/books/book_subject_nepali.svg",
  "अंग्रेजी": "/images/books/book_subject_english.svg",
  "गणित": "/images/books/book_subject_math.svg",
  "विज्ञान": "/images/books/book_subject_science.svg",
  "सामाजिक": "/images/books/book_subject_social.svg",
  "स्वास्थ्य": "/images/books/book_subject_health.svg",
  "भौतिक": "/images/books/book_subject_physics.svg",
  "रसायन": "/images/books/book_subject_chemistry.svg",
  "जीव": "/images/books/book_subject_biology.svg",
  "अर्थ": "/images/books/book_subject_economics.svg",
  "लेखा": "/images/books/book_subject_account.svg",
  "जनसङ्ख्या": "/images/books/book_subject_population.svg",
  "भूगोल": "/images/books/book_subject_geography.svg",
  "इतिहास": "/images/books/book_subject_history.svg",
  "कम्प्युटर": "/images/books/book_subject_computer.svg",
  "व्यवसाय": "/images/books/book_subject_business.svg",
  "शिक्षा": "/images/books/book_subject_education.svg",
  "ऐच्छिक": "/images/books/book_subject_optional.svg",
  "Optional": "/images/books/book_subject_optional.svg",
  "Physics": "/images/books/book_subject_physics.svg",
  "Biology": "/images/books/book_subject_biology.svg",
  "Chemistry": "/images/books/book_subject_chemistry.svg",
};

function getMapKey(title) {
  for (const key of Object.keys(subjectCoverMap)) {
    if (title.includes(key)) return key;
  }
  return null;
}

const devanagariNum = { "०": 0, "१": 1, "२": 2, "३": 3, "४": 4, "५": 5, "६": 6, "७": 7, "८": 8, "९": 9 };

function parseGrade(title) {
  const patterns = [
    /कक्षा\s*[-–]\s*(\d+)/,
    /कक्षा\s+(\d+)/,
    /Grade\s*[-–]\s*(\d+)/,
    /Grade\s+(\d+)/,
    /\(Grade\s+(\d+)\)/,
    /कक्षा[-\s]*(\d+)/,
    /कक्षा\s*[-–]\s*([०१२३४५६७८९]+)/,
    /कक्षा\s+([०१२३४५६७८९]+)/,
    /कक्षा[-\s]*([०१२३४५६७८९]+)/,
  ];
  for (const p of patterns) {
    const m = title.match(p);
    if (m) {
      const digits = m[1];
      if (/^\d+$/.test(digits)) return parseInt(digits);
      let n = 0;
      for (const ch of digits) n = n * 10 + (devanagariNum[ch] ?? 0);
      return n;
    }
  }
  return 0;
}

function getCategory(title) {
  if (/विज्ञान|Science|Physics|Biology|Chemistry|भौतिक|रसायन|जीव/.test(title)) return "Science";
  if (/गणित|Math/.test(title)) return "Academic";
  if (/सामाजिक|Social|भूगोल|इतिहास|जनसङ्ख्या|Population|Economics|अर्थ/.test(title)) return "Academic";
  if (/नेपाली|अंग्रेजी|English|Nepali/.test(title)) return "Academic";
  if (/स्वास्थ्य|Health/.test(title)) return "Non-Fiction";
  if (/कम्प्युटर|Computer/.test(title)) return "Technology";
  if (/व्यवसाय|Business|Account|लेखा/.test(title)) return "Business";
  if (/शिक्षा|Education/.test(title)) return "Academic";
  if (/ऐच्छिक|Optional/.test(title)) return "Academic";
  return "Academic";
}

function getAuthor(title) {
  const grade = parseGrade(title);
  if (grade >= 1 && grade <= 12) {
    return `CDC Nepal (कक्षा ${grade} पाठ्यपुस्तक)`;
  }
  return "Curriculum Development Centre, Nepal";
}

const textbooks = [
  { title: "शिक्षा कक्षा १०", pdfUrl: "https://giwmscdnone.gov.np/media/pdf_upload/%E0%A4%B6%E0%A4%BF%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A4%BE%20%E0%A4%95%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A4%BE-%E0%A5%A7%E0%A5%A6%2C%20%E0%A5%A8%E0%A5%A6%E0%A5%AD%E0%A5%AC_ucstbcc.pdf" },
  { title: "Optional English (Grade 10), 2020", pdfUrl: "https://giwmscdnone.gov.np/media/pdf_upload/download%20(4)_fqnvhyr.pdf" },
  { title: "Physics Grade - 12", pdfUrl: "https://giwmscdnone.gov.np/media/pdf_upload/6.%20Physics%20Grade%2012_hlufw8m.pdf" },
  { title: "Biology Grade - 12", pdfUrl: "https://giwmscdnone.gov.np/media/pdf_upload/2.%20Reduced-Biology%20Class%2012_twjkcfx.pdf" },
  { title: "Chemistry Grade - 12", pdfUrl: "https://giwmscdnone.gov.np/media/pdf_upload/4.%20Reduced-Chemistry%20Class%2012_uy406wi.pdf" },
  { title: "Chemistry Grade - 11", pdfUrl: "https://giwmscdnone.gov.np/media/pdf_upload/5.%20Reduced-Chemistry%20grade%2011_jndm9il.pdf" },
  { title: "Physics Grade - 11", pdfUrl: "https://giwmscdnone.gov.np/media/pdf_upload/1.%20Reduced-%20Grde-11-Physics_ogc1tkt.pdf" },
  { title: "Biology Grade - 11", pdfUrl: "https://giwmscdnone.gov.np/media/pdf_upload/3.%20Reduced-Biology_grade_11_ck4uozj.pdf" },
  { title: "सामाजिक अध्ययन कक्षा - ९", pdfUrl: "https://giwmscdnone.gov.np/media/pdf_upload/7.%20Reduced-class%209%20samajik%20final_0fnw909.pdf" },
  { title: "सामाजिक अध्ययन कक्षा - १०", pdfUrl: "https://giwmscdnone.gov.np/media/pdf_upload/1.%20Reduced-class%2010%20Samajik%20Final%202082.5.5_uymulzg.pdf" },
  { title: "अंग्रेजी कक्षा-८", pdfUrl: "https://giwmscdnone.gov.np/media/pdf_upload/1.%20Reduced-class%208%20English%20final_vfiq0xm.pdf" },
  { title: "नेपाली कक्षा - ५", pdfUrl: "https://giwmscdnone.gov.np/media/pdf_upload/Nepali%2005%20Final%20File_foagqer.pdf" },
  { title: "कार्यालय सञ्चालन तथा लेखा कक्षा - १०", pdfUrl: "https://giwmscdnone.gov.np/media/pdf_upload/Grade%2010_Account%20final_zeapqrn.pdf" },
  { title: "नेपाली कक्षा - १०", pdfUrl: "https://giwmscdnone.gov.np/media/pdf_upload/class%2010%20Nepali%20Final_kjvwvtg.pdf" },
  { title: "नेपाली कक्षा - ४", pdfUrl: "https://giwmscdnone.gov.np/media/pdf_upload/4.Reduced-Nepali%2004_nztgffb.pdf" },
  { title: "अंग्रेजी कक्षा - ६", pdfUrl: "https://giwmscdnone.gov.np/media/pdf_upload/3.%20Reducced-English%20Grade%206%20Final_fntvwhe.pdf" },
  { title: "विज्ञान तथा प्रविधि कक्षा - १०", pdfUrl: "https://giwmscdnone.gov.np/media/pdf_upload/2.%20Reduced-class%2010%20science%20Final%2011.2.2025_zbgnya7.pdf" },
  { title: "अंग्रेजी कक्षा - १०", pdfUrl: "https://giwmscdnone.gov.np/media/pdf_upload/9.Reduced-class%2010%20English%20Final_hsjc8bm.pdf" },
  { title: "विज्ञान तथा प्रविधि कक्षा - ९", pdfUrl: "https://giwmscdnone.gov.np/media/pdf_upload/8.Reduced-class%209%20Science%20final_lyfjyve.pdf" },
  { title: "नेपाली कक्षा - ९", pdfUrl: "https://giwmscdnone.gov.np/media/pdf_upload/6.Reduced-class%209%20Nepali_1tgrnzq.pdf" },
  { title: "अंग्रेजी कक्षा - ९", pdfUrl: "https://giwmscdnone.gov.np/media/pdf_upload/5.%20Reduced-class%209%20English%20final_5hjggyv.pdf" },
  { title: "कार्यालय सञ्चालन तथा लेखा कक्षा - ९", pdfUrl: "https://giwmscdnone.gov.np/media/pdf_upload/4.%20Reduced-class%209%20account%20final_9sk9qfx.pdf" },
  { title: "सामाजिक अध्ययन तथा मानवमूल्य शिक्षा कक्षा - ८", pdfUrl: "https://giwmscdnone.gov.np/media/pdf_upload/3.%20Reduced-Class%208%20Social%20study%20final_nl4c3bh.pdf" },
  { title: "नेपाली कक्षा-८", pdfUrl: "https://giwmscdnone.gov.np/media/pdf_upload/2.%20Reduced-class%208%20nepali%20final_ahsi1f6.pdf" },
  { title: "सामाजिक अध्ययन तथा मानवमूल्य शिक्षा कक्षा - ७", pdfUrl: "https://giwmscdnone.gov.np/media/pdf_upload/8.Reduced-class%207%20samajik%20Final_zq04sfi.pdf" },
  { title: "स्वास्थ्य, शारीरिक तथा सिर्जनात्मक कला कक्षा - ७", pdfUrl: "https://giwmscdnone.gov.np/media/pdf_upload/1.%20class%207%20health%20final-compressed_pqmbsce.pdf" },
  { title: "Optional Mathematics Grade-9", pdfUrl: "https://giwmscdnone.gov.np/media/pdf_upload/Final%20opt%20math%20eng%20for%20press%209%20(2082-11-26)%201-12%20PM%20(1)_1iwtizb.pdf" },
  { title: "ऐच्छिक गणित कक्षा-१०", pdfUrl: "https://giwmscdnone.gov.np/media/pdf_upload/Final%20OPT%20math%20class%2010%20for%20Press%20(11-16)_cljqcad.pdf" },
  { title: "अर्थशास्त्र कक्षा - १०", pdfUrl: "https://giwmscdnone.gov.np/media/pdf_upload/Class%2010%20Economics%20Final%20Edit%202082-11-16_ysjzl2g.pdf" },
  { title: "जनसङ्ख्या शिक्षा कक्षा - ९", pdfUrl: "https://giwmscdnone.gov.np/media/pdf_upload/class%209%20population%2022%20mangsir%202082%20Final_aohanvo.pdf" },
  { title: "स्वास्थ्य, शारीरिक तथा सिर्जनात्मक कला कक्षा - ४", pdfUrl: "https://giwmscdnone.gov.np/media/pdf_upload/2.%20Reduced-class%204%20health%20final_1nd5zum.pdf" },
  { title: "स्वास्थ्य, शारीरिक तथा सिर्जनात्मक कला कक्षा - ५", pdfUrl: "https://giwmscdnone.gov.np/media/pdf_upload/3.%20Reduced-class%205%20health%20final_yg4igv7.pdf" },
  { title: "नेपाली कक्षा - ६", pdfUrl: "https://giwmscdnone.gov.np/media/pdf_upload/4.Reduced-class%206%20Nepali%20final_hy7w99r.pdf" },
  { title: "सामाजिक अध्ययन तथा मानवमूल्य शिक्षा कक्षा - ६", pdfUrl: "https://giwmscdnone.gov.np/media/pdf_upload/5.Reduced-Class%206%20Social%20Final_l9n6lkg.pdf" },
  { title: "अंग्रेजी कक्षा - ७", pdfUrl: "https://giwmscdnone.gov.np/media/pdf_upload/6.%20Reduced-class%207%20English%20final_lro4mmc.pdf" },
  { title: "नेपाली कक्षा - ७", pdfUrl: "https://giwmscdnone.gov.np/media/pdf_upload/7.Reduced-class%207%20Nepali%20final_lnxtmxf.pdf" },
  { title: "विज्ञान तथा प्रविधि कक्षा - ७", pdfUrl: "https://giwmscdnone.gov.np/media/pdf_upload/9.Reduced-class%207%20science%20final_ypdi9pg.pdf" },
  { title: "अर्थशास्त्र कक्षा १०", pdfUrl: "https://giwmscdnone.gov.np/media/pdf_upload/%E0%A4%85%E0%A4%B0%E0%A5%8D%E0%A4%A5%E0%A4%B6%E0%A4%BE%E0%A4%B8%E0%A5%8D%E0%A4%A4%E0%A5%8D%E0%A4%B0%20%E0%A4%95%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A4%BE-%E0%A5%A7%E0%A5%A6%2C%20%E0%A5%A8%E0%A5%A6%E0%A5%AD%E0%A5%AB_doqflvd.pdf" },
  { title: "अर्थशास्र कक्षा १० (वि.स. २०७५) सच्याइएको प्रति", pdfUrl: "https://giwmscdnone.gov.np/media/pdf_upload/Economics%20(Grade-10)%20(final%20corrected%207-19_4ey50sb.pdf" },
  { title: "लेखाविधि (कक्षा ११)", pdfUrl: "https://giwmscdnone.gov.np/media/pdf_upload/Grade%2011_account%20final_orerrsn.pdf" },
  { title: "ऐच्छिक अंग्रेजी (कक्षा-११)", pdfUrl: "https://giwmscdnone.gov.np/media/pdf_upload/Optional%20English%20Grade-11_x851zhx.pdf" },
  { title: "इतिहास (कक्षा-९)", pdfUrl: "https://giwmscdnone.gov.np/media/pdf_upload/%E0%A4%87%E0%A4%A4%E0%A4%BF%E0%A4%B9%E0%A4%BE%E0%A4%B8%20%E0%A4%95%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A4%BE-%E0%A5%AF_3kf761a.pdf" },
  { title: "व्यवसाय अध्ययन (कक्षा-११)", pdfUrl: "https://giwmscdnone.gov.np/media/pdf_upload/%E0%A4%B5%E0%A5%8D%E0%A4%AF%E0%A4%B5%E0%A4%B8%E0%A4%BE%E0%A4%AF%20%E0%A4%85%E0%A4%A7%E0%A5%8D%E0%A4%AF%E0%A4%AF%E0%A4%A8%20%E0%A4%95%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A4%BE-%E0%A5%A7%E0%A5%A7_kwhxwfa.pdf" },
  { title: "कम्प्युटर विज्ञान (कक्षा-१०)", pdfUrl: "https://giwmscdnone.gov.np/media/pdf_upload/Computer%20Science%20-%20Grade%2010_tazdzp7.pdf" },
  { title: "भूगोल कक्षा १० (२०७६)", pdfUrl: "https://giwmscdnone.gov.np/media/pdf_upload/download%20(3)_nyy1bgm.pdf" },
  { title: "गणित कक्षा ६", pdfUrl: "https://giwmscdnone.gov.np/media/pdf_upload/%E0%A4%97%E0%A4%A3%E0%A4%BF%E0%A4%A4%20%E0%A4%95%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A4%BE%20-%E0%A5%AC%20(%E0%A4%A8%E0%A5%87%E0%A4%AA%E0%A4%BE%E0%A4%B2%E0%A5%80%20%E0%A4%B8%E0%A4%82%E0%A4%B8%E0%A5%8D%E0%A4%95%E0%A4%B0%E0%A4%A3)_u9wxqsf.pdf" },
  { title: "सामाजिक अध्ययन कक्षा १०", pdfUrl: "https://giwmscdnone.gov.np/media/pdf_upload/updated%E0%A4%B8%E0%A4%BE%E0%A4%AE%E0%A4%BE%E0%A4%9C%E0%A4%BF%E0%A4%95%20%E0%A4%85%E0%A4%A7%E0%A5%8D%E0%A4%AF%E0%A4%AF%E0%A4%A8%20%E0%A4%95%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A4%BE%20%E0%A5%A7%E0%A5%A6_seu2bim_vcjwwer.pdf" },
  { title: "मेरो नेपाली कक्षा १", pdfUrl: "https://giwmscdnone.gov.np/media/pdf_upload/%E0%A4%AE%E0%A5%87%E0%A4%B0%E0%A5%8B%20%E0%A4%A8%E0%A5%87%E0%A4%AA%E0%A4%BE%E0%A4%B2%E0%A5%80%20%E0%A4%95%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A4%BE%20%E0%A5%A7_yj4bcfx.pdf" },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB\n");

    let added = 0;
    let skipped = 0;

    for (const textbook of textbooks) {
      const grade = parseGrade(textbook.title);
      const mapKey = getMapKey(textbook.title);
      const coverImage = mapKey ? subjectCoverMap[mapKey] : "/images/books/book_subject_generic.svg";
      const category = getCategory(textbook.title);
      const author = getAuthor(textbook.title);

      const existing = await Book.findOne({ title: textbook.title, author });

      if (existing) {
        console.log(`  Skipped (exists): ${textbook.title}`);
        skipped++;
      } else {
        const subcategory = grade >= 1 && grade <= 12 ? `Class ${grade}` : "General";
        await Book.create({
          title: textbook.title,
          author,
          category,
          subcategory,
          description: `${textbook.title} - CDC Nepal Official Textbook${grade >= 1 && grade <= 12 ? ` (Grade ${grade})` : ""}. Published by Curriculum Development Centre, Sanothimi, Bhaktapur, Nepal.`,
          coverImage,
          publishYear: 2025,
          price: 0,
          totalCopies: 1,
          availableCopies: 1,
          status: "available",
          tags: ["textbook", "cdc", "nepal", `class-${grade}`, category.toLowerCase()],
          source: "CDC Nepal",
          sourceUrl: textbook.pdfUrl,
        });
        console.log(`  [${category}] ${textbook.title}`);
        added++;
      }
    }

    console.log(`\nDone! Added: ${added}, Skipped: ${skipped}`);
    mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

seed();
