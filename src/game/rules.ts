export interface Coord {
  r: number;
  c: number;
}

export interface PuzzleDefinition {
  id: string;
  title: string;
  subtitle: string;
  gridSize: number;
  checkpoints: Record<string, number>; // key: `${r},${c}` -> number (1-indexed)
  checkpointCoords: Record<number, Coord>;
  solution: Coord[];
}

export const coordKey = (r: number, c: number): string => `${r},${c}`;

export const isAdjacent = (a: Coord, b: Coord): boolean => {
  const dr = Math.abs(a.r - b.r);
  const dc = Math.abs(a.c - b.c);
  return dr + dc === 1;
};

// Puzzle 1: "Klasik Gülben ZIP" (5x5, 25 cells, 5 checkpoints)
// Path: (0,0)->(1,0)->(2,0)->(3,0)->(4,0)->(4,1)->(3,1)->(2,1)->(1,1)->(0,1)->
//       (0,2)->(0,3)->(0,4)->(1,4)->(1,3)->(1,2)->(2,2)->(2,3)->(2,4)->(3,4)->
//       (4,4)->(4,3)->(4,2)->(3,2)->(3,3)
const puzzle1Solution: Coord[] = [
  { r: 0, c: 0 }, // 1 (idx 0)
  { r: 1, c: 0 },
  { r: 2, c: 0 },
  { r: 3, c: 0 },
  { r: 4, c: 0 },
  { r: 4, c: 1 }, // 2 (idx 5)
  { r: 3, c: 1 },
  { r: 2, c: 1 },
  { r: 1, c: 1 },
  { r: 0, c: 1 },
  { r: 0, c: 2 }, // 3 (idx 10)
  { r: 0, c: 3 },
  { r: 0, c: 4 },
  { r: 1, c: 4 },
  { r: 1, c: 3 },
  { r: 1, c: 2 },
  { r: 2, c: 2 },
  { r: 2, c: 3 },
  { r: 2, c: 4 }, // 4 (idx 18)
  { r: 3, c: 4 },
  { r: 4, c: 4 },
  { r: 4, c: 3 },
  { r: 4, c: 2 },
  { r: 3, c: 2 },
  { r: 3, c: 3 }, // 5 (idx 24)
];

// Puzzle 2: "Rövanş Meydan Okuması" (5x5, 25 cells, 5 checkpoints, spiral finish in center)
// Path: (4,0)->(3,0)->(2,0)->(1,0)->(0,0)->(0,1)->(0,2)->(0,3)->(0,4)->(1,4)->
//       (2,4)->(3,4)->(4,4)->(4,3)->(4,2)->(4,1)->(3,1)->(2,1)->(1,1)->(1,2)->
//       (1,3)->(2,3)->(3,3)->(3,2)->(2,2)
const puzzle2Solution: Coord[] = [
  { r: 4, c: 0 }, // 1 (idx 0)
  { r: 3, c: 0 },
  { r: 2, c: 0 },
  { r: 1, c: 0 },
  { r: 0, c: 0 },
  { r: 0, c: 1 },
  { r: 0, c: 2 },
  { r: 0, c: 3 },
  { r: 0, c: 4 },
  { r: 1, c: 4 },
  { r: 2, c: 4 },
  { r: 3, c: 4 },
  { r: 4, c: 4 }, // 2 (idx 12)
  { r: 4, c: 3 },
  { r: 4, c: 2 },
  { r: 4, c: 1 }, // 3 (idx 15)
  { r: 3, c: 1 },
  { r: 2, c: 1 },
  { r: 1, c: 1 },
  { r: 1, c: 2 },
  { r: 1, c: 3 }, // 4 (idx 20)
  { r: 2, c: 3 },
  { r: 3, c: 3 },
  { r: 3, c: 2 },
  { r: 2, c: 2 }, // 5 (idx 24)
];

const buildCheckpoints = (solution: Coord[], indices: number[]): {
  checkpoints: Record<string, number>;
  checkpointCoords: Record<number, Coord>;
} => {
  const checkpoints: Record<string, number> = {};
  const checkpointCoords: Record<number, Coord> = {};
  indices.forEach((solIdx, index) => {
    const num = index + 1;
    const coord = solution[solIdx];
    checkpoints[coordKey(coord.r, coord.c)] = num;
    checkpointCoords[num] = coord;
  });
  return { checkpoints, checkpointCoords };
};

const p1Meta = buildCheckpoints(puzzle1Solution, [0, 5, 10, 18, 24]);
const p2Meta = buildCheckpoints(puzzle2Solution, [0, 12, 15, 20, 24]);

export const PUZZLES: PuzzleDefinition[] = [
  {
    id: 'gulben-special-1',
    title: "GÜLBEN'E ÖZEL ZIP",
    subtitle: "Bu bölümü geçebilir misin?",
    gridSize: 5,
    checkpoints: p1Meta.checkpoints,
    checkpointCoords: p1Meta.checkpointCoords,
    solution: puzzle1Solution,
  },
  {
    id: 'gulben-rematch-2',
    title: "RÖVANŞ ZIP MEYDAN OKUMASI",
    subtitle: "Hâlâ iddialı mısın? Bakalım bunu ne kadar sürede çözeceksin.",
    gridSize: 5,
    checkpoints: p2Meta.checkpoints,
    checkpointCoords: p2Meta.checkpointCoords,
    solution: puzzle2Solution,
  },
];

export interface MoveValidation {
  valid: boolean;
  type?: 'START' | 'APPEND' | 'BACKTRACK' | 'INVALID';
  backtrackIndex?: number;
  reason?: string;
}

export const getNextExpectedCheckpoint = (
  path: Coord[],
  checkpoints: Record<string, number>
): number => {
  if (path.length === 0) return 1;
  let lastFound = 1;
  for (const step of path) {
    const cp = checkpoints[coordKey(step.r, step.c)];
    if (cp && cp > lastFound) {
      lastFound = cp;
    }
  }
  return lastFound + 1;
};

export const validateMove = (
  currentPath: Coord[],
  target: Coord,
  puzzle: PuzzleDefinition
): MoveValidation => {
  const { gridSize, checkpoints } = puzzle;

  // Range check
  if (target.r < 0 || target.r >= gridSize || target.c < 0 || target.c >= gridSize) {
    return { valid: false, type: 'INVALID', reason: 'Tahta dışı hamle' };
  }

  // If path is empty, must start at checkpoint 1
  if (currentPath.length === 0) {
    const cp = checkpoints[coordKey(target.r, target.c)];
    if (cp === 1) {
      return { valid: true, type: 'START' };
    }
    return { valid: false, type: 'INVALID', reason: 'Oyuna 1 numaralı noktadan başlamalısın' };
  }

  // Check if target is already in path (backtracking check)
  const existingIndex = currentPath.findIndex(
    (c) => c.r === target.r && c.c === target.c
  );
  if (existingIndex !== -1) {
    // If it's already the head, no-op
    if (existingIndex === currentPath.length - 1) {
      return { valid: false, type: 'INVALID', reason: 'Zaten buradasın' };
    }
    // Truncate/backtrack to this cell
    return { valid: true, type: 'BACKTRACK', backtrackIndex: existingIndex };
  }

  // Not in path: must be adjacent to current head
  const head = currentPath[currentPath.length - 1];
  if (!isAdjacent(head, target)) {
    return { valid: false, type: 'INVALID', reason: 'Yalnızca bitişik karelere hareket edebilirsin' };
  }

  // Checkpoint validation
  const targetCp = checkpoints[coordKey(target.r, target.c)];
  if (targetCp !== undefined) {
    const nextExpected = getNextExpectedCheckpoint(currentPath, checkpoints);
    if (targetCp !== nextExpected) {
      return {
        valid: false,
        type: 'INVALID',
        reason: `Sıradaki hedef nokta ${nextExpected}, doğrudan ${targetCp}'e geçilemez`,
      };
    }
  }

  return { valid: true, type: 'APPEND' };
};

export const isPuzzleComplete = (
  path: Coord[],
  puzzle: PuzzleDefinition
): boolean => {
  const totalCells = puzzle.gridSize * puzzle.gridSize;
  if (path.length !== totalCells) return false;

  // Verify all cells visited are unique
  const seen = new Set<string>();
  for (const c of path) {
    const k = coordKey(c.r, c.c);
    if (seen.has(k)) return false;
    seen.add(k);
  }

  // Verify sequential checkpoints
  let expectedCp = 1;
  const maxCp = Object.keys(puzzle.checkpointCoords).length;
  for (const c of path) {
    const cp = puzzle.checkpoints[coordKey(c.r, c.c)];
    if (cp !== undefined) {
      if (cp !== expectedCp) return false;
      expectedCp++;
    }
  }

  return expectedCp === maxCp + 1;
};
