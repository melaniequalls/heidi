import { ExternalLink, CheckCircle, XCircle } from 'lucide-react';
import { AnalysisResult } from '../lib/api';

interface AnalysisResultsProps {
  result: AnalysisResult | null;
}

export default function AnalysisResults({ result }: AnalysisResultsProps) {
  if (!result) {
    return null;
  }

  const { agent2_output } = result;

  return (
    <div className="border-b border-stone-200 bg-white">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-stone-900 mb-3">Medication Analysis</h2>

        {agent2_output.valid_drugs.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              Valid Medications ({agent2_output.valid_drugs.length})
            </h3>
            <div className="space-y-1">
              {agent2_output.valid_drugs.map((drug, index) => (
                <div
                  key={index}
                  className="bg-green-50 rounded-lg border border-green-200 px-3 py-2"
                >
                  <p className="text-sm font-medium text-green-900 capitalize">{drug}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {agent2_output.invalid_drugs.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-1">
              <XCircle className="w-4 h-4" />
              Invalid Medications ({agent2_output.invalid_drugs.length})
            </h3>
            <div className="space-y-1">
              {agent2_output.invalid_drugs.map((drug, index) => (
                <div
                  key={index}
                  className="bg-red-50 rounded-lg border border-red-200 px-3 py-2"
                >
                  <p className="text-sm font-medium text-red-900 capitalize">{drug}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {Object.keys(agent2_output.links).length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-stone-900 mb-2">Research Links</h3>
            <div className="space-y-2">
              {Object.entries(agent2_output.links).map(([title, url], index) => (
                <a
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors group"
                >
                  <ExternalLink className="w-4 h-4 flex-shrink-0" />
                  <span className="group-hover:underline">{title}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
