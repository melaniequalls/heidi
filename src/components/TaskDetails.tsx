import { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Trash2, AlertTriangle, Link as LinkIcon } from 'lucide-react';
import { supabase, Task } from '../lib/supabase';

interface TaskDetailsProps {
  task: Task;
  onBack: () => void;
  onDelete: () => void;
}

export default function TaskDetails({ task, onBack, onDelete }: TaskDetailsProps) {
  const [notes, setNotes] = useState(task.notes || '');
  const [evidenceLink, setEvidenceLink] = useState(task.evidence_link || '');
  const [warnings, setWarnings] = useState<string[]>(task.warnings || []);
  const [newWarning, setNewWarning] = useState('');
  const [isAddingWarning, setIsAddingWarning] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setNotes(task.notes || '');
    setEvidenceLink(task.evidence_link || '');
    setWarnings(task.warnings || []);
  }, [task]);

  const updateTask = async (updates: Partial<Task>) => {
    setIsSaving(true);
    const { error } = await supabase
      .from('tasks')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', task.id);

    if (error) {
      console.error('Error updating task:', error);
    }
    setIsSaving(false);
  };

  const handleNotesBlur = () => {
    if (notes !== task.notes) {
      updateTask({ notes });
    }
  };

  const handleEvidenceLinkBlur = () => {
    if (evidenceLink !== task.evidence_link) {
      updateTask({ evidence_link: evidenceLink });
    }
  };

  const addWarning = async () => {
    if (!newWarning.trim()) return;
    const updatedWarnings = [...warnings, newWarning.trim()];
    setWarnings(updatedWarnings);
    await updateTask({ warnings: updatedWarnings });
    setNewWarning('');
    setIsAddingWarning(false);
  };

  const removeWarning = async (index: number) => {
    const updatedWarnings = warnings.filter((_, i) => i !== index);
    setWarnings(updatedWarnings);
    await updateTask({ warnings: updatedWarnings });
  };

  const handleGenerateDocument = async () => {
    await updateTask({ document_generated: true });
    alert('Document generation feature coming soon!');
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete();
    setShowDeleteConfirm(false);
  };

  const toggleComplete = async () => {
    await supabase
      .from('tasks')
      .update({
        completed: !task.completed,
        updated_at: new Date().toISOString()
      })
      .eq('id', task.id);
  };

  return (
    <div className="h-full flex flex-col bg-stone-50">
      <div className="flex items-center gap-3 p-4 border-b border-stone-200">
        <button
          onClick={onBack}
          className="p-1 hover:bg-stone-200 rounded transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-stone-600" />
        </button>
        <h2 className="text-lg font-semibold text-stone-900">Task Details</h2>
        {isSaving && (
          <span className="text-xs text-stone-500 ml-auto">Saving...</span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="bg-white rounded-lg border border-stone-200 p-4">
          <div className="flex items-start gap-3">
            <button
              onClick={toggleComplete}
              className="mt-1 flex-shrink-0"
            >
              {task.completed ? (
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full border-2 border-stone-300 hover:border-stone-400 transition-colors" />
              )}
            </button>
            <h3
              className={`text-lg font-medium flex-1 ${
                task.completed ? 'line-through text-stone-500' : 'text-stone-900'
              }`}
            >
              {task.title}
            </h3>
          </div>
        </div>

        {warnings.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h4 className="font-semibold text-amber-900">Warnings</h4>
            </div>
            <div className="space-y-2">
              {warnings.map((warning, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white rounded px-3 py-2 border border-amber-200"
                >
                  <span className="text-sm text-amber-900">{warning}</span>
                  <button
                    onClick={() => removeWarning(index)}
                    className="text-amber-600 hover:text-amber-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {isAddingWarning && (
          <div className="bg-white rounded-lg border border-stone-200 p-4">
            <input
              type="text"
              value={newWarning}
              onChange={(e) => setNewWarning(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addWarning();
                } else if (e.key === 'Escape') {
                  setIsAddingWarning(false);
                  setNewWarning('');
                }
              }}
              placeholder="Enter warning (e.g., Medication allergy)"
              className="w-full text-sm text-stone-800 placeholder-stone-400 outline-none mb-2"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={addWarning}
                className="px-3 py-1.5 text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 rounded transition-colors"
              >
                Add Warning
              </button>
              <button
                onClick={() => {
                  setIsAddingWarning(false);
                  setNewWarning('');
                }}
                className="px-3 py-1.5 text-sm font-medium text-stone-600 hover:bg-stone-100 rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg border border-stone-200 p-4">
          <label className="block text-sm font-semibold text-stone-900 mb-2">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={handleNotesBlur}
            placeholder="Add detailed notes about this task..."
            className="w-full text-sm text-stone-800 placeholder-stone-400 outline-none resize-none border border-stone-200 rounded p-2 focus:border-stone-400 transition-colors"
            rows={6}
          />
        </div>

        <div className="bg-white rounded-lg border border-stone-200 p-4">
          <label className="block text-sm font-semibold text-stone-900 mb-2">
            <LinkIcon className="w-4 h-4 inline mr-1" />
            Evidence Link
          </label>
          <input
            type="text"
            value={evidenceLink}
            onChange={(e) => setEvidenceLink(e.target.value)}
            onBlur={handleEvidenceLinkBlur}
            placeholder="https://example.com/evidence"
            className="w-full text-sm text-stone-800 placeholder-stone-400 outline-none border border-stone-200 rounded px-3 py-2 focus:border-stone-400 transition-colors"
          />
          {evidenceLink && (
            <a
              href={evidenceLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-700 underline"
            >
              Open link in new tab →
            </a>
          )}
        </div>

        <div className="space-y-3">
          <button
            onClick={handleGenerateDocument}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-stone-800 hover:bg-stone-900 rounded-lg transition-colors"
          >
            <FileText className="w-4 h-4" />
            Generate Document
          </button>

          {!showDeleteConfirm ? (
            <button
              onClick={handleDelete}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
            >
              <Trash2 className="w-4 h-4" />
              Delete Task
            </button>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-900 mb-3">
                Are you sure you want to delete this task? This action cannot be undone.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-stone-600 hover:bg-stone-100 rounded transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
