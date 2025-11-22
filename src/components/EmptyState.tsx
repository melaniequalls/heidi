import React, { useState } from 'react';
import { Grid, Edit, MoreHorizontal, Mic, Undo, Redo, Copy, ChevronDown } from 'lucide-react';
export function EmptyState() {
  const [showDropdown, setShowDropdown] = useState(false);
  return <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
      {/* Toolbar */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg border border-gray-200">
            <Grid size={16} />
            Select a template
            <ChevronDown size={14} />
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-900 bg-white hover:bg-gray-50 rounded-lg border border-gray-200">
            <Edit size={16} />
            Goldilocks
          </button>
          <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded">
            <MoreHorizontal size={18} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 text-gray-400 hover:bg-gray-100 rounded">
            <Mic size={18} />
          </button>
          <button className="p-1.5 text-gray-400 hover:bg-gray-100 rounded">
            <Undo size={18} />
          </button>
          <button className="p-1.5 text-gray-400 hover:bg-gray-100 rounded">
            <Redo size={18} />
          </button>
          <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
            Copy
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* Main empty state content */}
      <div className="max-w-xl text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Start this session using the header
        </h2>
        <p className="text-gray-600 mb-8">
          Your note will appear here once your session is complete
        </p>

        {/* Dropdown illustration */}
        <div className="relative inline-block">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-64">
            <button className="w-full bg-green-600 text-white rounded-md px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium mb-3">
              <Mic size={16} />
              Start transcribing
              <ChevronDown size={14} />
            </button>
            <div className="space-y-2 text-left">
              <div className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded text-sm">
                <span className="text-gray-700">Transcribing</span>
                <span className="text-green-600">✓</span>
              </div>
              <div className="px-3 py-2 hover:bg-gray-50 rounded text-sm text-gray-700">
                Dictating
              </div>
              <div className="px-3 py-2 hover:bg-gray-50 rounded text-sm text-gray-700">
                Upload session audio
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
              Select your visit mode in the dropdown
            </div>
          </div>
          {/* Arrow pointing to dropdown */}
          <svg className="absolute -right-24 top-0 w-32 h-32" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M 10 80 Q 50 20, 85 15" className="text-gray-900" />
            <path d="M 85 15 L 75 10 M 85 15 L 80 25" className="text-gray-900" />
          </svg>
        </div>
      </div>
    </div>;
}