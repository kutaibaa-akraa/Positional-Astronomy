// Himmelspole
// Java-Applet (12.07.1998) umgewandelt
// 11.11.2015 - 11.11.2015

// ****************************************************************************
// * Autor: Walter Fendt (www.walter-fendt.de)                                *
// * Dieses Programm darf - auch in ver�nderter Form - f�r nicht-kommerzielle *
// * Zwecke verwendet und weitergegeben werden, solange dieser Hinweis nicht  *
// * entfernt wird.                                                           *
// **************************************************************************** 

// Sprachabh�ngige Texte sind in einer eigenen Datei (zum Beispiel celestialpoles_de.js) abgespeichert.

// Farben:

var colorBackground = "#f9f5ec";                           // Hintergrundfarbe
var colorNorth = "#ff0000";                                // Farbe f�r Nordrichtung
var colorSouth = "#008000";                                // Farbe f�r S�drichtung
var colorZenith = "#ff00ff";                               // Farbe f�r Zenitrichtung
var colorCelestialPole = "#0000ff";                        // Farbe f�r Himmelspole
var colorAngle = "#00ffff";                                // Farbe f�r Winkelmarkierungen

// Sonstige Konstanten:

var FONT = "normal normal bold 12px sans-serif";           // Zeichensatz
var DEG = Math.PI/180;                                     // 1 Grad (Bogenma�)
var R0 = 60;                                               // Erdradius (links, Pixel)   
var xB1 = 180, yB1 = 180;                                  // Beobachtungsort (rechts, Pixel)
var R1 = 120;                                              // Radius der Himmelskugel (Pixel)

// Attribute:

var canvas, ctx;                                           // Zeichenfl�che, Grafikkontext
var width, height;                                         // Abmessungen der Zeichenfl�che (Pixel)
var drag;                                                  // Flag f�r Zugmodus

var xM0, yM0;                                              // Erdmittelpunkt (links)
var phi;                                                   // Geogr. Breite (Bogenma�)
var xB0, yB0;                                              // Beobachtungsort (links)
var xP0, yP0;                                              // Himmelspol (links)
var xP1, yP1;                                              // Himmelspol (rechts)
var xN0, yN0;                                              // Norden (links)
var xS0,yS0;                                               // S�den (links)
var xZ0, yZ0;                                              // Zenit (links)

// Start:

function start () {
  canvas = document.getElementById("cvn");                  // Zeichenfl�che
  width = canvas.width; height = canvas.height;            // Abmessungen (Pixel)
  ctx = canvas.getContext("2d");                           // Grafikkontext
 // xM0 = 150; yM0 = height/2;  
 xM0 = 140; yM0 = height/1.5                             // Erdmittelpunkt (links)   
  phi = 48*DEG;                                            // Geographische Breite (Bogenma�)
  calculation();                                           // Berechnungen
  drag = false;                                            // Zugmodus zun�chst deaktiviert
  paint();                                                 // Zeichnen
  
  canvas.onmousedown = reactionMouseDown;                  // Reaktion auf Dr�cken der Maustaste
  canvas.ontouchstart = reactionTouchStart;                // Reaktion auf Ber�hrung  
  canvas.onmouseup = reactionMouseUp;                      // Reaktion auf Loslassen der Maustaste
  canvas.ontouchend = reactionTouchEnd;                    // Reaktion auf Ende der Ber�hrung
  canvas.onmousemove = reactionMouseMove;                  // Reaktion auf Bewegen der Maus      
  canvas.ontouchmove = reactionTouchMove;                  // Reaktion auf Bewegen des Fingers     
    
  } // Ende Start
  
// Reaktion auf Dr�cken der Maustaste:
  
function reactionMouseDown (e) {        
  reactionDown(e.clientX,e.clientY);                       // Hilfsroutine aufrufen (Auswahl)                    
  }
  
// Reaktion auf Ber�hrung:
  
function reactionTouchStart (e) {      
  var obj = e.changedTouches[0];                           // Liste der Ber�hrpunkte
  reactionDown(obj.clientX,obj.clientY);                   // Hilfsroutine aufrufen (Auswahl)
  if (drag) e.preventDefault();                            // Falls Zugmodus aktiviert, Standardverhalten verhindern
  }
  
// Reaktion auf Loslassen der Maustaste:
  
function reactionMouseUp (e) {                                             
  drag = false;                                            // Zugmodus deaktivieren                             
  }
  
// Reaktion auf Ende der Ber�hrung:
  
function reactionTouchEnd (e) {             
  drag = false;                                            // Zugmodus deaktivieren
  }
  
// Reaktion auf Bewegen der Maus:
  
function reactionMouseMove (e) {            
  if (!drag) return;                                       // Abbrechen, falls Zugmodus nicht aktiviert
  reactionMove(e.clientX,e.clientY);                       // Position ermitteln, rechnen und neu zeichnen
  }
  
// Reaktion auf Bewegung des Fingers:
  
function reactionTouchMove (e) {            
  if (!drag) return;                                       // Abbrechen, falls Zugmodus nicht aktiviert
  var obj = e.changedTouches[0];                           // Liste der neuen Fingerpositionen     
  reactionMove(obj.clientX,obj.clientY);                   // Position ermitteln, rechnen und neu zeichnen
  e.preventDefault();                                      // Standardverhalten verhindern                          
  }  
  
// Hilfsroutine: Reaktion auf Mausklick oder Ber�hren mit dem Finger (Auswahl):
// u, v ... Bildschirmkoordinaten bez�glich Viewport
// Seiteneffekt drag 

function reactionDown (u, v) {
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfl�che bez�glich Viewport
  u -= re.left; v -= re.top;                               // Koordinaten bez�glich Zeichenfl�che (Pixel)
  if (u >= xM0 && u <= xM0+2*R0) drag = true;              // Falls sinnvolle Position, Zugmodus aktivieren
  }
  
// Reaktion auf Bewegung von Maus oder Finger (�nderung):
// u, v ... Bildschirmkoordinaten bez�glich Viewport
// Seiteneffekt phi, xB0, yB0, xN0, yN0, xS0, yS0, xZ0, yZ0, xP1, yP1

function reactionMove (u, v) {
  if (!drag) return;                                       // Falls kein Zugmodus, abbrechen
  var re = canvas.getBoundingClientRect();                 // Lage der Zeichenfl�che bez�glich Viewport
  u -= re.left; v -= re.top;                               // Koordinaten bez�glich Zeichenfl�che (Pixel)
  phi = Math.atan2(yM0-v,u-xM0);                           // Mittelpunktswinkel (Bogenma�)
  if (phi > Math.PI/2) phi = Math.PI/2;                    // Maximaler zul�ssiger Wert
  if (phi < -Math.PI/2) phi = -Math.PI/2;                  // Minimaler zul�ssiger Wert
  calculation();                                           // Berechnungen
  paint();                                                 // Neu zeichnen  
  }
  
//-------------------------------------------------------------------------------------------------
  
// Berechnungen:
// Seiteneffekt xB0, yB0, xN0, yN0, xS0, yS0, xZ0, yZ0, xP1, yP1

function calculation () {  
  var cos = Math.cos(phi), sin = Math.sin(phi);
  xB0 = xM0+R0*cos; yB0 = yM0-R0*sin;                      // Beobachtungsort (linke Skizze)               
  xN0 = xB0-R1*sin; yN0 = yB0-R1*cos;                      // Norden (linke Skizze)
  xS0 = xB0+R1*sin; yS0 = yB0+R1*cos;                      // S�den (linke Skizze)
  xZ0 = xB0+R1*cos; yZ0 = yB0-R1*sin;                      // Zenit (linke Skizze)
  if (phi < 0) {cos = -cos; sin = -sin;}                   // Vorzeichenumkehr f�r S�dhalbkugel
  xP1 = xB1-R1*cos; yP1 = yB1-R1*sin;                      // Himmelspol (rechte Skizze)  
  }
  
//-------------------------------------------------------------------------------------------------

// Neuer Grafikpfad mit Standardwerten:

function newPath(w) {
  ctx.beginPath();                                         // Neuer Pfad
  ctx.strokeStyle = "#000000";                             // Linienfarbe schwarz
  ctx.lineWidth = 1;                                       // Liniendicke
  }
     
// Linie zeichnen:
// x1, y1 ... Anfangspunkt
// x2, y2 ... Endpunkt
  
function line (x1, y1, x2, y2) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.moveTo(x1,y1);                                       // Anfangspunkt
  ctx.lineTo(x2,y2);                                       // Weiter zum Endpunkt
  ctx.stroke();                                            // Linie zeichnen
  }
    
// Pfeil zeichnen:
// x1, y1 ... Anfangspunkt
// x2, y2 ... Endpunkt
// w ........ Liniendicke (optional)
// Zu beachten: Die Farbe wird durch ctx.strokeStyle bestimmt.

function arrow (x1, y1, x2, y2, w) {
  if (!w) w = 1;                                           // Falls Liniendicke nicht definiert, Defaultwert                          
  var dx = x2-x1, dy = y2-y1;                              // Vektorkoordinaten
  var length = Math.sqrt(dx*dx+dy*dy);                     // L�nge
  if (length == 0) return;                                 // Abbruch, falls L�nge 0
  dx /= length; dy /= length;                              // Einheitsvektor
  var s = 2.5*w+7.5;                                       // L�nge der Pfeilspitze 
  var xSp = x2-s*dx, ySp = y2-s*dy;                        // Hilfspunkt f�r Pfeilspitze         
  var h = 0.5*w+3.5;                                       // Halbe Breite der Pfeilspitze
  var xSp1 = xSp-h*dy, ySp1 = ySp+h*dx;                    // Ecke der Pfeilspitze
  var xSp2 = xSp+h*dy, ySp2 = ySp-h*dx;                    // Ecke der Pfeilspitze
  xSp = x2-0.6*s*dx; ySp = y2-0.6*s*dy;                    // Einspringende Ecke der Pfeilspitze
  ctx.beginPath();                                         // Neuer Pfad
  ctx.lineWidth = w;                                       // Liniendicke
  ctx.moveTo(x1,y1);                                       // Anfangspunkt
  if (length < 5) ctx.lineTo(x2,y2);                       // Falls kurzer Pfeil, weiter zum Endpunkt, ...
  else ctx.lineTo(xSp,ySp);                                // ... sonst weiter zur einspringenden Ecke
  ctx.stroke();                                            // Linie zeichnen
  if (length < 5) return;                                  // Falls kurzer Pfeil, keine Spitze
  ctx.beginPath();                                         // Neuer Pfad f�r Pfeilspitze
  ctx.fillStyle = ctx.strokeStyle;                         // F�llfarbe wie Linienfarbe
  ctx.moveTo(xSp,ySp);                                     // Anfangspunkt (einspringende Ecke)
  ctx.lineTo(xSp1,ySp1);                                   // Weiter zum Punkt auf einer Seite
  ctx.lineTo(x2,y2);                                       // Weiter zur Spitze
  ctx.lineTo(xSp2,ySp2);                                   // Weiter zum Punkt auf der anderen Seite
  ctx.closePath();                                         // Zur�ck zum Anfangspunkt
  ctx.fill();                                              // Pfeilspitze zeichnen 
  }
  
// Kreis oder Kreisbogen zeichnen:
// x, y ... Koordinaten des Mittelpunkts
// r ...... Radius
// a ...... Winkel im Bogenma� (optional, Defaultwert 2*Math.PI)
  
function circle (x, y, r, a) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.arc(x,y,r,0,(a?a:2*Math.PI),true);                   // Kreis oder Kreisbogen vorbereiten
  ctx.stroke();                                            // Kreis oder Kreisbogen zeichnen
  }
  
// Winkelmarkierung im Gegenuhrzeigersinn:
// x, y ... Scheitel
// a0 ..... Startwinkel (Bogenma�)
// a ...... Winkelbetrag (Bogenma�) 

function angle (x, y, a0, a) {
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.fillStyle = colorAngle;                              // F�llfarbe
  ctx.moveTo(x,y);                                         // Scheitel als Anfangspunkt
  var r = 20;                                              // Radius (Pixel)
  ctx.lineTo(x+r*Math.cos(a0),y-r*Math.sin(a0));           // Linie auf dem ersten Schenkel vorbereiten
  ctx.arc(x,y,r,2*Math.PI-a0,2*Math.PI-a0-a,true);         // Kreisbogen vorbereiten
  ctx.closePath();                                         // Zur�ck zum Scheitel
  ctx.fill(); ctx.stroke();                                // Kreissektor ausf�llen, Rand zeichnen
  }
  
// Linke Skizze, bezogen auf Erdkugel:

function drawLeft () {
  var w0 = (phi>0 ? 0 : phi);                              // Startwinkel f�r geographische Breite (Bogenma�)                    
  var dw = Math.abs(phi);                                  // Betrag der geographischen Breite (Bogenma�)
  angle(xM0,yM0,w0,dw);                                    // Markierung f�r geographische Breite
  w0 = (phi>0 ? 90*DEG : 270*DEG+phi);                     // Neuer Startwinkel (Bogenma�)
  angle(xB0,yB0,w0,dw);                                    // Markierung f�r H�henwinkel des sichtbaren Himmelspols
  circle(xM0,yM0,R0);                                      // Erdkugel
  line(xM0,yM0-R0-20,xM0,yM0+R0+20);                       // Erdachse
  line(xM0-R0,yM0,xM0+R0,yM0);                             // �quator  	
  line(xM0,yM0,xB0,yB0);                                   // Verbindungslinie Erdmittelpunkt-Beobachtungsort
  newPath();                                               // Neuer Grafikpfad (Standardwerte)
  ctx.strokeStyle = colorNorth;                            // Farbe f�r Nordrichtung
  arrow(xB0,yB0,xN0,yN0,1.5);                              // Pfeil f�r Nordrichtung
  ctx.strokeStyle = colorSouth;                            // Farbe f�r S�drichtung
  arrow(xB0,yB0,xS0,yS0,1.5);                              // Pfeil f�r S�drichtung
  ctx.strokeStyle = colorZenith;                           // Farbe f�r Zenitrichtung
  arrow(xB0,yB0,xZ0,yZ0,1.5);                              // Pfeil f�r Zenitrichtung
  ctx.strokeStyle = colorCelestialPole;                    // Farbe f�r Himmelspol
  if (phi >= 0)                                            // Falls Beobachter auf Nordhalbkugel oder �quator  ...                          
    arrow(xB0,yB0,xB0,yB0-R1,1.5);                         // Pfeil zum Himmelsnordpol
  if (phi <= 0)                                            // Falls Beobachter auf S�dhalbkugel oder �quator  ...                          
    arrow(xB0,yB0,xB0,yB0+R1,1.5);                         // Pfeil zum Himmelss�dpol
  }
  
// Rechte Skizze, bezogen auf Horizontebene:

function drawRight () {
  var w0 = (phi>0 ? Math.PI-phi : 0);                      // Startwinkel f�r H�henwinkel (Bogenma�)                    
  var dw = Math.abs(phi);                                  // Betrag der geographischen Breite (Bogenma�)
  angle(xB1,yB1,w0,dw);                                    // Markierung f�r H�henwinkel des sichtbaren Himmelspols
  circle(xB1,yB1,R1,Math.PI);                              // Halbkreis f�r Himmelskugel
  ctx.strokeStyle = colorNorth;                            // Farbe f�r Nordrichtung
  arrow(xB1,yB1,xB1-R1,yB1,1.5);                           // Pfeil f�r Nordrichtung
  ctx.strokeStyle = colorSouth;                            // Farbe f�r S�drichtung
  arrow(xB1,yB1,xB1+R1,yB1,1.5);                           // Pfeil f�r S�drichtung
  ctx.strokeStyle = colorZenith;                           // Farbe f�r Zenitrichtung
  arrow(xB1,yB1,xB1,yB1-R1,1.5);                           // Pfeil f�r Zenitrichtung
  ctx.strokeStyle = colorCelestialPole;                    // Farbe f�r Himmelspol
  arrow(xB1,yB1,xP1,yP1,1.5);                              // Pfeil zum sichtbaren Himmelspol
  if (phi == 0)                                            // Falls Beobachter auf dem �quator ... 
    arrow(xB1,yB1,2*xB1-xP1,yP1,1.5);                      // Zus�tzlich entgegengesetzter Pfeil
  }
  
// Ausgabe von Text:
// s ....... Zeichenkette
// (x,y) ... Position (Pixel)
// a ....... Textausrichtung (0 f�r linksb�ndig, 1 f�r zentriert, 2 f�r rechtsb�ndig)

function write (s, x, y, a) {
  if (a == 0) ctx.textAlign = "left";                      // Entweder linksb�ndig ...
  else if (a == 1) ctx.textAlign = "center";               // ... oder zentriert ...
  else ctx.textAlign = "right";                            // ... oder rechtsb�ndig
  ctx.fillText(s,x,y+4);                                   // Text ausgeben
  }
  
// Hilfsroutine: Sicherstellen, dass die x-Koordinate in einem gegebenen Bereich liegt
// x ..... Urspr�ngliche x-Koordinate
// min ... Kleinster erlaubter Wert
// max ... Gr��ter erlaubter Wert
// R�ckgabewert: Eventuell korrigierte x-Koordinate 

function correctedX (x, min, max) {
  if (x < min) return min;                                 // Zu kleinen Wert verhindern
  if (x > max) return max;                                 // Zu gro�en Wert verhindern
  return x;                                                // Unkorrigierter Wert
  }
  
// Beschriftung f�r beide Skizzen:

function writeText () {
  ctx.fillStyle = "#000000";                               /* Schriftfarbe #000000 black text color*/
  write(text01,xM0-R0-3,yM0,2);                            // �quator (linke Skizze)
  write(text02,xM0-3,yM0-R0+10,2);                         // Nordpol (linke Skizze)
  write(text03,xM0-3,yM0+R0-10,2);                         // S�dpol (linke Skizze)
  write(text04,xM0,yM0+R0+30,1);                           // Erdachse (linke Skizze)
  write(text05,xB1,yB1+15,1);                              // Horizontebene (rechte Skizze)
  var n = (phi >= 0);                                      // Flag f�r Nordhalbkugel (einschlie�lich �quator)
  var s = (phi <= 0);                                      // Flag f�r S�dhalbkugel (einschlie�lich �quator)
  var x = (n ? (xB0+xS0)/2 : (xB0+xN0)/2)+20;              // x-Koordinate
  var y = (n ? (yB0+yS0)/2-15 : (yB0+yN0)/2+15);           // y-Koordinate
  write(text05,x,y,1);                                     // Horizontebene (linke Skizze) 
  x = (n ? xB1+0.85*R1 : xB1-0.85*R1);                     // Neue x-Koordinate
  y = yB1-0.85*R1;                                         // Neue y-Koordinate
  write(text06,x,y,1);                                     // Himmelskugel (rechte Skizze)
  ctx.fillStyle = colorZenith;                             // Neue Schriftfarbe
  x = Math.max(xZ0,xM0)+20;                                // Neue x-Koordinate
  if (n) y = Math.max(yZ0,yM0-R0-R1+15);                   // Neue y-Koordinate f�r Nordhalbkugel
  else y = Math.min(yZ0,yM0+R0+R1-15);                     // Neue y-Koordinate f�r S�dhalbkugel
  write(text07,x,y,1);                                     // Zenit (linke Skizze)
  write(text07,xB1,yB1-R1-15,1);                           // Zenit (rechte Skizze)
  ctx.fillStyle = colorCelestialPole;                      // Neue Schriftfarbe 
  var cos = Math.cos(phi), sin = Math.sin(phi);            // Trigonometrische Werte 
  if (n) {                                                 // Falls Beobachter auf Nordhalbkugel oder �quator ...
    write(text08,xB0,yB0-R1-10,1);                         // Himmelsnordpol (linke Skizze)
    x = correctedX(xB1-R1*cos,xB1-80,xB1-30);              // Neue x-Koordinate
    y = yB1-R1*sin-15;                                     // Neue y-Koordinate
    write(text08,x,y,2);                                   // Himmelsnordpol (rechte Skizze)
    }
  if (s) {                                                 // Falls Beobachter auf S�dhalbkugel oder �quator ...
    write(text09,xB0,yB0+R1+10,1);                         // Himmelss�dpol (linke Skizze)
    var wt = ctx.measureText(text09).width;                // L�nge der Zeichenkette (Pixel)
    x = correctedX(xB1+R1*cos,xB1+30,xB1+130-wt);          // Neue x-Koordinate 
    y = yB1+R1*sin-15;                                     // Neue y-Koordinate
    write(text09,x,y,0);                                   // Himmelss�dpol (rechte Skizze)
    }
  if (phi == Math.PI/2 || phi == -Math.PI/2) return;       // Falls Beobachter am Nord- oder S�dpol, abbrechen 
  ctx.fillStyle = colorNorth;                              // Neue Schriftfarbe
  write(text10,xB1-R1+20,yB1+15,1);                        // Nordrichtung (rechte Skizze)
  if (n) {                                                 // Falls Beobachter auf Nordhalbkugel oder �quator ...
    x = Math.max(xN0-25,30);                               // Neue x-Koordinate
    y = Math.max(yN0+15,yM0-R0-R1+15);                     // Neue y-Koordinate
    }
  else {x = xN0; y = yN0-15;}                              // Neue Koordinaten f�r S�dhalbkugel 
  write(text10,x,y,1);                                     // Nordrichtung (linke Skizze)
  ctx.fillStyle = colorSouth;                              // Neue Schriftfarbe
  write(text11,xB1+R1-20,yB1+15,1);                        // S�drichtung (rechte Skizze)
  if (s) {                                                 // Falls Beobachter auf S�dhalbkugel oder �quator ...
    x = Math.max(xS0-25,30);                               // Neue x-Koordinate
    y = Math.max(yS0-15,yM0-R0-R1+15);                     // Neue y-Koordinate
    }
  else {x = xS0; y = yS0+15;}                              // Neue Koordinaten f�r Nordhalbkugel
  write(text11,x,y,1);                                     // S�drichtung (linke Skizze)
  }
      
// Grafikausgabe:
  
function paint () {
  ctx.fillStyle = colorBackground;                         // Hintergrundfarbe
  ctx.fillRect(0,0,width,height);                          // Hintergrund ausf�llen
  ctx.font = FONT;                                         // Zeichensatz 
  drawLeft();                                              // Linke Skizze, bezogen auf Erdkugel 
  drawRight();                                             // Rechte Skizze, bezogen auf Horizontebene
  writeText();                                             // Beschriftung f�r beide Skizzen
  ctx.fillStyle = "#000000";                               // Schriftfarbe
  write(author,width-40,height-20,2);                      // Autor
  }
  
document.addEventListener("DOMContentLoaded",start,false); // Nach dem Laden der Seite Startmethode aufrufen