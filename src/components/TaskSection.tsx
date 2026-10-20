import React, { useState } from 'react';
import { Check, Plus, Search, Trash2, X } from 'lucide-react';
import {
  TaskItem,
  TaskPriority,
  TaskFilter,
  validateTaskTitle,
} from '../utils/workspaceLogic';

interface TaskSectionProps {
  tasks: TaskItem[];
  filteredTasks: TaskItem[];
  filter: TaskFilter;
  searchQuery: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onAddTask: (title: string, category: string, priority: TaskPriority) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onClearCompleted: () => void;
  onFilterChange: (filter: TaskFilter) => void;
  onSearchChange: (query: string) => void;
  onResetTasks: () => void;
}

export const TaskSection: React.FC<TaskSectionProps> = ({
  tasks,
  filteredTasks,
  filter,
  searchQuery,
  inputRef,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onClearCompleted,
  onFilterChange,
  onSearchChange,
  onResetTasks,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Pekerjaan');
  const [priority, setPriority] = useState<TaskPriority>('Utama');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const check = validateTaskTitle(title);
    if (!check.valid) {
      setValidationError(check.error || 'Input tidak valid');
      return;
    }
    setValidationError(null);
    onAddTask(check.cleaned, category, priority);
    setTitle('');
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <section
      id="tugas-harian"
      aria-label="Daftar Tugas Harian"
      className="bg-white border border-slate-200 rounded-xl p-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <h2 id="heading-tugas-harian" className="text-lg font-semibold text-slate-900">
            Daftar Tugas Harian
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola prioritas utama hari ini dengan sederhana dan terstruktur
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start sm:self-auto" role="tablist" aria-label="Filter status tugas">
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'all'}
            onClick={() => onFilterChange('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              filter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua ({tasks.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'active'}
            onClick={() => onFilterChange('active')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              filter === 'active'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Aktif ({tasks.length - completedCount})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'completed'}
            onClick={() => onFilterChange('completed')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              filter === 'completed'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Selesai ({completedCount})
          </button>
        </div>
      </div>

      {/* Add Task Form */}
      <form onSubmit={handleSubmit} noValidate className="mt-5">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-6">
            <label htmlFor="new-task-input" className="block text-xs font-medium text-slate-700 mb-1">
              Nama Tugas
            </label>
            <input
              ref={inputRef}
              id="new-task-input"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (validationError) setValidationError(null);
              }}
              placeholder="Contoh: Kirim laporan bulanan"
              className="w-full rounded-lg border border-slate-200 bg-slate-50/60 px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-slate-900 focus:outline-none transition-colors"
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="new-task-category" className="block text-xs font-medium text-slate-700 mb-1">
              Kategori
            </label>
            <select
              id="new-task-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm text-slate-900 focus:bg-white focus:border-slate-900 focus:outline-none transition-colors"
            >
              <option value="Pekerjaan">Pekerjaan</option>
              <option value="Pribadi">Pribadi</option>
              <option value="Belajar">Belajar</option>
              <option value="Kesehatan">Kesehatan</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="new-task-priority" className="block text-xs font-medium text-slate-700 mb-1">
              Prioritas
            </label>
            <select
              id="new-task-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm text-slate-900 focus:bg-white focus:border-slate-900 focus:outline-none transition-colors"
            >
              <option value="Utama">Utama</option>
              <option value="Normal">Normal</option>
              <option value="Santai">Santai</option>
            </select>
          </div>
        </div>

        <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-h-[20px]">
            {validationError && (
              <p role="alert" className="text-xs font-medium text-red-600">
                {validationError}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Simpan Tugas</span>
          </button>
        </div>
      </form>

      {/* Search Bar */}
      <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search
            className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <label htmlFor="search-task-input" className="sr-only">
            Cari tugas
          </label>
          <input
            id="search-task-input"
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari tugas atau kategori..."
            className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-8 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Hapus pencarian"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          )}
        </div>

        {completedCount > 0 && (
          <button
            type="button"
            onClick={onClearCompleted}
            className="self-end sm:self-auto px-3 py-2 text-xs font-medium text-slate-600 hover:text-red-600 bg-slate-50 hover:bg-red-50 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Hapus {completedCount} Tugas Selesai
          </button>
        )}
      </div>

      {/* Task List or Empty State */}
      {filteredTasks.length === 0 ? (
        <div className="mt-6 py-10 text-center border border-dashed border-slate-200 rounded-lg px-4">
          <p className="text-sm font-medium text-slate-800">
            Tidak ada tugas yang ditampilkan
          </p>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            {tasks.length === 0
              ? 'Semua tugas telah diselesaikan atau dihapus. Tambahkan tugas baru di atas atau muat ulang daftar contoh.'
              : 'Tidak ada tugas yang cocok dengan filter atau kata kunci pencarian saat ini.'}
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            {tasks.length === 0 ? (
              <button
                type="button"
                onClick={onResetTasks}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Muat Tugas Contoh
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onFilterChange('all');
                  onSearchChange('');
                }}
                className="px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Tampilkan Semua Tugas
              </button>
            )}
          </div>
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-slate-100" aria-label="Daftar tugas">
          {filteredTasks.map((task) => (
            <li
              key={task.id}
              className="py-3.5 flex items-start justify-between gap-4 group hover:bg-slate-50/70 -mx-2 px-2 rounded-lg transition-colors"
            >
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => onToggleTask(task.id)}
                  aria-label={
                    task.completed
                      ? `Tandai belum selesai: ${task.title}`
                      : `Tandai selesai: ${task.title}`
                  }
                  className={`mt-0.5 w-6 h-6 rounded-md border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                    task.completed
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-slate-300 bg-white hover:border-slate-900'
                  }`}
                >
                  {task.completed && <Check className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />}
                </button>

                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-medium leading-snug break-words ${
                      task.completed ? 'line-through text-slate-400' : 'text-slate-900'
                    }`}
                  >
                    {task.title}
                  </p>
                  {/* Zero-Pill Unboxed Metadata */}
                  <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                    <span>{task.category}</span>
                    <span aria-hidden="true">·</span>
                    <span
                      className={
                        task.priority === 'Utama' && !task.completed
                          ? 'text-amber-700 font-medium'
                          : 'text-slate-500'
                      }
                    >
                      Prioritas {task.priority}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{task.createdAt}</span>
                    <span aria-hidden="true">·</span>
                    <span>{task.completed ? 'Selesai' : 'Aktif'}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onDeleteTask(task.id)}
                aria-label={`Hapus tugas: ${task.title}`}
                className="p-2 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors shrink-0 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
