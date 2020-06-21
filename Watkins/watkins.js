"use strict";
// RESOURCES: Agoston-M.K.-Computer-Graphics-and-Geometric-Modelling-Implementation-Algorithms-Springer-2005-920s
// Andrija Cvetković 72RN
exports.__esModule = true;
var Color = require("color");
// assume viewport is [xmin, xmax] x [ymin, ymax]
var xmin = 0;
var xmax = 0;
var ymin = 0;
var ymax = 0;
var backgroundColor = new Color({ red: 255, green: 255, blue: 255 });
// declare and initialize
var activePolys = [];
var activeEdges = [];
var buckets = new Array(ymax); // buckets[y] holds all polygons which start at scan line y
var spanLeft = 0;
var spanRight = 0;
// initialize data should also
// create a new Polydata object for each polygon in the world
// set its active state to false
// and add it to buckets[thatPolygon.y]
var watkins = function () {
    for (var i = ymin; i < ymax; ++i) {
        // add any polygons in buckets[y] to activePolys
        // scan edges of polygons in activePolys and add them to start at y to activeEdges
        // sort activeEdges by increasing x
        // needed because when the list gets updated below the ordering is destroyed if edges cross
        processActiveEdgeList();
        updateActiveEdgeList();
        updateActivePolygonList();
    }
};
var processActiveEdgeList = function () {
    var spanColor = null;
    var polyCount = 0;
    var p = null;
    spanLeft = xmin;
    activeEdges.forEach(function (edge) {
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
        p.active != p.active; // toggle active state
        if (p.active) {
            ++polyCount;
        }
        else {
            --polyCount;
        }
        display([spanLeft, spanRight], spanColor); // LB
        spanLeft = spanRight;
    });
    if (spanLeft < xmax) {
        display([spanLeft, xmax], backgroundColor);
    }
};
var checkForSegIntersections = function () {
    var xint = 0;
    // if two segments in the activeEdges list intersect at an x-coordinate xint
    // with spanLeft < xint < spanRight
    return [true, xint];
    // if two segments touch at spanLeft
    return [false, spanRight];
    // else
    return [false, spanLeft];
};
// not in Agoston
var minActiveZValuePolygon = function (x, y) {
    // scan active polygon list and return the data fro the one with minimum zvalue at (x, y)
    // z values are determined by: z = -(a * x + b * y + d) /c
    var minZ = 0;
    var polyIndex = -1;
    activePolys.forEach(function (polygon, index) {
        var currZ = -(polygon.a * x + polygon.b * y + polygon.d) / polygon.c;
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
var lastVisiblePolygonColor = function () {
    // checking for intersections is where we may have to do a lot of work? :D
    var _a;
    var spanStack = [];
    var intersected = false;
    var xint = 0;
    var segColor = null;
    while (true) {
        _a = checkForSegIntersections(), intersected = _a[0], xint = _a[1];
        if (intersected) {
            // LC
            // there was an intersection, push current spanRight
            // divide the span
            // process its left half => [spanLeft, xint]
            spanStack.push(JSON.parse(JSON.stringify(spanRight)));
            spanRight = xint;
        }
        else {
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
// removes all edges that hat crossed all scan lines
var updateActiveEdgeList = function () {
    activeEdges.forEach(function (edge, index) {
        if (edge.dy === 0) {
            activeEdges.splice(index, 1);
        }
        else {
            --edge.dy;
            edge.x += edge.dx;
        }
    });
};
var updateActivePolygonList = function () {
    activePolys.forEach(function (polygon, index) {
        // polygon dy??????
        // if (polygon.dy === 0) {
        // activePolys.splice(index, 1);
        // }
        // else {
        //   --polygon.dy;
        // }
    });
};
var display = function (obj, color) {
    // some drawing logic...
};
