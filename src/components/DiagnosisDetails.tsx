import { useState, useEffect } from 'react';
import { ArrowLeft, Link as LinkIcon, ExternalLink, Trash2 } from 'lucide-react';
import { supabase, Diagnosis } from '../lib/supabase';

interface DiagnosisDetailsProps {
  diagnosis: Diagnosis;
  onBack: () => void;
  onDelete: () => void;
}

const referenceLinks = [
  {
    title: 'Antibiotics for Pediatric Acute Bacterial Sinusitis',
    url: 'https://pubmed.ncbi.nlm.nih.gov/39412765/'
  },
  {
    title: 'Modern pharmacotherapy of acute bacterial sinusitis: results of an open randomized clinical trial of the therapeutic equivalence of Cefixime EXPRESS and Suprax Solutab',
    url: 'https://pubmed.ncbi.nlm.nih.gov/39104273/'
  },
  {
    title: 'Sinusitis',
    url: 'https://pubmed.ncbi.nlm.nih.gov/39939093/'
  },
  {
    title: 'Intracranial complications secondary to acute bacterial sinusitis requiring neurosurgical intervention before and after the onset of the COVID-19 pandemic',
    url: 'https://pubmed.ncbi.nlm.nih.gov/39094184/'
  }
];

const COMMON_ICD_CODES = [
  { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications' },
  { code: 'I10', description: 'Essential (primary) hypertension' },
  { code: 'E78.5', description: 'Hyperlipidemia, unspecified' },
  { code: 'J44.9', description: 'Chronic obstructive pulmonary disease, unspecified' },
  { code: 'F41.9', description: 'Anxiety disorder, unspecified' },
  { code: 'M79.3', description: 'Panniculitis, unspecified' },
  { code: 'K21.9', description: 'Gastro-esophageal reflux disease without esophagitis' },
  { code: 'N18.9', description: 'Chronic kidney disease, unspecified' },
];

export default function DiagnosisDetails({ diagnosis, onBack, onDelete }: DiagnosisDetailsProps) {
  const [notes, setNotes] = useState(diagnosis.notes || '');
  const [isEditingDiagnosis, setIsEditingDiagnosis] = useState(false);
  const [editedDiagnosis, setEditedDiagnosis] = useState(diagnosis.diagnosis);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setNotes(diagnosis.notes || '');
    setEditedDiagnosis(diagnosis.diagnosis);
  }, [diagnosis]);

  const updateDiagnosis = async (updates: Partial<Diagnosis>) => {
    setIsSaving(true);
    const { error } = await supabase
      .from('diagnoses')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', diagnosis.id);

    if (error) {
      console.error('Error updating diagnosis:', error);
    }
    setIsSaving(false);
  };

  const handleNotesBlur = () => {
    if (notes !== diagnosis.notes) {
      updateDiagnosis({ notes });
    }
  };

  const handleDiagnosisBlur = async () => {
    if (editedDiagnosis.trim() && editedDiagnosis !== diagnosis.diagnosis) {
      await updateDiagnosis({ diagnosis: editedDiagnosis.trim() });
    } else if (!editedDiagnosis.trim()) {
      setEditedDiagnosis(diagnosis.diagnosis);
    }
    setIsEditingDiagnosis(false);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete();
    setShowDeleteConfirm(false);
  };

  return (
    <div className="h-full flex flex-col bg-stone-50">
      <div className="flex items-center gap-2 p-3 border-b border-stone-200">
        <button
          onClick={onBack}
          className="p-1 hover:bg-stone-200 rounded transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-stone-600" />
        </button>
        <h2 className="text-base font-semibold text-stone-900">Diagnosis Details</h2>
        {isSaving && (
          <span className="text-xs text-stone-500 ml-auto">Saving...</span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        <div className="bg-white rounded-lg border border-stone-200 p-3">
          {isEditingDiagnosis ? (
            <input
              type="text"
              value={editedDiagnosis}
              onChange={(e) => setEditedDiagnosis(e.target.value)}
              onBlur={handleDiagnosisBlur}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleDiagnosisBlur();
                } else if (e.key === 'Escape') {
                  setEditedDiagnosis(diagnosis.diagnosis);
                  setIsEditingDiagnosis(false);
                }
              }}
              className="w-full text-base font-medium text-stone-900 outline-none border border-stone-300 rounded px-2 py-1 focus:border-stone-400"
              autoFocus
            />
          ) : (
            <h3
              onClick={() => setIsEditingDiagnosis(true)}
              className="text-base font-medium text-stone-900 cursor-pointer hover:bg-stone-50 rounded px-2 py-1 -ml-2"
            >
              {diagnosis.diagnosis}
            </h3>
          )}
          {diagnosis.codes.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {diagnosis.codes.map((code, idx) => {
                const codeInfo = COMMON_ICD_CODES.find(c => c.code === code);
                return (
                  <span
                    key={idx}
                    className="inline-block px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded"
                    title={codeInfo?.description}
                  >
                    {code}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border border-stone-200 p-3">
          <label className="block text-xs font-semibold text-stone-900 mb-1.5">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={handleNotesBlur}
            placeholder="Add detailed notes..."
            className="w-full text-sm text-stone-800 placeholder-stone-400 outline-none resize-none border border-stone-200 rounded p-2 focus:border-stone-400 transition-colors"
            rows={4}
          />
        </div>

        <div className="bg-white rounded-lg border border-stone-200 p-3">
          <label className="block text-xs font-semibold text-stone-900 mb-2">
            <LinkIcon className="w-3.5 h-3.5 inline mr-1" />
            Reference Links
          </label>
          <div className="space-y-1.5">
            {referenceLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 transition-colors group"
              >
                <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="group-hover:underline">{link.title}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {!showDeleteConfirm ? (
            <button
              onClick={handleDelete}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
            >
              <Trash2 className="w-4 h-4" />
              Delete Diagnosis
            </button>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-xs text-red-900 mb-2">
                Are you sure you want to delete this diagnosis? This action cannot be undone.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded transition-colors"
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
