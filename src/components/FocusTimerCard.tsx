import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { formatTimerDisplay } from '../utils/workspaceLogic';

interface PresetOption {
  label: string;
  minutes: number;
}

const PRESETS: PresetOption[] = [
  { label: 'Fokus 25m', minutes: 25 },
  { label: 'Singkat 15m', minutes: 15 },
  { label: 'Istirahat 5m', minutes: 5 },
];

export const FocusTimerCard: React.FC = () => {
  const [selectedMinutes, setSelectedMinutes] = useState<number>(25);
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(2);

  useEffect(() => {
    if (!isRunning) return;
    const interval = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setCompletedSessions((count) => count + 1);
          return selectedMinutes * 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [isRunning, selectedMinutes]);

  const handleSelectPreset = (minutes: number) => {
    setIsRunning(false);
    setSelectedMinutes(minutes);
    setSecondsLeft(minutes * 60);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(selectedMinutes * 60);
  };

  return (
    <section
      id="waktu-fokus"
      aria-label="Pengatur Waktu Fokus"
      className="bg-white border border-slate-200 rounded-xl p-6"
    >
      <div className="flex items-baseline justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 id="heading-waktu-fokus" className="text-base font-semibold text-slate-900">
            Pengatur Waktu Fokus
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Sesi kerja terfokus tanpa gangguan
          </p>
        </div>
        <span className="text-xs text-slate-500 font-mono tabular-nums whitespace-nowrap shrink-0">
          {completedSessions} sesi selesai
        </span>
      </div>

      <div className="mt-5 flex items-center gap-1 p-1 bg-slate-100 rounded-lg" role="group" aria-label="Pilih durasi fokus">
        {PRESETS.map((preset) => {
          const active = selectedMinutes === preset.minutes;
          return (
            <button
              key={preset.minutes}
              type="button"
              onClick={() => handleSelectPreset(preset.minutes)}
              className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                active
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>

      <div className="my-7 text-center">
        <div
          aria-live="polite"
          className="text-5xl font-semibold tracking-tight text-slate-900 font-mono tabular-nums"
        >
          {formatTimerDisplay(secondsLeft)}
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Status: {isRunning ? 'Sedang berjalan' : 'Siap dimulai'} · Durasi {selectedMinutes} menit
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsRunning((prev) => !prev)}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          {isRunning ? (
            <>
              <Pause className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Jeda Fokus</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Mulai Fokus</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleReset}
          aria-label="Atur ulang waktu fokus"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Atur Ulang</span>
        </button>
      </div>
    </section>
  );
};
