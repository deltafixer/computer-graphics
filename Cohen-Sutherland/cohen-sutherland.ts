// RESOURCES: YouTube and GeeksForGeeks
// Andrija Cvetković 72RN

enum REGION_CODES {
  INSIDE = 0,
  LEFT = 1,
  RIGHT = 2,
  BOTTOM = 4,
  TOP = 8,
}

const rectangleDiagonalPoints = {
  bottomLeft: {
    x: 4,
    y: 4,
  },
  topRight: {
    x: 10,
    y: 8,
  },
};

const getRegionalCode = (x: number, y: number): REGION_CODES => {
  let code = REGION_CODES.INSIDE;

  if (x < rectangleDiagonalPoints.bottomLeft.x) {
    code |= REGION_CODES.LEFT;
  } else if (x > rectangleDiagonalPoints.topRight.x) {
    code |= REGION_CODES.RIGHT;
  }
  if (y < rectangleDiagonalPoints.bottomLeft.y) {
    code |= REGION_CODES.BOTTOM;
  } else if (y > rectangleDiagonalPoints.topRight.y) {
    code |= REGION_CODES.TOP;
  }

  return code as REGION_CODES;
};

// odsecanje linije od (x1, y1) do (x2, y2)
const cohenSutherland = (x1: number, y1: number, x2: number, y2: number) => {
  let startPointCode = getRegionalCode(x1, y1);
  let endPointCode = getRegionalCode(x2, y2);

  let lineAccepted = false;

  let outCode = 0;
  let x = 0,
    y = 0;

  while (true) {
    // cela linija je u prozoru odsecanja
    if (
      startPointCode === REGION_CODES.INSIDE &&
      endPointCode === REGION_CODES.INSIDE
    ) {
      lineAccepted = true;
      break;
    }
    // cela linija je u jednom regionu, koji nije prozor odsecanja
    else if ((startPointCode & endPointCode) !== REGION_CODES.INSIDE) {
      break;
    }
    // segment linije je u prozoru odsecanja
    else {
      if (startPointCode !== REGION_CODES.INSIDE) {
        outCode = startPointCode;
      } else {
        outCode = endPointCode;
      }

      if ((outCode & REGION_CODES.TOP) !== REGION_CODES.INSIDE) {
        // odsecanje gornjeg segmenta linije
        x =
          x1 +
          ((x2 - x1) * (rectangleDiagonalPoints.topRight.y - y1)) / (y2 - y1);
        y = rectangleDiagonalPoints.topRight.y;
      }
      // odsecanje donjeg segmenta linije
      else if ((outCode & REGION_CODES.BOTTOM) !== REGION_CODES.INSIDE) {
        x =
          x1 +
          ((x2 - x1) * (rectangleDiagonalPoints.bottomLeft.y - y1)) / (y2 - y1);
        y = rectangleDiagonalPoints.bottomLeft.y;
      }
      // odsecanje desnog segmenta linije
      else if ((outCode & REGION_CODES.RIGHT) !== REGION_CODES.INSIDE) {
        y =
          y1 +
          ((y2 - y1) * (rectangleDiagonalPoints.topRight.x - x1)) / (x2 - x1);
        x = rectangleDiagonalPoints.topRight.x;
      }
      // odsecanje levog segmenta linije
      else if ((outCode & REGION_CODES.LEFT) !== REGION_CODES.INSIDE) {
        y =
          y1 +
          ((y2 - y1) * (rectangleDiagonalPoints.bottomLeft.x - x1)) / (x2 - x1);
        x = rectangleDiagonalPoints.bottomLeft.x;
      }

      // ažuriraj krajnju tačku koja je van prozora odsecanja
      // i zameni je tačkom preseka sa prozorom odsecanja
      if (outCode == startPointCode) {
        x1 = x;
        y1 = y;
        startPointCode = getRegionalCode(x1, y1);
      } else {
        x2 = x;
        y2 = y;
        endPointCode = getRegionalCode(x2, y2);
      }
    }
  }

  if (lineAccepted) {
    console.log(`Linija prihvaćena od (${x1}, ${y1}) do (${x2}, ${y2})`);
  } else console.log("Linija odbačena");
};

cohenSutherland(5, 5, 7, 7);
cohenSutherland(7, 9, 11, 4);
cohenSutherland(1, 5, 4, 1);
