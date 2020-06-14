// RESOURCES: Agoston-M.K.-Computer-Graphics-and-Geometric-Modelling-Implementation-Algorithms-Springer-2005-920s
// Andrija Cvetković 72RN
var REGION_CODES;
(function (REGION_CODES) {
    REGION_CODES[REGION_CODES["INSIDE"] = 0] = "INSIDE";
    REGION_CODES[REGION_CODES["LEFT"] = 1] = "LEFT";
    REGION_CODES[REGION_CODES["RIGHT"] = 2] = "RIGHT";
    REGION_CODES[REGION_CODES["BOTTOM"] = 4] = "BOTTOM";
    REGION_CODES[REGION_CODES["TOP"] = 8] = "TOP";
})(REGION_CODES || (REGION_CODES = {}));
var Point = /** @class */ (function () {
    function Point(_x, _y) {
        this.x = 0;
        this.y = 0;
        this.x = _x;
        this.y = _y;
    }
    return Point;
}());
var MAXSIZE = 1000;
var NOSEGM = 0;
var SEGM = 1;
var CLIP = 2;
var TWOBITS = 16; // Ovo je zapravo 0001 0000
var Tcc = [0, -3, -6, 1, 3, 0, 1, 0, 6, 1, 0, 0, 1, 0, 0, 0];
var Cra = [-1, -1, -1, 3, -1, -1, 2, -1, -1, 1, -1, -1, 0, -1, -1, -1];
var points = new Array(MAXSIZE);
// treba da sadrži granice prozora odsecanja, u obliku: (xmin, ymin), (xmax, ymin), (xmin, ymax), (xmax, ymax)
var clipRegion = [];
var startPt; // početna tačka
var startC; // početni kod
var startC0; // čuva startC za sledeći poziv fje CS_EndClip
var endPt; // krajnja tačka
var endC; // krajnji kod
var aC;
var SegMetWindow = function (cflag) {
    return (cflag & SEGM) !== 0;
};
// treba da vrati truesamo ako je prva tačka odsečena, u suprotnom, generišu se redudantne tačke
var Clipped = function (cflag) {
    return (cflag & CLIP) !== 0;
};
var TwoBitCase = function (cflag) {
    return (cflag & TWOBITS) !== 0;
};
var TwoBitEndPoint = function (outpts, numout) {
    // linija je odbijena i imamo 2-bitnu krajnju tačku
    if ((startC & endC & (TWOBITS - 1)) === 0) {
        // tačke nemaju iste bitove
        // neophodna je dodatna tačka okreta
        if (TwoBitCase(startC)) {
            BothAreTwoBits();
        }
        else {
            // 1-bit početak, 2-bit kraj
            aC = endC + Tcc[startC];
        }
        outpts[numout] = clipRegion[Cra[aC & ~TWOBITS]];
        ++numout;
    }
};
var BothAreTwoBits = function () {
    var notdone = true;
    var Pt1 = startPt;
    var Pt2 = endPt;
    var aPt = new Point(0, 0);
    while (notdone) {
        aPt.x = (Pt1.x + Pt2.x) / 2;
        aPt.y = (Pt1.y + Pt2.y) / 2;
        aC = ExtendedCsCode(aPt);
        if (TwoBitCase(aC)) {
            if (aC === endC) {
                Pt2 = aPt;
            }
            else if (aC === startC) {
                Pt1 = aPt;
            }
            else {
                notdone = false;
            }
        }
        else {
            if ((aC & endC) !== 0) {
                aC = endC + Tcc[startC & ~TWOBITS];
            }
            else {
                aC = startC + Tcc[endC & ~TWOBITS];
            }
            notdone = false;
        }
    }
};
var OneBitEndPoint = function () {
    // linija odbijena, 1-bitna krajnja tačka
    if (TwoBitCase(startC)) {
        if ((startC & endC) === 0) {
            endC = startC + Tcc[endC];
        }
        else {
            endC |= startC;
            if (Tcc[endC] === 1) {
                endC |= TWOBITS;
            }
        }
    }
};
var ExtendedCsCode = function (p) {
    if (p.x < clipRegion[0].x) {
        if (p.y > clipRegion[3].y) {
            return 6 | TWOBITS;
        }
        else if (p.y < clipRegion[0].y) {
            return 12 | TWOBITS;
        }
        return 4;
    }
    else if (p.x > clipRegion[3].x) {
        if (p.y > clipRegion[3].y) {
            return 3 | TWOBITS;
        }
        else if (p.y < clipRegion[0].y) {
            return 9 | TWOBITS;
        }
        return 1;
    }
    else {
        if (p.y > clipRegion[3].y) {
            return 2;
        }
        else if (p.y < clipRegion[0].y) {
            return 8;
        }
    }
    return 0;
};
// inpts je niz tačaka poligona, outpts je niz tačaka odsečenog poligona
var M_Clip = function (inpts, numin, outpts, numout) {
    numout = 0;
    // ukoliko je prva tačka vidljiva, sačuvaj
    if (CS_StartClip(inpts[0]) > 0) {
        outpts[numout] = startPt;
        ++numout;
    }
    for (var i = 0; i < numin; ++i) {
        var cflag = void 0;
        cflag = CS_EndClip(inpts[i]);
        console.log("cflag is ", cflag);
        startC0 = endC;
        // console.log(startPt, " ", endPt);
        if (SegMetWindow(cflag)) {
            if (Clipped(cflag)) {
                console.log("Odsečena i dodata ", startPt);
                outpts[numout] = startPt;
                ++numout;
            }
            console.log("Nije odsečena, dodata ", endPt);
            outpts[numout] = endPt;
            ++numout;
        }
        else if (TwoBitCase(endC)) {
            TwoBitEndPoint(outpts, numout);
        }
        else {
            OneBitEndPoint();
        }
        // osnovni test okretnice
        if (TwoBitCase(endC)) {
            outpts[numout] = clipRegion[Cra[endC & ~TWOBITS]];
            ++numout;
        }
        startPt = inpts[i];
    }
    // zatvori izlaz
    if (numout > 0) {
        outpts[numout] = outpts[0];
        ++numout;
    }
};
var CS_StartClip = function (p) {
    startPt = p;
    startC = ExtendedCsCode(p);
    startC0 = startC;
    if (p.x >= clipRegion[0].x &&
        p.x <= clipRegion[3].x &&
        p.y >= clipRegion[0].y &&
        p.y <= clipRegion[3].y) {
        return SEGM;
    }
    return NOSEGM;
};
var cohenSutherland = function (p1, p2) {
    // let startPointCode = ExtendedCsCode(p1);
    // console.log("Working points ", p1, " ", p2);
    var startPointCode = startC0;
    var endPointCode = ExtendedCsCode(p2);
    var lineAccepted = false;
    var insideClippingRegion = false;
    var outCode = 0;
    var x = 0, y = 0;
    console.log(startPointCode, "  ", endPointCode);
    while (true) {
        // cela linija je unutra
        if (startPointCode === REGION_CODES.INSIDE &&
            endPointCode === REGION_CODES.INSIDE) {
            lineAccepted = true;
            insideClippingRegion = true;
            endC = endPointCode;
            break;
        }
        // cela linija u jednom regionu (koji nije prozor odsecanja)
        else if ((startPointCode & endPointCode) !== REGION_CODES.INSIDE) {
            endC = endPointCode;
            break;
        }
        // segment linije je unutra
        else {
            if (startPointCode !== REGION_CODES.INSIDE) {
                outCode = startPointCode;
            }
            else {
                outCode = endPointCode;
            }
            if ((outCode & REGION_CODES.TOP) !== REGION_CODES.INSIDE) {
                // odseci gore
                x = p1.x + ((p2.x - p1.x) * (clipRegion[3].y - p1.y)) / (p2.y - p1.y);
                y = clipRegion[3].y;
            }
            // odseci dole
            else if ((outCode & REGION_CODES.BOTTOM) !== REGION_CODES.INSIDE) {
                x = p1.x + ((p2.x - p1.x) * (clipRegion[0].y - p1.y)) / (p2.y - p1.y);
                y = clipRegion[0].y;
            }
            // odseci desno
            else if ((outCode & REGION_CODES.RIGHT) !== REGION_CODES.INSIDE) {
                y = p1.y + ((p2.y - p1.y) * (clipRegion[3].x - p1.x)) / (p2.x - p1.x);
                x = clipRegion[3].x;
            }
            // odseci levo
            else if ((outCode & REGION_CODES.LEFT) !== REGION_CODES.INSIDE) {
                y = p1.y + ((p2.y - p1.y) * (clipRegion[0].x - p1.x)) / (p2.x - p1.x);
                x = clipRegion[0].x;
            }
            if (outCode == startPointCode) {
                p1.x = x;
                p1.y = y;
                startC = ExtendedCsCode(p1);
                lineAccepted = true;
                break;
            }
            else {
                p2.x = x;
                p2.y = y;
                endC = ExtendedCsCode(p2);
                lineAccepted = true;
                break;
            }
        }
    }
    startPt = p1;
    endPt = p2;
    if (lineAccepted) {
        if (insideClippingRegion) {
            console.log("segm");
            return SEGM;
        }
        else {
            console.log("segm or clip");
            return SEGM | CLIP;
        }
    }
    else {
        console.log("nosegm");
        return NOSEGM;
    }
};
var CS_EndClip = function (ptI) {
    return cohenSutherland(startPt, ptI);
};
var clipWindow = [
    new Point(100, 100),
    new Point(320, 100),
    new Point(320, 320),
    new Point(100, 320),
];
var polygon1 = [
    new Point(180, 240),
    new Point(0, 320),
    new Point(460, 540),
    new Point(280, 200),
    new Point(360, 120),
    new Point(340, 100),
    new Point(140, 60),
    new Point(60, 220),
    new Point(200, 120),
];
// radi!
var polygon2 = [
    new Point(60, 60),
    new Point(20, 400),
    new Point(400, 360),
    new Point(340, 40),
];
var polygon3 = [
    new Point(20, 20),
    new Point(180, 20),
    new Point(180, 160),
    new Point(240, 160),
    new Point(240, 20),
    new Point(400, 20),
    new Point(400, 180),
    new Point(260, 180),
    new Point(260, 240),
    new Point(400, 240),
    new Point(400, 400),
    new Point(240, 400),
    new Point(240, 260),
    new Point(180, 260),
    new Point(180, 400),
    new Point(20, 400),
    new Point(20, 240),
    new Point(160, 240),
    new Point(160, 180),
    new Point(20, 180),
];
clipRegion = clipWindow;
var out = [];
var nOut = 0;
M_Clip(polygon2, polygon2.length, out, nOut);
console.log(out);
