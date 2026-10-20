import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_TASKS,
  validateTaskTitle,
  createTaskItem,
  toggleTaskById,
  deleteTaskById,
  clearCompletedTasks,
  filterTasks,
  calculateTaskStats,
  formatTimerDisplay,
  countNoteMetrics,
} from './workspaceLogic.ts';

test('validateTaskTitle rejects empty and short strings and trims valid input', () => {
  const emptyRes = validateTaskTitle('   ');
  assert.equal(emptyRes.valid, false);
  assert.ok(emptyRes.error);

  const shortRes = validateTaskTitle('ab');
  assert.equal(shortRes.valid, false);

  const validRes = validateTaskTitle('  Belajar TypeScript  ');
  assert.equal(validRes.valid, true);
  assert.equal(validRes.cleaned, 'Belajar TypeScript');
});

test('toggleTaskById and deleteTaskById update task state immutably', () => {
  const item = createTaskItem('Menulis catatan', 'Pribadi', 'Normal', 't-100', '10:00');
  const list = [item];

  const toggled = toggleTaskById(list, 't-100');
  assert.equal(toggled[0].completed, true);
  assert.equal(list[0].completed, false);

  const afterDelete = deleteTaskById(toggled, 't-100');
  assert.equal(afterDelete.length, 0);
});

test('filterTasks filters by status and search query accurately', () => {
  const activeOnly = filterTasks(INITIAL_TASKS, 'active', '');
  assert.equal(activeOnly.every((t) => !t.completed), true);

  const completedOnly = filterTasks(INITIAL_TASKS, 'completed', '');
  assert.equal(completedOnly.every((t) => t.completed), true);

  const searched = filterTasks(INITIAL_TASKS, 'all', 'presentasi');
  assert.equal(searched.length, 1);
  assert.equal(searched[0].id, 'task-3');
});

test('calculateTaskStats computes completion rate and counts', () => {
  const stats = calculateTaskStats(INITIAL_TASKS);
  assert.equal(stats.total, 4);
  assert.equal(stats.completed, 1);
  assert.equal(stats.active, 3);
  assert.equal(stats.completionRate, 25);

  const emptyStats = calculateTaskStats([]);
  assert.equal(emptyStats.completionRate, 0);
});

test('clearCompletedTasks removes only completed tasks', () => {
  const remaining = clearCompletedTasks(INITIAL_TASKS);
  assert.equal(remaining.length, 3);
  assert.equal(remaining.some((t) => t.completed), false);
});

test('formatTimerDisplay formats seconds as MM:SS with zero padding', () => {
  assert.equal(formatTimerDisplay(1500), '25:00');
  assert.equal(formatTimerDisplay(65), '01:05');
  assert.equal(formatTimerDisplay(0), '00:00');
});

test('countNoteMetrics counts words and characters accurately', () => {
  assert.deepEqual(countNoteMetrics(''), { words: 0, characters: 0 });
  assert.deepEqual(countNoteMetrics('Satu dua tiga'), { words: 3, characters: 13 });
});
