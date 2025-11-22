import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { TabNavigation } from './components/TabNavigation';
import { EmptyState } from './components/EmptyState';
import { BottomBar } from './components/BottomBar';
import { FooterWarning } from './components/FooterWarning';
import TaskList from './components/TaskList';

export function App() {
  const [activeTab, setActiveTab] = useState('note');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  return <div className="flex h-screen bg-[#FAF9F7] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        {activeTab === 'note' ? (
          <TaskList
            selectedTaskId={selectedTaskId}
            onSelectTask={setSelectedTaskId}
          />
        ) : (
          <>
            <EmptyState />
            <BottomBar />
          </>
        )}
        <FooterWarning />
      </div>
    </div>;
}