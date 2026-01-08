
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar.tsx';
import { Header } from './components/Header.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { HomeDashboard } from './components/HomeDashboard.tsx';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Início');

  return (
    <div className="flex h-screen w-full bg-background-dark text-gray-200 overflow-hidden font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none -z-10" />
        
        <Header activeTab={activeTab} />
        
        <div className="flex-1 overflow-y-auto p-3 md:p-8">
          {activeTab === 'Início' && <HomeDashboard />}
          {activeTab === 'Análises' && <Dashboard />}
          {activeTab !== 'Início' && activeTab !== 'Análises' && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p className="text-xl font-medium italic">Aba {activeTab} em desenvolvimento...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
