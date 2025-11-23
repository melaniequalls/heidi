import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { TabNavigation } from './components/TabNavigation';
import { EmptyState } from './components/EmptyState';
import { BottomBar } from './components/BottomBar';
import { FooterWarning } from './components/FooterWarning';
import TaskList from './components/TaskList';
import { AnalysisResult } from './lib/api';

export function App() {
  const [activeTab, setActiveTab] = useState('note');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  React.useEffect(() => {
    const handleAnalysisUpdate = () => {
      const result = (window as any).analysisResult;
      if (result) {
        setAnalysisResult(result);
      }
    };

    const interval = setInterval(handleAnalysisUpdate, 1000);
    return () => clearInterval(interval);
  }, []);

  return <div className="flex h-screen bg-[#FAF9F7] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 overflow-hidden">
          {activeTab === 'note' ? (
            <div className="h-full" />
          ) : (
            <>
              <EmptyState />
              <BottomBar />
            </>
          )}
        </div>
        <FooterWarning />
      </div>
      <TaskList analysisResult={analysisResult} />
    </div>;
}