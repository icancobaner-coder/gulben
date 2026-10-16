import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PUZZLES,
  isPuzzleComplete,
  validateMove,
  isAdjacent,
  coordKey,
} from './rules.ts';

test('isAdjacent correctly checks orthogonal neighbors', () => {
  assert.equal(isAdjacent({ r: 0, c: 0 }, { r: 0, c: 1 }), true);
  assert.equal(isAdjacent({ r: 0, c: 0 }, { r: 1, c: 0 }), true);
  assert.equal(isAdjacent({ r: 0, c: 0 }, { r: 1, c: 1 }), false); // diagonal
  assert.equal(isAdjacent({ r: 0, c: 0 }, { r: 0, c: 2 }), false); // distance 2
});

test('Puzzle 1 solution is valid, covers all 25 cells, and hits checkpoints sequentially', () => {
  const p1 = PUZZLES[0];
  assert.equal(p1.solution.length, 25);
  assert.equal(isPuzzleComplete(p1.solution, p1), true);

  // Verify that stepping through solution move-by-move passes validation
  let currentPath: { r: number; c: number }[] = [];
  for (let i = 0; i < p1.solution.length; i++) {
    const next = p1.solution[i];
    const res = validateMove(currentPath, next, p1);
    assert.equal(res.valid, true, `Step ${i} to (${next.r},${next.c}) failed: ${res.reason}`);
    currentPath = [...currentPath, next];
  }
  assert.equal(isPuzzleComplete(currentPath, p1), true);
});

test('Puzzle 2 (Rematch) solution is valid, covers all 25 cells, and hits checkpoints sequentially', () => {
  const p2 = PUZZLES[1];
  assert.equal(p2.solution.length, 25);
  assert.equal(isPuzzleComplete(p2.solution, p2), true);

  let currentPath: { r: number; c: number }[] = [];
  for (let i = 0; i < p2.solution.length; i++) {
    const next = p2.solution[i];
    const res = validateMove(currentPath, next, p2);
    assert.equal(res.valid, true, `Step ${i} to (${next.r},${next.c}) failed: ${res.reason}`);
    currentPath = [...currentPath, next];
  }
  assert.equal(isPuzzleComplete(currentPath, p2), true);
});

test('Disallows starting anywhere other than Checkpoint 1', () => {
  const p1 = PUZZLES[0];
  const invalidStart = validateMove([], { r: 1, c: 1 }, p1);
  assert.equal(invalidStart.valid, false);

  const validStart = validateMove([], { r: 0, c: 0 }, p1);
  assert.equal(validStart.valid, true);
  assert.equal(validStart.type, 'START');
});

test('Disallows skipping checkpoints out of order', () => {
  const p1 = PUZZLES[0];
  // Start at (0,0) which is CP 1
  let path = [{ r: 0, c: 0 }];
  // Try to jump directly to CP 3 at (0,2) if adjacent (say from (0,1))
  path = [{ r: 0, c: 0 }, { r: 0, c: 1 }];
  // CP at (0,2) is #3, but #2 has not been visited yet!
  const res = validateMove(path, { r: 0, c: 2 }, p1);
  assert.equal(res.valid, false);
  assert.match(res.reason || '', /Sıradaki hedef nokta 2/);
});

test('Enables smooth backtracking when moving to an earlier visited cell', () => {
  const p1 = PUZZLES[0];
  const path = [
    { r: 0, c: 0 },
    { r: 1, c: 0 },
    { r: 2, c: 0 },
  ];
  const backtrackRes = validateMove(path, { r: 1, c: 0 }, p1);
  assert.equal(backtrackRes.valid, true);
  assert.equal(backtrackRes.type, 'BACKTRACK');
  assert.equal(backtrackRes.backtrackIndex, 1);
});
