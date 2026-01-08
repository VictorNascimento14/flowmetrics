
import React from 'react';
import { Layers } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({ activeTab }) => {
  return (
    <header className="flex justify-between items-center p-4 md:px-8 md:py-6 bg-transparent sticky top-0 z-10">
      {/* Logo para mobile */}
      <div className="flex items-center gap-3">
        <div className="md:hidden flex items-center gap-2 mr-2">
          <div className="w-8 h-8 rounded-lg custom-gradient-bg flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <Layers size={18} />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-white">FlowMetrics</h1>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">{activeTab}</h2>
      </div>
      
      {/* Botões de Perfil e Notificação removidos */}
    </header>
  );
};
