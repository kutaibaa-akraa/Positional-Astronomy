// Position eines Gestirns, englische Texte und Defaultwerte
// Letzte �nderung 25.03.2016

// Texte in HTML-Schreibweise:

var text101 = "الطول الجغرافي";
var text103 = "العرض الجغرافي";
var text105 = "التاريخ";
var text106 = "الوقت";
var text107 = "<span dir=\"ltr\">h (UT)</span>";
var text108 = "المطلع المستقيم";
var text109 = "الميل";
var text110 = "إعادة تعيين";
var text111 = ["إبدأ", "توقف مؤقت", "متابعة"];
var text12 = "تركيز الانتباه نحو";

var author = "&nbsp;&nbsp;&copy;&nbsp; W. Fendt 1999 <br>تمت الترجمة و إعادة ترتيب بجهود<br>&nbsp;&nbsp; قتيبة أقرع - 2017";

// Symbole und Einheiten:

var dateSeparator = "/";
var timeSeparator = ":";
var decimalSeparator = ".";                                // Dezimaltrennzeichen (Komma/Punkt)
var degree = "&deg;درجة";

// Texte in Unicode-Schreibweise:

var text102 = ["شرقاً","غرباً"];
var text104 = ["شمالاً", "جنوباً"];
var text13 = ["", "نقطة الرصد", "الأفق",
              "نقطة الشمال", "نقطة الغرب", "نقطة الجنوب", "نقطة الشرق", 
              "سمت الرأس", "النظير", "خط منتصف النهار", "دائرة الارتفاع", 
              "القطب السماوي الشمالي", "القطب السماوي الجنوبي", "محور القبة السماوية", "دائرة الاستواء السماوية",
              "اعتدال ربيعي", "دائرة الساعة", "وقت نجمي",
              "زاوية الساعة", "النجم", "مسار النجم",
              "مطلع مستقيم", "الميل", "زاوية الانحراف", "زاوية الارتفاع", "المثلث البحري"];
var text14 = "الوقت";
var text15 = "زمن نجمي";
var text16 = "زاوية الانحراف";
var text17 = "زاوية الساعة";
var text18 = "زاوية الارتفاع";

// Symbole und Einheiten:

var symbolObserver = "موقع الراصد";                                  // Beobachtungsort
var symbolNorth = "شمال";                                     // Nordpunkt
var symbolWest = "غرب";                                      // Westpunkt
var symbolSouth = "جنوب";                                     // S�dpunkt
var symbolEast = "شرق";                                      // Ostpunkt
var symbolZenith = "سمت الرأس";                                   // Zenit
var symbolNadir = "النظير";                                    // Nadir
var symbolNorthPole = "ق س ش";                                // Himmelsnordpol
var symbolSouthPole = "ق س ج";                                // Himmelss�dpol
var symbolVernalEquinox = "الاعتدال الربيعي";                             // Fr�hlingspunkt
var symbolStar = "نجم";                                     // Stern
var symbolHour = "h";                                      // Stunde

// Defaultwerte:

var defaultLongitude = 36*DEG;                              // Geographische L�nge (دمشق)
var defaultLatitude = 33*DEG;                              // Geographische Breite (دمشق)
var defaultDay = 1;                                        // Tag
var defaultMonth = 1;                                      // Monat
var defaultYear = 2017;                                    // Jahr
var defaultTimeZone = 0;                                   // Zeitzone relativ zu UT (h)