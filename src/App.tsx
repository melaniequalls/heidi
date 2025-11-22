import React from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { TabNavigation } from './components/TabNavigation';
import { EmptyState } from './components/EmptyState';
import { BottomBar } from './components/BottomBar';
import { FooterWarning } from './components/FooterWarning';
export function App() {
  return <div className="flex h-screen bg-[#FAF9F7] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <TabNavigation />
        <EmptyState />
        <BottomBar />
        <FooterWarning />
      </div>
    </div>;
}