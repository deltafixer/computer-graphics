// RESOURCES: Agoston-M.K.-Computer-Graphics-and-Geometric-Modelling-Implementation-Algorithms-Springer-2005-920s
// Andrija Cvetković 72RN
import Color = require("color");

const xmin: number = 0;
const xmax: number = 0;
const ymin: number = 0;
const ymax: number = 0;

const backgroundColor: Color = new Color({ red: 255, green: 255, blue: 255 });

type Polydata = {
  y: number; // prva skan linija preko koje poligon prelazi
  edges: Edgedata[]; // svakoj ivici poligona se dodeljuje zapis ivice
  // ax + by + cz + d = 0 => ravanska jednačina poligona
  a: number;
  b: number;
  c: number;
  d: number;
  hue: Color;
  active: boolean;
};

type Edgedata = {
  polyP: Polydata; // ukazuje ka podacima za poligon kome ivica pripada
  x: number; // tačka preseka ivice i trenutne skan linije
  dx: number; // promena u x od jedne do druge skan linije
  dy: number; // broj preostalih skan linije koje ivica treba da pređe
};

// declare and initialize
const activePolys: Polydata[] = [];
const activeEdges: Edgedata[] = [];
const buckets: Array<Polydata[]> = new Array<Polydata[]>(ymax); // buckets[y] sadrži sve poligone koji počinju sa skan linije y
let spanLeft: number = 0;
let spanRight: number = 0;

// inicijalizacija podataka bi takođe trebalo da kreira nov Polydata objekat za svaki poligon u sceni
// postavi "aktivno" stanje na "false"
// i doda u korpu buckets[tajPoligon.y]

const watkins = () => {
  for (let i = ymin; i < ymax; ++i) {
    // dodaj sve poligone iz buckets[y] u activePolys (aktivni poligoni)

    // skeniraj ivice poligona iz activePolys i postavi im početke u y u activeEdges

    // sortiraj rastuće activeEdges

    processActiveEdgeList();
    updateActiveEdgeList();
    updateActivePolygonList();
  }
};

const processActiveEdgeList = () => {
  let spanColor: Color = null;
  let polyCount: number = 0;
  let p: Polydata = null;
  spanLeft = xmin;

  activeEdges.forEach((edge: Edgedata) => {
    spanRight = edge.x; // LA
    switch (polyCount) {
      case 0:
        spanColor = backgroundColor;
        break;
      case 1:
        spanColor = activePolys[0].hue;
        break;
      default:
        spanColor = lastVisiblePolygonColor();
    }

    p = edge.polyP;
    p.active != p.active;
    if (p.active) {
      ++polyCount;
    } else {
      --polyCount;
    }

    display([spanLeft, spanRight], spanColor); // LB
    spanLeft = spanRight;
  });

  if (spanLeft < xmax) {
    display([spanLeft, xmax], backgroundColor);
  }
};

const checkForSegIntersections = (): [boolean, number] => {
  const xint = 0;
  // ako se segmenti iz activeEdges liste presecaju
  // sa spanLeft < xint < spanRight
  return [true, xint];

  // ako se segmenti dodiruju u spanLeft
  return [false, spanRight];

  // u suprotnom...
  return [false, spanLeft];
};

// nije def. u Agoston-u
const minActiveZValuePolygon = (x: number, y: number): Polydata => {
  // skeniraj listu aktivnih poligona i vrati podatke onog sa minimalnom z vrednošću u (x, y)
  // z vrednosti se određuju kao: z = -(a * x + b * y + d) /c
  let minZ: number = 0;
  let polyIndex = -1;
  activePolys.forEach((polygon: Polydata, index) => {
    const currZ = -(polygon.a * x + polygon.b * y + polygon.d) / polygon.c;
    if (minZ > currZ) {
      minZ = currZ;
      polyIndex = index;
    }
  });

  if (polyIndex !== -1) {
    return activePolys[polyIndex];
  }
  return null;
};

const lastVisiblePolygonColor = () => {
  const spanStack: Array<number> = [];
  let intersected: boolean = false;
  let xint: number = 0;
  let segColor: Color = null;

  while (true) {
    [intersected, xint] = checkForSegIntersections();

    if (intersected) {
      // LC
      // ima preseka, ubaci trenutni spanRight
      // podeli raspon
      // obradi njegovu levu polovinu => [spanLeft, xint]
      spanStack.push(JSON.parse(JSON.stringify(spanRight)));
      spanRight = xint;
    } else {
      // LD
      // segColor = minActiveZValuePolygon(xint, y).hue;

      if (spanStack.length === 0) {
        return segColor;
      }

      display([spanLeft, spanRight], segColor);
      spanLeft = spanRight;
      spanRight = spanStack.shift();
    }
  }
};

// briše sve ivide koje su prešle sve skan linije
const updateActiveEdgeList = () => {
  activeEdges.forEach((edge: Edgedata, index: number) => {
    if (edge.dy === 0) {
      activeEdges.splice(index, 1);
    } else {
      --edge.dy;
      edge.x += edge.dx;
    }
  });
};

const updateActivePolygonList = () => {
  activePolys.forEach((polygon: Polydata, index: number) => {
    // polygon dy??????
    // if (polygon.dy === 0) {
    // activePolys.splice(index, 1);
    // }
    // else {
    //   --polygon.dy;
    // }
  });
};

const display = (obj: [number, number], color: Color) => {
  // logika iscrtavanja...
};
