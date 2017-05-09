// Position eines Gestirns
// Java-Applet (11.02.1999) umgewandelt
// 15.03.2016 - 01.04.2016

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in ver�nderter Form - f�r nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabh�ngige Texte sind einer eigenen Datei (zum Beispiel starposition_de.js) abgespeichert.

// Farben:

var colorBackground = "#F9F5EC";                           // Hintergrundfarbe
var colorHeaven = "#00ffff";                               // Farbe f�r Himmelskugel
var colorHorizon = "#00ff00";                              // Farbe f�r Horizontebene
var colorEarth = "#ffc040";                                // Farbe f�r Bereich unter dem Horizont
var colorVisible = "#ff00ff";                              // Farbe f�r Objekte �ber dem Horizont
var colorEmphasize = "#ff0000";                            // Farbe f�r Hervorhebungen

// Sonstige Konstanten:

var DEG = Math.PI/180;                                     // 1 Grad (Bogenma�)
var PIH = Math.PI/2;                                       // Abk�rzung f�r pi/2
var FONT = "normal normal bold 12px sans-serif";           // Normaler Zeichensatz
var R = 140;                                               // Radius Himmelkugel (Pixel)
var N = [1, 0, 0];                                         // Vektor f�r Nordpunkt
var W = [0, 1, 0];                                         // Vektor f�r Westpunkt
var S = [-1, 0, 0];                                        // Vektor f�r S�dpunkt
var O = [0, -1, 0];                                        // Vektor f�r Ostpunkt
var ZE = [0, 0, 1];                                        // Vektor f�r Zenit
var NA = [0, 0, -1];                                       // Vektor f�r Nadir
var NIV = 180;                                             // Zahl der Teilintervalle (f�r Kreisb�gen)
var ML = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; // Monatsl�ngen
var T_ROT = 120;                                           // Umlaufdauer Himmelskugel (s)

// Attribute:

var canvas, ctx;                                           // Zeichenfl�che, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfl�che (Pixel)
var ip1, ip2;                                              // Eingabefelder (geographische L�nge und Breite)
var ch1, ch2;                                              // Auswahlfelder (geographische L�nge und Breite)
var ip3D, ip3M, ip3Y;                                      // Eingabefelder (Tag, Monat, Jahr)
var ip4H, ip4M;                                            // Eingabefelder (Stunde, Minute)
var ip5, ip6;                                              // Eingabefelder (Rektaszension, Deklination)
var bu1, bu2;                                              // Schaltkn�pfe
var ch3;                                                   // Auswahlfeld (Hervorhebung)
var sl1, sl2;                                              // Schieberegler (Blickrichtung, Azimut und H�he)

var uM, vM;                                                // Mittelpunkt der Himmelskugel (Pixel)
var t;                                                     // Zeitvariable f�r Drehung der Himmelskugel (s)
var tBl;                                                   // Zeitvariable f�r Blinken (s)
var on;                                                    // Flag f�r Drehung der Himmelskugel
var t0;                                                    // Bezugszeitpunkt
var thetaP;                                                // Richtungswinkel f�r Projektionsrichtung (Bogenma�)
var phiP;                                                  // H�henwinkel f�r Projektionsrichtung (Bogenma�)
var proj;                                                  // Einheitsvektor f�r Projektionsrichtung
var projX;                                                 // Einheitsvektor f�r Richtung nach rechts
var projY;                                                 // Einheitsvektor f�r Richtung nach oben
var a1, b1;                                                // Einheitsvektoren f�r Klein- und Gro�kreise
var gLong;                                                 // Geographische L�nge (Bogenma�, -pi bis +pi)
var gLat;                                                  // Geographische Breite (Bogenma�, -pi/2 bis +pi/2)
var day, month, year;                                      // Datum
var hour, minute;                                          // Uhrzeit
var sidTime;                                               // Sternzeit (Bogenma�)
var hourAngle;                                             // Stundenwinkel (Bogenma�)
var rightAsc, declin;                                      // Rektaszension, Deklination (Bogenma�)
var azimuth, altitude;                                     // Azimut, H�he (Bogenma�)
var np, sp;                                                // Einheitsvektoren f�r Himmelsnord- und s�dpol
var s1;                                                    // Einheitsvektor f�r Schnittpunkt �quator - Meridian
var f;                                                     // Einheitsvektor f�r Fr�hlingspunkt
var star;                                                  // Einheitsvektor f�r Stern
var h;                                                     // Einheitsvektor f�r Punkt auf Klein- oder Gro�kreis
var timeZone;                                              // Zeitzone relativ zu UT (h)

// Element der Schaltfl�che (aus HTML-Datei):
// id ..... ID im HTML-Befehl
// text ... Text (optional)

function getElement (id, text) {
  var e = document.getElementById(id);                     // Element
  if (text) e.innerHTML = text;                            // Text festlegen, falls definiert
  return e;                                                // R�ckgabewert
  } 

// Start:

function start () {
  canvas = getElement("cvx");                               // Zeichenfl�che
  width = canvas.width; height = canvas.height;            // Abmessungen (Pixel)
  ctx = canvas.getContext("2d");                           // Grafikkontext
  uM = width/2; vM = R+18;                                 // Mittelpunkt der Himmelskugel (Pixel)
  getElement("ip1a",text101);                               // Erkl�render Text (geographische L�nge)
  ip1 = getElement("ip1b");                                // Eingabefeld (geographische L�nge)
  getElement("ip1c",degree);                               // Einheit (geographische L�nge)
  ch1 = newSelect("ip1d",text102);                          // Auswahlfeld (�stliche/westliche L�nge)
  getElement("ip2a",text103);                               // Erkl�render Text (geographische Breite)
  ip2 = getElement("ip2b");                                // Eingabefeld (geographische Breite)
  getElement("ip2c",degree);                               // Einheit (geographische Breite)
  ch2 = newSelect("ip2d",text104);                          // Auswahlfeld (geographische Breite)
  getElement("ip3a",text105);                               // Erkl�render Text (Datum)
  ip3D = getElement("ip3b");                               // Eingabefeld (Tag)  
  getElement("ip3c",dateSeparator);                        // Trennzeichen (Datum)
  ip3M = getElement("ip3d");                               // Eingabefeld (Monat)  
  getElement("ip3e",dateSeparator);                        // Trennzeichen (Datum)
  ip3Y = getElement("ip3f");                               // Eingabefeld (Jahr)
  getElement("ip4a",text106);                               // Erkl�render Text (Uhrzeit)
  ip4H = getElement("ip4b");                               // Eingabefeld (Stunde)
  getElement("ip4c",timeSeparator);                        // Trennzeichen (Uhrzeit)
  ip4M = getElement("ip4d");                               // Eingabefeld (Minute)
  getElement("ip4e",text107);                               // Erkl�render Text (Zeitzone)
  getElement("ip5a",text108);                               // Erkl�render Text (Rektaszension)
  ip5 = getElement("ip5b");                                // Eingabefeld (Rektaszension)
  getElement("ip5c",degree);                               // Einheit (Rektaszension)
  getElement("ip6a",text109);                               // Erkl�render Text (Deklination)
  ip6 = getElement("ip6b");                                // Eingabefeld (Deklination)
  getElement("ip6c",degree);                               // Einheit (Deklination)
  bu1 = getElement("bu1",text110);                          // Schaltknopf (Reset)
  bu2 = getElement("bu2",text111[0]);                       // Schaltknopf (Start/Pause/Weiter)
  getElement("ip7a",text12);                               // Erkl�render Text (Hervorheben)
  ch3 = newSelect("ip7b",text13);                          // Auswahlfeld (Hervorheben)
  sl1 = getElement("ip8");                                 // Schieberegler (Himmelrichtung Projektion)
  sl2 = getElement("ip9");                                 // Schieberegler (H�henwinkel Projektion)
  getElement("author",author);                             // Autor (und �bersetzer) 

  var timer = setInterval(paint,40);                       // Timer f�r Animation
  on = false;                                              // Drehung der Himmelskugel zun�chst abgeschaltet
  t0 = new Date();                                         // Bezugszeitpunkt
  setButton2State(0);                                      // Zustand vor dem Start
  defaultValues();                                         // Startwerte
  updateInput();                                           // Eingabe- und Auswahlfelder anpassen
  calculation();                                           // Zeitunabh�ngige Berechnungen
  enableInput(true);                                       // Eingabe aktivieren
  
  ip1.onkeydown = reactionEnter;                           // Reaktion auf Enter-Taste (Eingabe geographische L�nge)
  ch1.onchange = reaction;                                 // Reaktion auf Auswahlfeld (�stliche/westliche L�nge)
  ip2.onkeydown = reactionEnter;                           // Reaktion auf Enter-Taste (Eingabe geographische Breite)
  ch2.onchange = reaction;                                 // Reaktion auf Auswahlfeld (n�rdliche/s�dliche Breite)
  ip3D.onkeydown = reactionEnter;                          // Reaktion auf Enter-Taste (Eingabe Tag)
  ip3M.onkeydown = reactionEnter;                          // Reaktion auf Enter-Taste (Eingabe Monat)
  ip3Y.onkeydown = reactionEnter;                          // Reaktion auf Enter-Taste (Eingabe Jahr)
  ip4H.onkeydown = reactionEnter;                          // Reaktion auf Enter-Taste (Eingabe Stunde)
  ip4M.onkeydown = reactionEnter;                          // Reaktion auf Enter-Taste (Eingabe Minute)
  ip5.onkeydown = reactionEnter;                           // Reaktion auf Enter-Taste (Eingabe Rektaszension)
  ip6.onkeydown = reactionEnter;                           // Reaktion auf Enter-Taste (Eingabe Deklination)
  bu1.onclick = reactionReset;                             // Reaktion auf Schaltknopf (Reset)
  bu2.onclick = reactionStart;                             // Reaktion auf Schaltknopf (Start/Pause/Weiter)
  sl1.onchange = reactionSlider;                           // Reaktion auf Schieberegler (Richtungswinkel Projektion)
  sl1.oninput = reactionSlider;                            // Reaktion auf Schieberegler (Richtungswinkel Projektion)
  sl1.onclick = reactionSlider;                            // Reaktion auf Schieberegler (Richtungswinkel Projektion)
  sl2.onchange = reactionSlider;                           // Reaktion auf Schieberegler (H�henwinkel Projektion)
  sl2.oninput = reactionSlider;                            // Reaktion auf Schieberegler (H�henwinkel Projektion)
  sl2.onclick = reactionSlider;                            // Reaktion auf Schieberegler (H�henwinkel Projektion)
        
  } // Ende der Methode start
  
// Neues Auswahlfeld:
// id .... ID-Angabe im HTML-Text
// txt ... Array mit den Auswahlm�glichkeiten
// R�ckgabewert: Auswahlfeld
  
function newSelect (id, txt) {
  var ch = getElement(id);                                 // Auswahlfeld (aus HTML-Text)
  for (var i=0; i<txt.length; i++) {                       // F�r alle Indizes ...
    var o = document.createElement("option");              // Neues option-Element
    o.text = txt[i];                                       // Text des Elements �bernehmen 
    ch.add(o);                                             // Element zur Liste hinzuf�gen
    }
  return ch;                                               // R�ckgabewert
  }
  
// Zustandsfestlegung f�r Schaltknopf Start/Pause/Weiter:
// st ... Gew�nschter Zustand (0, 1 oder 2)
// Seiteneffekt bu2.state, Schaltknopftext
  
function setButton2State (st) {
  bu2.state = st;                                          // Zustand speichern
  bu2.innerHTML = text111[st];                              // Text aktualisieren
  }
  
// Umschalten des Schaltknopfs Start/Pause/Weiter:
// Seiteneffekt bu2.state, Schaltknopftext
  
function switchButton2 () {
  var st = bu2.state;                                      // Momentaner Zustand
  if (st == 0) st = 1;                                     // Falls Ausgangszustand, starten ...
  else st = 3-st;                                          // Sonst Wechsel zwischen Animation und Unterbrechung
  setButton2State(st);                                     // Neuen Zustand speichern, Text �ndern
  }
  
// Hilfsroutine: Eingabe �bernehmen, rechnen, Ausgabefelder aktualisieren
// Seiteneffekt gLong, gLat, day, month, year, hour, minute, rightAsc, declin, np, sp, proj, projX, projY, s1

function reaction () {
  input();                                                 // Eingegebene Werte �bernehmen (eventuell korrigiert)
  calculation();                                           // Berechnungen, Ausgabefelder aktualisieren
  }
 
// Reaktion auf Tastendruck (nur auf Enter-Taste):
// Seiteneffekt gLong, gLat, day, month, year, hour, minute, rightAsc, declin, np, sp, proj, projX, projY, s1
  
function reactionEnter (e) {
  if (e.key && String(e.key) == "Enter"                    // Falls Entertaste (Firefox/Internet Explorer) ...
  || e.keyCode == 13)                                      // Falls Entertaste (Chrome) ...
    reaction();                                            // ... Daten �bernehmen, rechnen, Ausgabe aktualisieren
  }
   
// Reaktion auf Resetknopf:
// Seiteneffekt bu2.state, proj, projX, projY, a1, b1, np, sp, s1, f, star, h, gLong, gLat, day, month, year, hour, minute, timeZone,
// rightAsc, declin, thetaP, phiP, t, tBl, on, Wirkung auf Eingabe- und Auswahlfelder
   
function reactionReset () {
  setButton2State(0);                                      // Zustand des Schaltknopfs Start/Pause/Weiter
  defaultValues();                                         // Startwerte
  updateInput();                                           // Eingabe- und Auswahlfelder anpassen
  on = false;                                              // Animation stoppen
  enableInput(true);                                       // Eingabe aktivieren  
  t = tBl = 0;                                             // Zeitvariable zur�cksetzen
  reaction();                                              // Eingegebene Werte �bernehmen und rechnen
  ch3.selectedIndex = 0;                                   // Auswahlfeld Hervorheben zur�cksetzen
  ch3.disabled = false;                                    // Auswahlfeld Hervorheben aktivieren
  }
  
// Reaktion auf den Schaltknopf Start/Pause/Weiter:
// Seiteneffekt bu2.state, on, day, month, year, hour, minute, t, tBl, gLong, gLat, rightAsc, declin, np, sp, proj, projX, projY, s1, 
// Wirkung auf Eingabe- und Auswahlfelder

function reactionStart () {
  switchButton2();                                         // Zustand des Schaltknopfs �ndern
  enableInput(false);                                      // Eingabefelder deaktivieren
  on = (bu2.state == 1);                                   // Flag f�r Drehung der Himmelskugel
  if (on)                                                  // Falls Drehung der Himmelskugel eingeschaltet ...
    ch3.selectedIndex = 0;                                 // Auswahlfeld Hervorheben zur�cksetzen
  else {                                                   // Falls Drehung der Himmelskugel abgeschaltet ...
    updateTime(t/T_ROT);                                   // Variablen f�r Datum und Uhrzeit aktualisieren
    updateInputTime(false);                                // Eingabefelder f�r Datum und Uhrzeit aktualisieren
    t = tBl = 0;                                           // Zeitvariable zur�cksetzen
    }
  ch3.disabled = on;                                       // Auswahlfeld Hervorheben aktivieren oder deaktivieren
  reaction();                                              // Eingegebene Werte �bernehmen und rechnen
  updateInput();                                           // Eingabefelder aktualisieren
  }
  
// Reaktion auf Schieberegler (Projektionsrichtung):
// Seiteneffekt thetaP, phiP, np, sp, proj, projX, projY, s1

function reactionSlider () {
  thetaP = sl1.value*10*DEG;                               // Richtungswinkel Projektion (Bogenma�)
  phiP = sl2.value*5*DEG;                                  // H�henwinkel Projektion (Bogenma�)
  calculation();                                           // Zeitunabh�ngige Berechnungen
  }
  
// Aktivieren / Deaktivieren von Eingabe- und Auswahlfeldern:
// a ... Flag f�r Aktivierung

function enableInput (a) {
  ip1.disabled = ch1.disabled = !a;                        // Geographische L�nge
  ip2.disabled = ch2.disabled = !a;                        // Geographische Breite
  ip3D.disabled = ip3M.disabled = ip3Y.disabled = !a;      // Datum
  ip4H.disabled = ip4M.disabled = !a;                      // Uhrzeit
  ip5.disabled = ip6.disabled = !a;                        // Rektaszension, Deklination
  }

//-------------------------------------------------------------------------------------------------

// Startwerte:
// Seiteneffekt proj, projX, projY, a1, b1, np, sp, s1, f, star, h, gLong, gLat, day, month, year, hour, minute, timeZone,
// rightAsc, declin, thetaP, phiP, t, tBl

function defaultValues () {
  proj = new Array(3);                                     // Einheitsvektor Projektionsrichtung 
  projX = new Array(3);                                    // Einheitsvektor f�r Richtung nach rechts 
  projY = new Array(3);                                    // Einheitsvektor f�r Richtung nach oben
  a1 = new Array(3); b1 = new Array(3);                    // Einheitsvektoren f�r Klein- und Gro�kreise
  np = new Array(3); sp = new Array(3);                    // Einheitsvektoren der Himmelspole
  s1 = new Array(3);                                       // Einheitsvektor f�r Schnittpunkt �quator - Meridian
  f = new Array(3);                                        // Einheitsvektor Fr�hlingspunkt
  star = new Array(3);                                     // Einheitsvektor Stern
  h = new Array(3);                                        // Einheitsvektor f�r Punkt auf Klein- oder Gro�kreis
  gLong = defaultLongitude;                                // Geographische L�nge (Bogenma�) 
  gLat = defaultLatitude;                                  // Geographische Breite (Bogenma�)
  day = defaultDay;                                        // Tag
  month = defaultMonth;                                    // Monat
  year = defaultYear;                                      // Jahr
  hour = minute = 0;                                       // Stunde, Minute
  timeZone = defaultTimeZone;                              // Zeitzone relativ zu UT (h)
  rightAsc = 60*DEG; declin = 20*DEG;                      // Rektaszension, Deklination (Bogenma�)
  thetaP = 90*DEG; phiP = 20*DEG;                          // Winkel f�r Projektionsrichtung (Bogenma�)
  t = tBl = 0;                                             // Zeitvariable (s)
  }
  
// Umwandlung einer Zahl in eine Zeichenkette:
// n ..... Gegebene Zahl
// d ..... Zahl der Stellen
// fix ... Flag f�r Nachkommastellen (im Gegensatz zu g�ltigen Ziffern)

function ToString (n, d, fix) {
  var s = (fix ? n.toFixed(d) : n.toPrecision(d));         // Zeichenkette mit Dezimalpunkt
  return s.replace(".",decimalSeparator);                  // Eventuell Punkt durch Komma ersetzen
  }
  
// Eingabe einer Zahl:
// ef .... Eingabefeld
// d ..... Zahl der Stellen
// fix ... Flag f�r Nachkommastellen (im Gegensatz zu g�ltigen Ziffern)
// min ... Minimum des erlaubten Bereichs
// max ... Maximum des erlaubten Bereichs
// R�ckgabewert: Zahl oder NaN
// Wirkung auf Eingabefeld
  
function inputNumber (ef, d, fix, min, max) {
  var s = ef.value;                                        // Zeichenkette im Eingabefeld
  s = s.replace(",",".");                                  // Eventuell Komma in Punkt umwandeln
  var n = Number(s);                                       // Umwandlung in Zahl, falls m�glich
  if (isNaN(n)) n = 0;                                     // Sinnlose Eingaben als 0 interpretieren 
  if (n < min) n = min;                                    // Falls Zahl zu klein, korrigieren
  if (n > max) n = max;                                    // Falls Zahl zu gro�, korrigieren
  ef.value = ToString(n,d,fix);                            // Eingabefeld eventuell korrigieren
  return n;                                                // R�ckgabewert
  }
  
// Eingabe- und Auswahlfelder f�r Position aktualisieren:

function updateInputPosition () {
  ip1.value = ToString(Math.abs(gLong/DEG),1,true);        // Eingabefeld geographische L�nge
  ch1.selectedIndex = (gLong>=0 ? 0 : 1);                  // Auswahlfeld �stliche/westliche L�nge
  ip2.value = ToString(Math.abs(gLat/DEG),1,true);         // Eingabefeld geographische Breite
  ch2.selectedIndex = (gLat>=0 ? 0 : 1);                   // Auswahlfeld n�rdliche/s�dliche Breite
  }

// Eingabefelder f�r Zeit aktualisieren:
// empty ... Flag f�r leere Eingabefelder

function updateInputTime (empty) {
  ip3D.value = (empty ? "" : ""+day);                      // Tag
  ip3M.value = (empty ? "" : ""+month);                    // Monat
  ip3Y.value = (empty ? "" : ""+year);                     // Jahr
  ip4H.value = (empty ? "" : ""+hour);                     // Stunde
  var s = (minute<10 ? "0"+minute : ""+minute);            // Zeichenkette f�r Minuten (zweistellig)
  ip4M.value = (empty ? "" : s);                           // Minute
  }

// Eingabefelder f�r Koordinaten aktualisieren:

function updateInputCoord () {
  ip5.value = ToString(rightAsc/DEG,1,true);               // Eingabefeld Rektaszension 
  ip6.value = ToString(declin/DEG,1,true);                 // Eingabefeld Deklination
  }
  
// Gesamte Eingabe aktualisieren:

function updateInput () {
  updateInputPosition();                                   // Eingabe- und Auswahlfelder f�r Position
  updateInputTime(on);                                     // Eingabefelder f�r Zeit
  updateInputCoord();                                      // Eingabefelder f�r Koordinaten
  sl1.value = Math.round(thetaP/(10*DEG));                 // Schieberegler f�r Richtungswinkel Projektion
  sl2.value = Math.round(phiP/(5*DEG));                    // Schieberegler f�r H�henwinkel Projektion
  }
  
// Korrektur der Datumsangabe:
// Seiteneffekt day

function correctDate () {
  var leapdays = (month == 2 && isLeapYear(year) ? 1 : 0); // Zahl der Schalttage im aktuellen Monat (0 oder 1)
  if (day > ML[month]+leapdays) {                          // Falls Monatsl�nge �berschritten ...
    day = ML[month]+leapdays;                              // Letzter Tag im Monat
    ip3D.value = String(day);                              // Eingabefeld aktualisieren
    }
  }
  
// Gesamte Eingabe:
// Seiteneffekt gLong, gLat, day, month, year, hour, minute, rightAsc, declin

function input () {
  var iGL = ch1.selectedIndex;                             // Index in Auswahlfeld �stl./westl. L�nge (0 oder 1)
  gLong = (1-2*iGL)*DEG*inputNumber(ip1,1,true,0,180);     // Geographische L�nge (Bogenma�)
  var iGB = ch2.selectedIndex;                             // Index in Auswahlfeld n�rdl./s�dl. Breite (0 oder 1)
  gLat = (1-2*iGB)*DEG*inputNumber(ip2,1,true,0,90);       // Geographische Breite (Bogenma�)
  day = inputNumber(ip3D,0,true,1,31);                     // Tag
  month = inputNumber(ip3M,0,true,1,12);                   // Monat
  year = inputNumber(ip3Y,0,true,1600,9999);               // Jahr
  correctDate();                                           // Falls n�tig, Datum korrigieren
  hour = inputNumber(ip4H,0,true,0,23);                    // Stunde
  minute = inputNumber(ip4M,0,true,0,59);                  // Minute
  if (minute < 10) ip4M.value = "0"+minute;                // Gegebenenfalls Minutenangabe mit f�hrender Null
  rightAsc = DEG*inputNumber(ip5,1,true,0,359.9);          // Rektaszension (Bogenma�)
  declin = DEG*inputNumber(ip6,1,true,-90,90);             // Deklination (Bogenma�)
  }
  
// Skalarprodukt:
// v1, v2 ... Arrays der gegebenen Vektoren

function dotProduct (v1, v2) {
  return v1[0]*v2[0]+v1[1]*v2[1]+v1[2]*v2[2];
  }
  
// Vektorprodukt:
// v1, v2 ... Arrays der gegebenen Vektoren
// res ...... Vorbereitetes Array f�r Ergebnisvektor

function crossProduct (v1, v2, res) {
  res[0] = v1[1]*v2[2]-v1[2]*v2[1];                        // x-Koordinate
  res[1] = v1[2]*v2[0]-v1[0]*v2[2];                        // y-Koordinate
  res[2] = v1[0]*v2[1]-v1[1]*v2[0];                        // z-Koordinate
  }

// Normierung eines Vektors:
// a ... Array des zu normierenden Vektors
// Nullvektor bleibt unver�ndert

function normierung (a) {
  var norm = Math.sqrt(a[0]*a[0]+a[1]*a[1]+a[2]*a[2]);     // Betrag des Vektors   
  if (norm > 0) {                                          // Falls Betrag ungleich 0 ...
    a[0] /= norm; a[1] /= norm; a[2] /= norm;              // Division der Koordinaten durch den Betrag
    }
  }
  
// Normiertes Vektorprodukt:
// a, b ... Arrays der gegebenen Vektoren
// erg .... Array f�r Ergebnisvektor

function normCrossProduct (a, b, erg) {
  crossProduct(a,b,erg);                                   // Vektorprodukt
  normierung(erg);                                         // Zugeh�riger Einheitsvektor
  }

// Zeitunabh�ngige Berechnungen:
// Seiteneffekt np, sp, proj, projX, projY, s1

function calculation () {
  np[0] = Math.cos(gLat); np[1] = 0; np[2] = Math.sin(gLat);  // Einheitsvektor Himmelsnordpol
  sp[0] = -np[0]; sp[1] = 0; sp[2] = -np[2];               // Einheitsvektor Himmelss�dpol
  proj[0] = Math.cos(phiP)*Math.cos(thetaP);               // Einheitsvektor Projektionsrichtung, x-Koordinate
  proj[1] = Math.cos(phiP)*Math.sin(thetaP);               // Einheitsvektor Projektionsrichtung, y-Koordinate
  proj[2] = Math.sin(phiP);                                // Einheitsvektor Projektionsrichtung, z-Koordinate
  normCrossProduct(ZE,proj,projX);                         // Einheitsvektor nach rechts f�r Projektion (projX)
  crossProduct(proj,projX,projY);                          // Einheitsvektor nach oben f�r Projektion (projY)
  s1[0] = -Math.sin(gLat); s1[1] = 0; s1[2] = Math.cos(gLat); // Einheitsvektor Schnittpunkt �quator - Meridian
  }
  
// �berpr�fung der Schaltjahreigenschaft:
// year ... Jahreszahl

function isLeapYear (year) {
  return (year%4 == 0 && year%100 != 0 || year%400 == 0);
  }

// Tagesnummer:
// year .... Jahr
// month ... Monat
// day ..... Tag
// R�ckgabewert: Zahl der Tage, die seit 1.1.1 vergangen sind; Gregorianischer Kalender vorausgesetzt!

function numberDays (year, month, day) {
  var j = year-1;                                          // Zahl der vergangenen Jahre 
  var nd = j*365+Math.floor(j/4)-Math.floor(j/100)+Math.floor(j/400);  // Entsprechende Zahl von Tagen
  for (var i=1; i<month; i++) nd += ML[i];                 // Tage der vergangenen Monate addieren (ohne 29.02.)
  if (month > 2 && isLeapYear(year)) nd++;                 // Gegebenenfalls Schalttag addieren 
  nd += day-1;                                             // Tage des aktuellen Monats addieren
  return nd;                                               // R�ckgabewert
  }

// Sternzeit (Bogenma�):
// y, mo, d ... Datum: Jahr, Monat, Tag
// h, mi ...... Uhrzeit (Weltzeit): Stunde, Minute
// long ....... geographische L�nge (Bogenma�, �stl. positiv)

function siderealTime (y, mo, d, h, min, long) {
  var nd = numberDays(y,mo,d) - 711856;                    // Zahl der Tage seit 1.1.1 (Gregorianischer Kalender!)
  var t = h/24 + minute/1440;                              // Vergangener Teil des aktuellen Tages
  var theta = t*1.00273790934 + (nd-12785)*2.73790934e-3;  // Zahl der Umdrehungen
  theta += 0.279420919 + long/(2*Math.PI);                 // Geographische L�nge ber�cksichtigen
  theta = theta-Math.floor(theta);                         // Ganze Umdrehungen weglassen
  return theta*2*Math.PI;                                  // R�ckgabewert (Bogenma�)
  }
  
// N�chster Tag: Variable f�r Datum weiterz�hlen
// Seiteneffekt day, month, year

function nextDay () {
  var leapDay = (month == 2 && isLeapYear(year) ? 1 : 0);  // Zahl der Schalttage im aktuellen Monat (0 oder 1)
  day++;                                                   // Variable f�r Tag hochz�hlen
  if (day > ML[month]+leapDay) {day = 1; month++;}         // Falls Monatsl�nge �berschritten, Anfang des n�chsten Monats
  if (month > 12) {month = 1; year++;}                     // Falls Jahresl�nge �berschritten, Anfang des n�chsten Jahres
  }

// Variable f�r Datum und Uhrzeit aktualisieren:
// t ... Zahl der Tage
// Seiteneffekt day, month, year, hour, minute

function updateTime (t) {
  var n = Math.floor(t);                                   // Zahl der kompletten Tage
  t -= n;                                                  // Bruchteil des aktuellen Tages
  for (var i=0; i<n; i++) nextDay();                       // Komplette Tage ber�cksichtigen
  t *= 24;                                                 // Umrechnung in Stunden
  n = Math.floor(t);                                       // Zahl der kompletten Stunden
  t -= n;                                                  // Bruchteil der aktuellen Stunde
  hour += n;                                               // Komplette Stunden ber�cksichtigen
  t *= 60;                                                 // Umrechnung in Minuten 
  n = Math.floor(t);                                       // Zahl der kompletten Minuten
  minute += n;                                             // Komplette Minuten ber�cksichtigen 
  if (minute >= 60) {minute -= 60; hour++;}                // Falls n�tig, Stunde hochz�hlen
  if (hour >= 24) {hour -= 24; nextDay();}                 // Falls n�tig, Tag, Monat, Jahr hochz�hlen
  }
  
// Zeitabh�ngige Berechnungen:
// Seiteneffekt sidTime, f, hourAngle, st, azimuth, altitude

function calculationT () {
  var tt = t/T_ROT;                                        // Zeitvariable f�r Drehung der Himmelskugel
  var st0 = siderealTime(year,month,day,hour-timeZone,minute,gLong); // Sternzeit am Anfang der Drehung (Bogenma�)
  sidTime = st0+(tt-Math.floor(tt))*2*Math.PI;             // Aktuelle Sternzeit (Bogenma�)
  var cos = Math.cos(sidTime);                             // Cosinuswert der Sternzeit
  f[0] = cos*s1[0];                                        // Ortsvektor Fr�hlingspunkt, x-Koordinate
  f[1] = cos*s1[1]+Math.sin(sidTime);                      // Ortsvektor Fr�hlingspunkt, y-Koordinate
  f[2] = cos*s1[2];                                        // Ortsvektor Fr�hlingspunkt, z-Koordinate
  hourAngle = sidTime-rightAsc;                            // Stundenwinkel (Bogenma�, vorl�ufig) 
  if (hourAngle < 0) hourAngle += 2*Math.PI;               // Stundenwinkel (Bogenma�, zwischen 0 und 2 pi)
  cos = Math.cos(hourAngle);                               // Cosinuswert des Stundenwinkels
  var cosD = Math.cos(declin), sinD = Math.sin(declin);    // Trigonometrische Werte f�r Deklination
  star[0] = cosD*cos*s1[0]+sinD*np[0];                     // Ortsvektor Stern, x-Koordinate
  star[1] = cosD*(cos*s1[1]+Math.sin(hourAngle))+sinD*np[1];  // Ortsvektor Stern, y-Koordinate
  star[2] = cosD*cos*s1[2]+sinD*np[2];                     // Ortsvektor Stern, z-Koordinate
  azimuth = Math.PI-Math.atan2(star[1],star[0]);           // Azimut (Bogenma�)
  altitude = PIH-Math.acos(star[2]);                       // H�he (Bogenma�)
  }
       
//-------------------------------------------------------------------------------------------------

// Neuer Grafikpfad mit Standardwerten:
// w ... Liniendicke (optional, Default-Wert 1)

function newPath (w) {
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.strokeStyle = "#000000";                             // Linienfarbe schwarz
  ctx.lineWidth = (w ? w : 1);                             // Liniendicke
  }
  
// Linie zeichnen:
// x1, y1 ... Anfangspunkt
// x2, y2 ... Endpunkt
// c ........ Farbe (optional, Defaultwert schwarz)
// w ........ Liniendicke (optional, Defaultwert 1)

function line (x1, y1, x2, y2, c, w) {
  newPath(w);                                              // Neuer Grafikpfad
  if (c) ctx.strokeStyle = c;                              // Linienfarbe festlegen
  ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);                    // Linie vorbereiten
  ctx.stroke();                                            // Linie zeichnen
  }
  
// Punkt mit Beschriftung:
// p ........ Ortsvektor des Punkts
// s ........ Beschriftungstext
// inside ... Flag f�r Beschriftung innerhalb (n�her beim Kugelmittelpunkt)

function point (p, s, inside) {
  var ax = R*projX[0], ay = R*projX[1], az = R*projX[2];   // Koeffizienten f�r waagrechte Bildschirmkoordinate
  var bx = R*projY[0], by = R*projY[1], bz = R*projY[2];   // Koeffizienten f�r senkrechte Bildschirmkoordinate
  var u = uM+ax*p[0]+ay*p[1]+az*p[2];                      // Waagrechte Bildschirmkoordinate 
  var v = vM-bx*p[0]-by*p[1]-bz*p[2];                      // Senkrechte Bildschirmkoordinate
  var vx = u-uM, vy = v-vM;                                // Verbindungsvektor Kugelmittelpunkt - Punkt 
  var length = Math.sqrt(vx*vx+vy*vy);                     // Betrag des Verbindungsvektors
  if (length > 0) {vx *= 12/length; vy *= 12/length;}      // Verbindungsvektor auf Betrag 12 bringen
  var c = (p[2]>0 ? colorVisible : "#000000");             // Farbe �ber/unter dem Horizont
  var skpr = dotProduct(proj,p);                           // Skalarprodukt
  if (skpr >= 0) circle(u,v,2.5,c);                        // Entweder ausgef�llter Kreis (Seite des Betrachters) ...
  else circle(u,v,2,false);                                // ... oder nicht ausgef�llter Kreis (abgewandte Seite)
  ctx.fillStyle = c;                                       // Schriftfarbe
  ctx.textAlign = "center";                                // Textausrichtung
  if (inside) ctx.fillText(s,u-vx,v-vy+4);                 // Beschriftung entweder innerhalb ...
  else ctx.fillText(s,u+vx,v+vy+4);                        // ... oder au�erhalb 
  }
  
// Kreis (ausgef�llt oder nicht ausgef�llt):
// (x,y) ... Mittelpunkt (Pixel)
// r ....... Radius (Pixel)
// c ....... F�llfarbe (optional; bei nicht definierter F�llfarbe schwarze Kreislinie)
  
function circle (x, y, r, c) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.arc(x,y,r,0,2*Math.PI,true);                         // Kreis vorbereiten
  if (c) {ctx.fillStyle = c; ctx.fill();}                  // Entweder ausgef�llter Kreis ...
  else ctx.stroke();                                       // ... oder schwarze Kreislinie
  }
  
// Himmelsachse (gestrichelt):

function axis () {
  var dx = R*dotProduct(projX,np);                         // Koordinatendifferenz waagrecht
  var dy = R*dotProduct(projY,np);                         // Koordinatendifferenz senkrecht
  var n = Math.floor(Math.sqrt(dx*dx+dy*dy)/5);            // Zahl der Teilabschnitte, vorl�ufig 
  if (n%2 == 0) n++;                                       // Falls gerade Zahl, um 1 erh�hen
  dx /= n; dy /= n;                                        // Koordinatendifferenzen f�r einen Teilabschnitt
  var nhs = (np[2] >= 0);                                  // Flag f�r n�rdliche Halbkugel
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.strokeStyle = (nhs ? colorVisible : "#000000");      // Farbe f�r Halbachse zum Himmelsnordpol
  for (var i=0; i<=n-1; i+=2) {                            // F�r alle geraden Indizes ...
    ctx.moveTo(uM+i*dx,vM-i*dy);                           // Anfangspunkt Teilabschnitt
    ctx.lineTo(uM+(i+1)*dx,vM-(i+1)*dy);                   // Linie zum Endpunkt Teilabschnitt
    }
  ctx.stroke();                                            // Halbachse zum Himmelsnordpol zeichnen (gestrichelt)
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.strokeStyle =(nhs ? "#000000" : colorVisible);       // Farbe f�r Halbachse zum Himmelss�dpol
  for (i=0; i<=n-1; i+=2) {                                // F�r alle geraden Indizes ...
    ctx.moveTo(uM-i*dx,vM+i*dy);                           // Anfangspunkt Teilabschnitt
    ctx.lineTo(uM-(i+1)*dx,vM+(i+1)*dy);                   // Linie zum Endpunkt Teilabschnitt
    }
  ctx.stroke();                                            // Halbachse zum Himmelss�dpol zeichnen (gestrichelt)
  }
  
// Ellipse f�r Horizontebene:
// Mittelpunkt (uM,vM), gro�e Halbachse R
// b ........ kleine Halbachse (b >= 0 vorausgesetzt)
// border ... Flag f�r Ellipsenrand
// color .... F�llfarbe (optional)
  
function ellipseHorizon (b, border, color) {
  if (b == 0) {line(uM-R,vM,uM+R,vM); return;}             // Gegebenenfalls Linie statt Ellipse
  ctx.save();                                              // Bisherigen Grafikkontext speichern     
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.translate(uM,vM);                                    // Verschiebung
  ctx.scale(R,b);                                          // Skalierung
  ctx.arc(0,0,1,0,2*Math.PI,true);                         // Einheitskreis vorbereiten (wird zu Ellipse)
  ctx.restore();                                           // Fr�heren Grafikkontext wiederherstellen
  if (color) {ctx.fillStyle = color; ctx.fill();}          // Falls gew�nscht, ausgef�llte Ellipse
  if (border) {ctx.strokeStyle = "#000000"; ctx.stroke();} // Falls gew�nscht, Ellipsenrand
  }
  
// Hilfsroutine f�r Klein- oder Gro�kreis: Farb�nderung bei �berschreitung des Horizonts
// (u0,v0) ... Bildschirmkoordinaten Anfangspunkt
// (u1,v1) ... Bildschirmkoordinaten Endpunkt
// up ........ Flag f�r Richtung von unten nach oben
// q ......... Bruchteil (0 bis 1)

function lineHorizon (u0, v0, u1, v1, up, q) {
  var du = u1-u0, dv = v1-v0;                              // Koordinatendifferenzen
  var uH = u0+q*du, vH = v0+q*dv;                          // Bildschirmkoordinaten Horizont-Schnittpunkt
  ctx.lineTo(u0,v0,uH,vH);                                 // Linie bis zum Horizont zum bisherigen Grafikpfad hinzuf�gen
  ctx.stroke();                                            // Bisherigen Teil des Kreises zeichnen
  ctx.beginPath();                                         // Neuer Grafikpfad
  ctx.strokeStyle = (up ? colorVisible : "#000000");       // Farbe f�r Fortsetzung des Kreises
  ctx.moveTo(uH,vH);                                       // Horizont-Schnittpunkt als neuer Anfangspunkt 
  ctx.lineTo(u1,v1);                                       // Weiter zum Endpunkt
  }
  
// Klein- oder Gro�kreis (komplett, Vorderseite durchgezogen, R�ckseite gestrichelt):
// nv ...... Normaleneinheitsvektor
// theta ... Abweichung von Gro�kreisebene (Bogenma�)
// Seiteneffekt a1, b1, h

function circleSphere (nv, theta) {
  normCrossProduct(proj,nv,a1);                            // Normiertes Vektorprodukt (a1)
  crossProduct(nv,a1,b1);                                  // Vektorprodukt (b1)
  var cos0 = Math.cos(theta), sin0 = Math.sin(theta);      // Trigonometrische Werte
  for (var k=0; k<3; k++) h[k] = cos0*a1[k]+sin0*nv[k];    // Ortsvektor Anfangspunkt
  var ax = R*projX[0], ay = R*projX[1], az = R*projX[2];   // Koeffizienten f�r waagrechte Bildschirmkoordinate
  var bx = R*projY[0], by = R*projY[1], bz = R*projY[2];   // Koeffizienten f�r senkrechte Bildschirmkoordinate
  var u1 = uM+ax*h[0]+ay*h[1]+az*h[2];                     // Waagrechte Bildschirmkoordinate Anfangspunkt
  var v1 = vM-bx*h[0]-by*h[1]-bz*h[2];                     // Senkrechte Bildschirmkoordinate Anfangspunkt
  var h1 = h[2];                                           // z-Koordinate Anfangspunkt
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.strokeStyle = (h[2]>=0 ? colorVisible : "#000000");  // Linienfarbe    
  ctx.moveTo(u1,v1);                                       // Anfangspunkt
  var dPhi = 2*Math.PI/NIV;                                // Winkel f�r Teilabschnitt (Bogenma�)
  for (var i=1; i<=NIV; i++) {                             // F�r alle Teilabschnitte ...
    var u0 = u1, v0 = v1, h0 = h1;                         // Bisheriger Endpunkt als Anfangspunkt
    var phi = i*dPhi;                                      // Positionswinkel (Bogenma�)
    var cos = Math.cos(phi), sin = Math.sin(phi);          // Trigonometrische Werte
    for (k=0; k<3; k++)                                    // F�r alle drei Koordinaten ...
      h[k] = cos0*(cos*a1[k]+sin*b1[k])+sin0*nv[k];        // Koordinate des Ortsvektors
    u1 = uM+ax*h[0]+ay*h[1]+az*h[2];                       // Waagrechte Bildschirmkoordinate
    v1 = vM-bx*h[0]-by*h[1]-bz*h[2];                       // Senkrechte Bildschirmkoordinate
    h1 = h[2];                                             // z-Koordinate
    if (h0 < 0 && h1 > 0)                                  // Falls Horizont nach oben �berschritten ...
      lineHorizon(u0,v0,u1,v1,true,Math.abs(h0/(h1-h0)));  // Teil des Kreises zeichnen, Farbwechsel von schwarz nach violett 
    else if (h0 > 0 && h1 < 0)                             // Falls Horizont nach unten �berschritten
      lineHorizon(u0,v0,u1,v1,false,Math.abs(h0/(h1-h0))); // Teil des Kreises zeichnen, Farbwechsel von violett nach schwarz
    var s1 = dotProduct(proj,h);                           // Skalarprodukt
    if (s1 > 0 || i%2 == 0) ctx.lineTo(u1,v1);             // Entweder Teilabschnitt zum Grafikpfad hinzuf�gen ...
    else ctx.moveTo(u1,v1);                                // ... oder neuer Anfangspunkt (f�r gestrichelten Teil) 
    }
  ctx.stroke();                                            // Kreis fertig zeichnen
  }
  
// Gro�kreis (komplett, Vorderseite durchgezogen, R�ckseite gestrichelt)
// nv ... Normaleneinheitsvektor
// Seiteneffekt a1, b1, h

function greatCircle (nv) {
  circleSphere(nv,0);                                      // Gro�kreis als Spezialfall eines Kleinkreises
  }
  
// Gro�kreis durch zwei Punkte:
// p1, p2 ... Ortsvektoren der gegebenen Punkte
// Seiteneffekt a1, b1, h

function greatCircleThrough (p1, p2) {
  normCrossProduct(p1,p2,h);                               // Normaleneinheitsvektor (h)
  greatCircle(h);                                          // Gro�kreis
  }
  
// Gro�kreisbogen (hervorgehoben):
// Vorderseite durchgezogen, R�ckseite gestrichelt
// nv ... Normaleneinheitsvektor
// a1 ... Vektor in Ebene (entsprechend phi == 0)
// phi0, dPhi ... Anfang, Betrag (Bogenma�)
// Seiteneffekt b1

function arc (nv, a1, phi0, dPhi) {
  crossProduct(nv,a1,b1);                                  // Vektorprodukt (b1)
  var ax = R*projX[0], ay = R*projX[1], az = R*projX[2];   // Koeffizienten f�r waagrechte Bildschirmkoordinate
  var bx = R*projY[0], by = R*projY[1], bz = R*projY[2];   // Koeffizienten f�r senkrechte Bildschirmkoordinate
  var n = Math.floor(dPhi*NIV/(2*Math.PI));                // Zahl der Teilabschnitte
  var cos = Math.cos(phi0), sin = Math.sin(phi0);          // Trigonometrische Werte
  var h0 = cos*a1[0]-sin*b1[0];                            // x-Koordinate Anfangspunkt
  var h1 = cos*a1[1]-sin*b1[1];                            // y-Koordinate Anfangspunkt
  var h2 = cos*a1[2]-sin*b1[2];                            // z-Koordinate Anfangspunkt
  newPath(3);                                              // Neuer Grafikpfad (gr��ere Liniendicke)
  ctx.strokeStyle = colorEmphasize;                        // Farbe f�r Hervorhebungen                       
  var u = uM+ax*h0+ay*h1+az*h2;                            // Waagrechte Bildschirmkoordinate
  var v = vM-bx*h0-by*h1-bz*h2;                            // Senkrechte Bildschirmkoordinate
  ctx.moveTo(u,v);                                         // Anfangspunkt
  for (var i=1; i<=n; i++) {                               // F�r alle Teilabschnitte ...
    var phi = phi0+i*dPhi/n;                               // Positionswinkel (Bogenma�)
    cos = Math.cos(phi); sin = Math.sin(phi);              // Trigonometrische Werte
    h0 = cos*a1[0]-sin*b1[0];                              // x-Koordinate
    h1 = cos*a1[1]-sin*b1[1];                              // y-Koordinate
    h2 = cos*a1[2]-sin*b1[2];                              // z-Koordinate
    u = uM+ax*h0+ay*h1+az*h2;                              // Waagrechte Bildschirmkoordinate
    v = vM-bx*h0-by*h1-bz*h2;                              // Senkrechte Bildschirmkoordinate
    ctx.lineTo(u,v);                                       // Teilabschnitt zum Grafikpfad hinzuf�gen
    }
  ctx.stroke();                                            // Kreisbogen zeichnen
  }
  
// Nautisches Dreieck:
// Seiteneffekt b1, h

function nauticalTriangle () {
  if (gLat >= 0) {                                         // Falls Beobachter auf Nordhalbkugel ...
    arc(W,np,0,PIH-gLat);                                  // Kreisbogen zwischen Zenit und Himmelsnordpol
    normCrossProduct(star,np,h);                           // Normaleneinheitsvektor f�r n�chsten Kreisbogen (h)
    arc(h,np,0,PIH-declin);                                // Kreisbogen zwischen Himmelsnordpol und Gestirn
    normCrossProduct(star,ZE,h);                           // Normaleneinheitsvektor f�r n�chsten Kreisbogen (h)
    arc(h,ZE,0,PIH-altitude);                              // Kreisbogen zwischen Gestirn und Zenit
    }
  else {                                                   // Falls Beobachter auf S�dhalbkugel ...
    arc(O,sp,0,PIH+gLat);                                  // Kreisbogen zwischen Zenit und Himmelss�dpol
    normCrossProduct(star,sp,h);                           // Normaleneinheitsvektor f�r n�chsten Kreisbogen (h)
    arc(h,sp,0,PIH+declin);                                // Kreisbogen zwischen Himmelss�dpol und Gestirn
    normCrossProduct(star,ZE,h);                           // Normaleneinheitsvektor f�r n�chsten Kreisbogen (h)
    arc(h,ZE,0,PIH-altitude);                              // Kreisbogen zwischen Gestirn und Zenit
    }
  }
  
// Unver�nderlicher Teil der Grafik: Himmelskugel mit Horizontebene
  
function paintFix () {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.fillStyle = colorHeaven;                             // Farbe f�r Himmel
  ctx.arc(uM,vM,R,0,Math.PI,true);                         // Oberen Halbkreis vorbereiten
  ctx.fill(); ctx.stroke();                                // Ausgef�llter Halbkreis mit Halbkreisbogen                                            // Halbkreisbogen
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.fillStyle = colorEarth;                              // Farbe f�r Erde
  ctx.arc(uM,vM,R,Math.PI,2*Math.PI,true);                 // Unteren Halbkreis vorbereiten
  ctx.fill(); ctx.stroke();                                // Ausgef�llter Halbkreis mit Halbkreisbogen
  var b = R*Math.sin(phiP);                                // Kleine Halbachse
  ellipseHorizon(b,false,colorHorizon);                    // Ellipse f�r Horizontebene
  }
  
// Angabe eines Winkels (in Grad):

function valueAngle (s, w, x, y) {
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  ctx.textAlign = "left";                                  // Textausrichtung
  ctx.fillText(s,x,y);                                     // Erkl�render Text
  s = ToString(w/DEG,1,true)+"\u00B0";                     // Zeichenkette f�r Zahlenwert und Einheit
  ctx.textAlign = "right";                                 // Textausrichtung
  ctx.fillText(s,x+135,y);                                 // Zahlenwert und Einheit
  }

// Angaben:

function values () {
  ctx.textAlign = "left";                                  // Textausrichtung
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  ctx.fillText(text14,20,height-60);                       // Erkl�render Text (Uhrzeit)
  var mi = minute+Math.floor(t*12);                        // Minuten, vorl�ufiger Wert
  var ho = (hour+Math.floor(mi/60))%24;                    // Stunden
  mi %= 60;                                                // Minuten, endg�ltiger Wert
  var s = ""+ho+timeSeparator;                             // Anfang der Zeichenkette f�r die Uhrzeit 
  if (mi < 10) s += "0";                                   // Gegebenenfalls Minuten mit f�hrender Null
  s += mi+" "+symbolHour;                                  // Zeichenkette f�r die Uhrzeit vervollst�ndigen
  ctx.textAlign = "right";                                 // Textausrichtung
  ctx.fillText(s,155,height-60);                           // Ausgabe Uhrzeit
  valueAngle(text15,sidTime,20,height-40);                 // Ausgabe Sternzeit (Gradma�)
  valueAngle(text17,hourAngle,uM,height-40);               // Ausgabe Stundenwinkel (Gradma�)
  valueAngle(text16,azimuth,20,height-20);                 // Ausgabe Azimut (Gradma�)
  valueAngle(text18,altitude,uM,height-20);                // Ausgabe H�he (Gradma�)
  }
  
// Grafikausgabe:
// Auf Wunsch wird ein Detail durch Blinken hervorgehoben (0,5 s sichtbar, 0,5 s unsichtbar).
// Seiteneffekt t, tBl, t0, sidTime, f, hourAngle, st, azimuth, altitude, a1, b1, h
  
function paint () {
  var t1 = new Date();                                     // Aktuelle Zeit
  var dt = (t1-t0)/1000;                                   // Zeitintervall (s)
  if (on) t += dt;                                         // Falls Bewegung angeschaltet, Zeitvariable aktualisieren ...
  tBl += dt;                                               // Zeitvariable f�r Blinken aktualisieren
  t0 = t1;                                                 // Neuer Bezugszeitpunkt
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausf�llen
  paintFix();                                              // Himmelskugel, Horizontebene
  var blinkOn = (tBl-Math.floor(tBl) < 0.5);               // Flag f�r Sichtbarkeit beim Blinken
  var nr = ch3.selectedIndex;                              // Nummer f�r Hervorhebung durch Blinken
  calculationT();                                          // Zeitabh�ngige Berechnungen (Seiteneffekt!)
  ctx.font = FONT;                                         // Zeichensatz
  if (nr != 1 || blinkOn) {                                // Falls Beobachtungsort zu zeichnen ...
    circle(uM,vM,2,"#000000");                             // Markierung 
    ctx.fillText(symbolObserver,uM+12,vM+4);               // Beschriftung
    }
  if (nr != 2 || blinkOn) {                                // Falls Horizontebene zu zeichnen ...
    var b = R*Math.sin(phiP);                              // Kleine Halbachse (eventuell 0)
    ellipseHorizon(b,true);                                // Ellipsenrand oder Linie f�r Horizontebene
    }
  if (nr != 3 || blinkOn) point(N,symbolNorth,0);          // Nordpunkt
  if (nr != 4 || blinkOn) point(W,symbolWest,0);           // Westpunkt
  if (nr != 5 || blinkOn) point(S,symbolSouth,0);          // S�dpunkt
  if (nr != 6 || blinkOn) point(O,symbolEast,0);           // Ostpunkt
  if (nr != 7 || blinkOn) point(ZE,symbolZenith,0);        // Zenit
  if (nr != 8 || blinkOn) point(NA,symbolNadir,0);         // Nadir
  if (nr != 9 || blinkOn) greatCircle(W);                  // Ortsmeridian
  if (nr != 10 || blinkOn) greatCircleThrough(star,ZE);    // H�henkreis
  if (nr != 11 || blinkOn) point(np,symbolNorthPole,1);    // Himmelsnordpol
  if (nr != 12 || blinkOn) point(sp,symbolSouthPole,1);    // Himmelss�dpol
  if (nr != 13 || blinkOn) axis();                         // Himmelsachse
  if (nr != 14 || blinkOn) greatCircle(np);                // Himmels�quator
  if (nr != 15 || blinkOn) point(f,symbolVernalEquinox,0); // Fr�hlingspunkt
  if (nr != 16 || blinkOn) greatCircleThrough(star,np);    // Deklinationskreis
  if (nr == 17 && blinkOn) arc(np,s1,0,sidTime);           // Sternzeit
  if (nr == 18 && blinkOn) arc(np,s1,0,hourAngle);         // Stundenwinkel
  if (nr != 19 || blinkOn) point(star,symbolStar,0);       // Stern
  if (nr != 20 || blinkOn) circleSphere(np,declin);        // Scheinbare Sternbahn
  if (nr == 21 && blinkOn) arc(sp,f,0,rightAsc);           // Rektaszension
  if (nr == 22 && blinkOn) {                               // Deklination
    normCrossProduct(star,np,h);                           // Normiertes Vektorprodukt als Normalenvektor
    if (declin >= 0) arc(h,np,PIH-declin,declin);          // Kreisbogen zum Himmels�quator (n�rdlich)
    else arc(h,np,PIH,-declin);                            // Kreisbogen zum Himmels�quator (s�dlich)
    }
  if (nr == 23 && blinkOn) arc(ZE,S,0,azimuth);            // Azimut
  if (nr == 24 && blinkOn) {                               // H�he
    normCrossProduct(star,ZE,h);                           // Normiertes Vektorprodukt als Normalenvektor
    if (altitude >= 0) arc(h,ZE,PIH-altitude,altitude);    // Kreisbogen zum Horizont (oberhalb)
    else arc(h,ZE,PIH,-altitude);                          // Kreisbogen zum Horizont (unterhalb)
    }
  if (nr == 25 && blinkOn) nauticalTriangle();             // Nautisches Dreieck
  values();                                                // Zeit- und Winkelangaben
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Start-Methode aufrufen