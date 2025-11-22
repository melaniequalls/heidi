import React, { useState } from 'react';
import { AlignLeft, FileText, Edit3 } from 'lucide-react';
export function TabNavigation() {
  const [activeTab, setActiveTab] = useState('note');
  const tabs = [{
    id: 'context',
    label: 'Context',
    icon: AlignLeft
  }, {
    id: 'transcript',
    label: 'Transcript',
    icon: FileText
  }, {
    id: 'note',
    label: 'Note',
    icon: Edit3
  }];
  return <div className="bg-white border-b border-gray-200">
      <div className="px-6 flex gap-1">
        {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${isActive ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              <Icon size={16} />
              {tab.label}
            </button>;
      })}
      </div>
    </div>;
}