import React, { useState } from 'react';
import { X, Copy, Check, RotateCcw, Save, AlertCircle } from 'lucide-react';
import { LocationOffsets, TimetableData } from '../types';
import { DEFAULT_LOCATION_OFFSETS, DEFAULT_TIMETABLE } from '../data/defaultData';

interface DataEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  locationOffsets: LocationOffsets;
  timetable: TimetableData;
  onSave: (offsets: LocationOffsets, timetable: TimetableData) => void;
  onReset: () => void;
}

export const DataEditorModal: React.FC<DataEditorModalProps> = ({
  isOpen,
  onClose,
  locationOffsets,
  timetable,
  onSave,
  onReset,
}) => {
  if (!isOpen) return null;

  const currentPayload = {
    location_offsets: locationOffsets,
    timetable: timetable,
  };

  const [rawJson, setRawJson] = useState(() => JSON.stringify(currentPayload, null, 2));
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleApply = () => {
    try {
      const parsed = JSON.parse(rawJson);
      if (!parsed.location_offsets || typeof parsed.location_offsets !== 'object') {
        throw new Error("Missing or invalid 'location_offsets' object");
      }
      if (!parsed.timetable || typeof parsed.timetable !== 'object') {
        throw new Error("Missing or invalid 'timetable' object");
      }
      setError(null);
      onSave(parsed.location_offsets, parsed.timetable);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid JSON format');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(rawJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetToDefaults = () => {
    const def = {
      location_offsets: DEFAULT_LOCATION_OFFSETS,
      timetable: DEFAULT_TIMETABLE,
    };
    setRawJson(JSON.stringify(def, null, 2));
    setError(null);
    onReset();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h3 className="text-base font-bold text-stone-900">
              Timetable &amp; Regional Offsets JSON
            </h3>
            <p className="text-xs text-stone-500">
              Live configuration of town offsets and Silchar base timetable entries
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-stone-200 text-stone-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-3">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-700">JSON Payload:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
              <button
                onClick={handleResetToDefaults}
                className="flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Prompt Defaults</span>
              </button>
            </div>
          </div>

          <textarea
            id="json-editor-textarea"
            value={rawJson}
            onChange={(e) => setRawJson(e.target.value)}
            rows={14}
            className="w-full p-3 font-mono text-xs bg-stone-900 text-emerald-400 rounded-xl border border-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed scrollbar-thin"
            spellCheck={false}
          />

          <p className="text-[11px] text-stone-500">
            Tip: You can add more dates under <code className="text-stone-700 bg-stone-100 px-1 py-0.5 rounded">"timetable"</code> formatted as <code className="text-stone-700 bg-stone-100 px-1 py-0.5 rounded">"MM-DD"</code> with <code className="text-stone-700 bg-stone-100 px-1 py-0.5 rounded">sehri_end, sunrise, dhuhr, asr, maghrib, isha</code>. All town offsets will be automatically applied!
          </p>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-stone-200 bg-stone-50 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-medium text-stone-700 hover:bg-stone-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            id="apply-json-btn"
            onClick={handleApply}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
};
