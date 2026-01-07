
import React from 'react';
import { 
  Home, 
  PieChart, 
  Users, 
  Layers, 
  Settings
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const NAV_ITEMS = [
  { id: 'Início', icon: Home },
  { id: 'Análises', icon: PieChart },
];

const WORKSPACE_ITEMS = [
  { id: 'Membros', icon: Users },
  { id: 'Integrações', icon: Layers },
  { id: 'Configurações', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="w-64 flex-shrink-0 bg-card-dark border-r border-gray-800 flex flex-col py-6 px-4 hidden md:flex">
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 mb-10">
        <div className="w-10 h-10 rounded-xl custom-gradient-bg flex items-center justify-center text-white shadow-lg shadow-primary/20">
          <Layers size={24} />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">FlowMetrics</h1>
      </div>

      {/* Primary Navigation */}
      <nav className="space-y-1 mb-10">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'custom-gradient-bg text-white shadow-lg shadow-primary/30' 
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-white' : 'text-gray-400'} />
              <span className="font-medium text-sm">{item.id}</span>
            </button>
          );
        })}
      </nav>

      {/* Workspace Section */}
      <div className="px-3 mt-auto">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">ESPAÇO DE TRABALHO</p>
        <nav className="space-y-2">
          {WORKSPACE_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className="w-full flex items-center gap-3 py-1.5 text-gray-400 hover:text-primary transition-colors group text-left"
              >
                <Icon size={20} className="group-hover:text-primary transition-colors" />
                <span className="font-medium text-sm">{item.id}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
