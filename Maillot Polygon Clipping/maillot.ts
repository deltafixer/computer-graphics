// RESOURCES: Agoston-M.K.-Computer-Graphics-and-Geometric-Modelling-Implementation-Algorithms-Springer-2005-920s
// Andrija Cvetković 72RN

enum REGION_CODES {
  INSIDE = 0,
  LEFT = 1,
  RIGHT = 2,
  BOTTOM = 4,
  TOP = 8,
}

class Point {
  x: number = 0;
  y: number = 0;

  constructor(_x: number, _y: number) {
    this.x = _x;
    this.y = _y;
  }
}

const MAXSIZE = 1000;
const NOSEGM = 0;
const SEGM = 1;
const CLIP = 2;
const TWOBITS = 16; // Ovo je zapravo 0001 0000

const Tcc = [0, -3, -6, 1, 3, 0, 1, 0, 6, 1, 0, 0, 1, 0, 0, 0];
const Cra = [-1, -1, -1, 3, -1, -1, 2, -1, -1, 1, -1, -1, 0, -1, -1, -1];

const points: Point[] = new Array(MAXSIZE);

// treba da sadrži granice prozora odsecanja, u obliku: (xmin, ymin), (xmax, ymin), (xmin, ymax), (xmax, ymax)
let clipRegion: Point[] = [];

let startPt: Point; // početna tačka
let startC: number; // početni kod
let startC0: number; // čuva startC za sledeći poziv fje CS_EndClip
let endPt: Point; // krajnja tačka
let endC: number; // krajnji kod
let aC: number;

const SegMetWindow = (cflag: number): boolean => {
  return (cflag & SEGM) !== 0;
};

// treba da vrati truesamo ako je prva tačka odsečena, u suprotnom, generišu se redudantne tačke
const Clipped = (cflag: number): boolean => {
  return (cflag & CLIP) !== 0;
};

const TwoBitCase = (cflag: number): boolean => {
  return (cflag & TWOBITS) !== 0;
};

const TwoBitEndPoint = (outpts: Point[], numout: number) => {
  // linija je odbijena i imamo 2-bitnu krajnju tačku
  if ((startC & endC & (TWOBITS - 1)) === 0) {
    // tačke nemaju iste bitove
    // neophodna je dodatna tačka okreta
    if (TwoBitCase(startC)) {
      BothAreTwoBits();
    } else {
      // 1-bit početak, 2-bit kraj
      aC = endC + Tcc[startC];
    }
    outpts[numout] = clipRegion[Cra[aC & ~TWOBITS]];
    ++numout;
  }
};

const BothAreTwoBits = () => {
  let notdone = true;
  let Pt1 = startPt;
  let Pt2 = endPt;
  let aPt: Point = new Point(0, 0);

  while (notdone) {
    aPt.x = (Pt1.x + Pt2.x) / 2;
    aPt.y = (Pt1.y + Pt2.y) / 2;
    aC = ExtendedCsCode(aPt);

    if (TwoBitCase(aC)) {
      if (aC === endC) {
        Pt2 = aPt;
      } else if (aC === startC) {
        Pt1 = aPt;
      } else {
        notdone = false;
      }
    } else {
      if ((aC & endC) !== 0) {
        aC = endC + Tcc[startC & ~TWOBITS];
      } else {
        aC = startC + Tcc[endC & ~TWOBITS];
      }
      notdone = false;
    }
  }
};

const OneBitEndPoint = () => {
  // linija odbijena, 1-bitna krajnja tačka
  if (TwoBitCase(startC)) {
    if ((startC & endC) === 0) {
      endC = startC + Tcc[endC];
    } else {
      endC |= startC;
      if (Tcc[endC] === 1) {
        endC |= TWOBITS;
      }
    }
  }
};

const ExtendedCsCode = (p: Point): number => {
  if (p.x < clipRegion[0].x) {
    if (p.y > clipRegion[3].y) {
      return 6 | TWOBITS;
    } else if (p.y < clipRegion[0].y) {
      return 12 | TWOBITS;
    }
    return 4;
  } else if (p.x > clipRegion[3].x) {
    if (p.y > clipRegion[3].y) {
      return 3 | TWOBITS;
    } else if (p.y < clipRegion[0].y) {
      return 9 | TWOBITS;
    }
    return 1;
  } else {
    if (p.y > clipRegion[3].y) {
      return 2;
    } else if (p.y < clipRegion[0].y) {
      return 8;
    }
  }
  return 0;
};

// inpts je niz tačaka poligona, outpts je niz tačaka odsečenog poligona
const M_Clip = (
  inpts: Point[],
  numin: number,
  outpts: Point[],
  numout: number
) => {
  numout = 0;

  // ukoliko je prva tačka vidljiva, sačuvaj
  if (CS_StartClip(inpts[0]) > 0) {
    outpts[numout] = startPt;
    ++numout;
  }

  for (let i = 0; i < numin; ++i) {
    let cflag;
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
    } else if (TwoBitCase(endC)) {
      TwoBitEndPoint(outpts, numout);
    } else {
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

const CS_StartClip = (p: Point) => {
  startPt = p;
  startC = ExtendedCsCode(p);
  startC0 = startC;
  if (
    p.x >= clipRegion[0].x &&
    p.x <= clipRegion[3].x &&
    p.y >= clipRegion[0].y &&
    p.y <= clipRegion[3].y
  ) {
    return SEGM;
  }
  return NOSEGM;
};

const cohenSutherland = (p1: Point, p2: Point): number => {
  // let startPointCode = ExtendedCsCode(p1);
  // console.log("Working points ", p1, " ", p2);
  let startPointCode = startC0;
  let endPointCode = ExtendedCsCode(p2);

  let lineAccepted = false;
  let insideClippingRegion = false;

  let outCode = 0;
  let x = 0,
    y = 0;
  console.log(startPointCode, "  ", endPointCode);
  while (true) {
    // cela linija je unutra
    if (
      startPointCode === REGION_CODES.INSIDE &&
      endPointCode === REGION_CODES.INSIDE
    ) {
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
      } else {
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
      } else {
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
    } else {
      console.log("segm or clip");
      return SEGM | CLIP;
    }
  } else {
    console.log("nosegm");
    return NOSEGM;
  }
};

const CS_EndClip = (ptI: Point): number => {
  return cohenSutherland(startPt, ptI);
};

const clipWindow = [
  new Point(100, 100),
  new Point(320, 100),
  new Point(320, 320),
  new Point(100, 320),
];

const polygon1 = [
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
const polygon2 = [
  new Point(60, 60),
  new Point(20, 400),
  new Point(400, 360),
  new Point(340, 40),
];

const polygon3 = [
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

const out: Point[] = [];
let nOut = 0;

M_Clip(polygon2, polygon2.length, out, nOut);

console.log(out);
