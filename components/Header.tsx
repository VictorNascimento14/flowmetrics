
import React from 'react';

interface HeaderProps {
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({ activeTab }) => {
  return (
    <header className="flex justify-between items-center p-4 md:px-8 md:py-6 bg-transparent sticky top-0 z-10">
      <h2 className="text-2xl font-bold text-white tracking-tight">{activeTab}</h2>
      
      {/* Botões de Perfil e Notificação removidos */}
    </header>
  );
};
