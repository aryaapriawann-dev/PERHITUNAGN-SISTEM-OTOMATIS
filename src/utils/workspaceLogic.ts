export type TaskPriority = 'Utama' | 'Normal' | 'Santai';
export type TaskFilter = 'all' | 'active' | 'completed';

export interface TaskItem {
  id: string;
  title: string;
  category: string;
  priority: TaskPriority;
  completed: boolean;
  createdAt: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  active: number;
  completionRate: number;
}

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'task-1',
    title: 'Merapikan rencana kerja mingguan dan target utama',
    category: 'Pekerjaan',
    priority: 'Utama',
    completed: false,
    createdAt: '08:30',
  },
  {
    id: 'task-2',
    title: 'Membaca buku pengembangan diri selama 20 menit',
    category: 'Pribadi',
    priority: 'Normal',
    completed: true,
    createdAt: '07:15',
  },
  {
    id: 'task-3',
    title: 'Menyiapkan dokumen presentasi proyek klien',
    category: 'Pekerjaan',
    priority: 'Utama',
    completed: false,
    createdAt: '09:00',
  },
  {
    id: 'task-4',
    title: 'Olahraga peregangan ringan sore hari',
    category: 'Kesehatan',
    priority: 'Santai',
    completed: false,
    createdAt: '10:05',
  },
];

export function validateTaskTitle(rawTitle: string): { valid: boolean; error?: string; cleaned: string } {
  const cleaned = rawTitle.trim();
  if (!cleaned) {
    return {
      valid: false,
      error: 'Nama tugas tidak boleh kosong. Silakan ketik minimal 3 karakter.',
      cleaned: '',
    };
  }
  if (cleaned.length < 3) {
    return {
      valid: false,
      error: 'Nama tugas terlalu pendek. Minimal 3 karakter.',
      cleaned,
    };
  }
  return { valid: true, cleaned };
}

export function createTaskItem(
  title: string,
  category: string,
  priority: TaskPriority,
  id: string,
  timeLabel: string
): TaskItem {
  return {
    id,
    title: title.trim(),
    category: category.trim() || 'Umum',
    priority,
    completed: false,
    createdAt: timeLabel,
  };
}

export function toggleTaskById(tasks: TaskItem[], id: string): TaskItem[] {
  return tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
}

export function deleteTaskById(tasks: TaskItem[], id: string): TaskItem[] {
  return tasks.filter((task) => task.id !== id);
}

export function clearCompletedTasks(tasks: TaskItem[]): TaskItem[] {
  return tasks.filter((task) => !task.completed);
}

export function filterTasks(
  tasks: TaskItem[],
  filter: TaskFilter,
  searchQuery: string
): TaskItem[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();
  return tasks.filter((task) => {
    if (filter === 'active' && task.completed) return false;
    if (filter === 'completed' && !task.completed) return false;
    if (!normalizedQuery) return true;
    return (
      task.title.toLowerCase().includes(normalizedQuery) ||
      task.category.toLowerCase().includes(normalizedQuery) ||
      task.priority.toLowerCase().includes(normalizedQuery)
    );
  });
}

export function calculateTaskStats(tasks: TaskItem[]): TaskStats {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const active = total - completed;
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { total, completed, active, completionRate };
}

export function formatTimerDisplay(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function countNoteMetrics(text: string): { words: number; characters: number } {
  const trimmed = text.trim();
  const characters = text.length;
  const words = trimmed === '' ? 0 : trimmed.split(/\s+/).length;
  return { words, characters };
}
