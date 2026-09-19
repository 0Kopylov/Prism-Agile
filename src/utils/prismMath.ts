/**
 * Mathematical calculations for 3D regular polygonal prisms
 */

export interface PrismGeometry {
  numSides: number;
  faceWidth: number;
  faceHeight: number;
  apothem: number; // translateZ distance from center
  anglePerSide: number; // in degrees
  circumradius: number; // radius to vertices
  svgPolygonPoints: string; // points for SVG top/bottom caps
}

export function calculatePrismGeometry(
  numSides: number,
  faceWidth: number,
  faceHeight: number
): PrismGeometry {
  const safeSides = Math.max(1, Math.min(16, numSides));

  if (safeSides === 1) {
    const circumradius = faceWidth / 2;
    const cy = circumradius;
    const thickness = 10;
    const points = [
      `0,${cy - thickness}`,
      `${faceWidth},${cy - thickness}`,
      `${faceWidth},${cy + thickness}`,
      `0,${cy + thickness}`
    ];
    return {
      numSides: 1,
      faceWidth,
      faceHeight,
      apothem: 0,
      anglePerSide: 0,
      circumradius,
      svgPolygonPoints: points.join(' ')
    };
  }

  if (safeSides === 2) {
    const circumradius = faceWidth / 2;
    const cy = circumradius;
    const thickness = 14;
    const points = [
      `0,${cy - thickness}`,
      `${faceWidth},${cy - thickness}`,
      `${faceWidth},${cy + thickness}`,
      `0,${cy + thickness}`
    ];
    return {
      numSides: 2,
      faceWidth,
      faceHeight,
      apothem: 8,
      anglePerSide: 180,
      circumradius,
      svgPolygonPoints: points.join(' ')
    };
  }

  const angleRad = Math.PI / safeSides;
  const apothem = faceWidth / (2 * Math.tan(angleRad));
  const anglePerSide = 360 / safeSides;
  const circumradius = faceWidth / (2 * Math.sin(angleRad));

  // Generate SVG polygon points centered at (circumradius, circumradius)
  const points: string[] = [];
  const cx = circumradius;
  const cy = circumradius;

  for (let i = 0; i < safeSides; i++) {
    // Offset angle by 90deg so the front face edge aligns horizontally
    const theta = (i * 2 * Math.PI) / safeSides - Math.PI / 2;
    const x = cx + circumradius * Math.cos(theta);
    const y = cy + circumradius * Math.sin(theta);
    points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }

  return {
    numSides: safeSides,
    faceWidth,
    faceHeight,
    apothem,
    anglePerSide,
    circumradius,
    svgPolygonPoints: points.join(' ')
  };
}

export function getFaceAngle(faceIndex: number, numSides: number): number {
  if (numSides <= 1) return 0;
  const anglePerSide = 360 / numSides;
  return faceIndex * anglePerSide;
}

export function getRotationForFace(faceIndex: number, numSides: number): number {
  if (numSides <= 1) return 0;
  const anglePerSide = 360 / numSides;
  return -faceIndex * anglePerSide;
}

export function getClosestFaceIndex(currentRotationY: number, numSides: number): number {
  if (numSides <= 1) return 0;
  const anglePerSide = 360 / numSides;
  // Normalize rotation to positive angle
  const normalized = ((-currentRotationY % 360) + 360) % 360;
  const rawIndex = Math.round(normalized / anglePerSide);
  return rawIndex % numSides;
}
