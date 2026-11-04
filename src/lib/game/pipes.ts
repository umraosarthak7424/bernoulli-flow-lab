/** Pipe Maze puzzle logic. Directions: 0=N, 1=E, 2=S, 3=W. Tiles: S straight, C corner, T tee. */
export type Kind = "S" | "C" | "T";
export type Tile = { k: Kind; r: number };
export type Level = { rows: number; cols: number; inRow: number; outRow: number; tiles: Tile[][]; q: { text: string; options: string[]; a: number; why: string } };

const BASE: Record<Kind, number[]> = { S: [0, 2], C: [0, 1], T: [0, 1, 2] };
export const openings = (t: Tile) => BASE[t.k].map((d) => (d + t.r) % 4);

const parse = (rows: string[]): Tile[][] => rows.map((row) => row.split(" ").map((c) => ({ k: c[0] as Kind, r: Number(c[1]) })));

const DR = [-1, 0, 1, 0];
const DC = [0, 1, 0, -1];

/** Cells filled with water (flood from the inlet on the west side of inRow, column 0). */
export function flooded(l: Pick<Level, "rows" | "cols" | "inRow">, tiles: Tile[][]): Set<string> {
  const seen = new Set<string>();
  const start = tiles[l.inRow]?.[0];
  if (!start || !openings(start).includes(3)) return seen;
  const stack: [number, number][] = [[l.inRow, 0]];
  while (stack.length) {
    const [r, c] = stack.pop()!;
    const key = `${r},${c}`;
    if (seen.has(key)) continue;
    seen.add(key);
    for (const d of openings(tiles[r]![c]!)) {
      const nr = r + DR[d]!, nc = c + DC[d]!;
      const n = tiles[nr]?.[nc];
      if (n && openings(n).includes((d + 2) % 4)) stack.push([nr, nc]);
    }
  }
  return seen;
}

export function isSolved(l: Level, tiles: Tile[][]): boolean {
  const out = tiles[l.outRow]?.[l.cols - 1];
  return !!out && flooded(l, tiles).has(`${l.outRow},${l.cols - 1}`) && openings(out).includes(1);
}

export const rotate = (tiles: Tile[][], r: number, c: number): Tile[][] =>
  tiles.map((row, i) => row.map((t, j) => (i === r && j === c ? { ...t, r: (t.r + 1) % 4 } : t)));

/** Deterministic scramble that is guaranteed unsolved. */
export function scramble(l: Level): Tile[][] {
  let t = l.tiles.map((row, i) => row.map((x, j) => ({ ...x, r: (x.r + ((i * 7 + j * 3) % 3) + 1) % 4 })));
  let n = 0;
  while (isSolved(l, t) && n < 4) { t = rotate(t, l.inRow, 0); n++; }
  return t;
}

export const LEVELS: Level[] = [
  {
    rows: 3, cols: 4, inRow: 0, outRow: 2,
    tiles: parse(["S1 C2 C0 S0", "C1 S0 S1 C3", "S0 C0 S1 S1"]),
    q: { text: "Water enters a pipe of area 4 cm² at 2 m/s. The pipe narrows to 1 cm². What is the speed there?", options: ["0.5 m/s", "2 m/s", "8 m/s", "16 m/s"], a: 2, why: "Continuity: A₁v₁ = A₂v₂ → v₂ = (4 × 2) ÷ 1 = 8 m/s." },
  },
  {
    rows: 4, cols: 5, inRow: 1, outRow: 3,
    tiles: parse(["C0 C1 S1 C2 T0", "S1 C3 T1 S0 C2", "C2 S0 C1 C3 S1", "S1 T2 C0 S1 S1"]),
    q: { text: "Q = A·v. A pipe carries 0.002 m³/s through an area of 0.001 m². What is v?", options: ["0.5 m/s", "2 m/s", "0.002 m/s", "20 m/s"], a: 1, why: "v = Q ÷ A = 0.002 ÷ 0.001 = 2 m/s." },
  },
  {
    rows: 5, cols: 5, inRow: 0, outRow: 4,
    tiles: parse(["S1 S1 C2 T0 C1", "C0 T1 S0 C2 S0", "S0 C1 C3 S1 C3", "C2 S0 T2 C1 C2", "S1 C0 S1 C3 C0"]),
    q: { text: "In a horizontal pipe (same height everywhere), water speeds up in a narrow section. Its pressure there…", options: ["rises", "drops", "stays the same", "becomes zero"], a: 1, why: "With h constant, P + ½ρv² = constant, so higher v means lower P (ideal, steady, incompressible flow)." },
  },
];
