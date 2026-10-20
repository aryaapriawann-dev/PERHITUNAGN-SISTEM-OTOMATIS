/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { TaskSection } from './components/TaskSection';
import { FocusTimerCard } from './components/FocusTimerCard';
import { QuickNotesCard } from './components/QuickNotesCard';
import {
  INITIAL_TASKS,
  TaskItem,
  TaskPriority,
  TaskFilter,
  createTaskItem,
  toggleTaskById,
  deleteTaskById,
  clearCompletedTasks,
  filterTasks,
  calculateTaskStats,
} from './utils/workspaceLogic';

const STORAGE_KEY_TASKS = 'ruang_fokus_tasks_v1';
const STORAGE_KEY_NOTE = 'ruang_fokus_note_v1';

const DEFAULT_NOTE =
  'Fokus hari ini:\n1. Selesaikan tugas prioritas utama sebelum makan siang.\n2. Gunakan pengatur waktu 25 menit agar tetap fokus.\n3. Catat hal penting secara singkat dan jelas.';

export default function App() {
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY_TASKS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Fallback to initial seed tasks
    }
    return INITIAL_TASKS;
  });

  const [note, setNote] = useState<string>(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY_NOTE);
      if (saved !== null) return saved;
    } catch {
      // Fallback
    }
    return DEFAULT_NOTE;
  });

  const [filter, setFilter] = useState<TaskFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [lastSavedLabel, setLastSavedLabel] = useState<string>('Tersimpan otomatis');

  const taskInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    } catch {
      // Ignore storage quota errors
    }
  }, [tasks]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY_NOTE, note);
      setLastSavedLabel('Tersimpan otomatis');
    } catch {
      // Ignore storage errors
    }
  }, [note]);

  const handleFocusNewTask = () => {
    taskInputRef.current?.focus();
    taskInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleAddTask = (title: string, category: string, priority: TaskPriority) => {
    const now = new Date();
    const timeLabel = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;
    const newTask = createTaskItem(
      title,
      category,
      priority,
      `task-${Date.now()}`,
      timeLabel
    );
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) => toggleTaskById(prev, id));
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => deleteTaskById(prev, id));
  };

  const handleClearCompleted = () => {
    setTasks((prev) => clearCompletedTasks(prev));
  };

  const handleResetTasks = () => {
    setTasks(INITIAL_TASKS);
    setFilter('all');
    setSearchQuery('');
  };

  const filteredTasks = filterTasks(tasks, filter, searchQuery);
  const stats = calculateTaskStats(tasks);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header onFocusNewTask={handleFocusNewTask} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Intro & Summary Bar */}
        <section id="ringkasan" aria-label="Ringkasan Produktivitas Harian" className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <p className="text-xs font-medium text-slate-500">
                Ruang Kerja Harian · Sederhana & Bebas Gangguan
              </p>
              <h1
                className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900"
                style={{ textWrap: 'balance' }}
              >
                Kelola aktivitas harian dengan tenang dan terarah.
              </h1>
            </div>

            <div className="flex items-center gap-6 text-xs text-slate-600 shrink-0">
              <div>
                <span className="block text-slate-400">Total Tugas</span>
                <span className="text-base font-semibold text-slate-900 font-mono tabular-nums">
                  {stats.total} item
                </span>
              </div>
              <div className="h-7 w-px bg-slate-200" aria-hidden="true" />
              <div>
                <span className="block text-slate-400">Belum Selesai</span>
                <span className="text-base font-semibold text-slate-900 font-mono tabular-nums">
                  {stats.active} aktif
                </span>
              </div>
              <div className="h-7 w-px bg-slate-200" aria-hidden="true" />
              <div>
                <span className="block text-slate-400">Progres Selesai</span>
                <span className="text-base font-semibold text-emerald-700 font-mono tabular-nums">
                  {stats.completionRate}% ({stats.completed}/{stats.total})
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Main 12-Column Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7">
            <TaskSection
              tasks={tasks}
              filteredTasks={filteredTasks}
              filter={filter}
              searchQuery={searchQuery}
              inputRef={taskInputRef}
              onAddTask={handleAddTask}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
              onClearCompleted={handleClearCompleted}
              onFilterChange={setFilter}
              onSearchChange={setSearchQuery}
              onResetTasks={handleResetTasks}
            />
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <FocusTimerCard />
            <QuickNotesCard
              note={note}
              onChangeNote={setNote}
              lastSavedLabel={lastSavedLabel}
            />
          </div>
        </div>
      </main>

      <footer className="mt-12 border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>Ruang Fokus — Aplikasi web produktivitas sederhana.</p>
          <div className="flex items-center gap-4">
            <a href="#ringkasan" className="hover:text-slate-900 transition-colors">
              Ke Atas
            </a>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={handleResetTasks}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Kembalikan Data Contoh
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
