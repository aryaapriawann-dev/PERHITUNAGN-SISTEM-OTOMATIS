import React from 'react';
import { Trash2 } from 'lucide-react';
import { countNoteMetrics } from '../utils/workspaceLogic';

interface QuickNotesCardProps {
  note: string;
  onChangeNote: (value: string) => void;
  lastSavedLabel: string;
}

export const QuickNotesCard: React.FC<QuickNotesCardProps> = ({
  note,
  onChangeNote,
  lastSavedLabel,
}) => {
  const { words, characters } = countNoteMetrics(note);

  return (
    <section
      id="catatan-cepat"
      aria-label="Catatan Cepat"
      className="bg-white border border-slate-200 rounded-xl p-6"
    >
      <div className="flex items-baseline justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 id="heading-catatan-cepat" className="text-base font-semibold text-slate-900">
            Catatan Cepat
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tulis ide singkat, poin rapat, atau pengingat harian
          </p>
        </div>
        <span className="text-xs text-slate-500 whitespace-nowrap shrink-0">
          {lastSavedLabel}
        </span>
      </div>

      <div className="mt-4">
        <label htmlFor="quick-note-textarea" className="sr-only">
          Isi Catatan Cepat
        </label>
        <textarea
          id="quick-note-textarea"
          rows={6}
          value={note}
          onChange={(e) => onChangeNote(e.target.value)}
          placeholder="Ketik catatan atau daftar ide Anda di sini..."
          className="w-full rounded-lg border border-slate-200 bg-slate-50/60 px-3.5 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-slate-900 focus:outline-none transition-colors leading-relaxed resize-y"
        />
      </div>

      <div className="mt-3 flex items-center justify-between gap-4 text-xs text-slate-500">
        <div className="font-mono tabular-nums">
          <span>{words} kata</span>
          <span className="mx-1.5" aria-hidden="true">·</span>
          <span>{characters} karakter</span>
        </div>

        <button
          type="button"
          onClick={() => onChangeNote('')}
          disabled={note.length === 0}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-red-600 disabled:opacity-40 disabled:pointer-events-none transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Bersihkan Catatan</span>
        </button>
      </div>
    </section>
  );
};
