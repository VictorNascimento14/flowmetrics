
import React from 'react';

interface AppMonitorProps {
  name: string;
  updatedAt: string;
  activeUsers: number;
  errors: number;
  availability: string;
  avgResponse: string;
}

const AppCard: React.FC<AppMonitorProps> = ({ name, updatedAt, activeUsers, errors, availability, avgResponse }) => (
  <div className="bg-card-dark border border-gray-800 rounded-2xl p-6 shadow-xl hover:border-primary/50 hover:shadow-[0_0_20px_rgba(217,70,239,0.15)] transition-all duration-300 group cursor-default">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-primary transition-colors">{name}</h3>
      <span className="text-[10px] text-gray-500 font-medium">Atualizado: {updatedAt}</span>
    </div>
    
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-gray-900/40 border border-gray-800/50 rounded-xl p-4 flex flex-col items-center justify-center text-center group-hover:border-primary/20 transition-colors">
        <span className="text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-wider">Usuários Ativos</span>
        <span className="text-2xl font-bold text-white">{activeUsers}</span>
      </div>
      <div className="bg-gray-900/40 border border-gray-800/50 rounded-xl p-4 flex flex-col items-center justify-center text-center group-hover:border-primary/20 transition-colors">
        <span className="text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-wider">Erros</span>
        <span className={`text-2xl font-bold ${errors > 0 ? 'text-red-500' : 'text-gray-400'}`}>{errors}</span>
      </div>
      <div className="bg-gray-900/40 border border-gray-800/50 rounded-xl p-4 flex flex-col items-center justify-center text-center group-hover:border-primary/20 transition-colors">
        <span className="text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-wider">Disponibilidade</span>
        <span className="text-2xl font-bold text-green-500">{availability}</span>
      </div>
      <div className="bg-gray-900/40 border border-gray-800/50 rounded-xl p-4 flex flex-col items-center justify-center text-center group-hover:border-primary/20 transition-colors">
        <span className="text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-wider">Resp. Média</span>
        <span className="text-2xl font-bold text-yellow-500">{avgResponse}</span>
      </div>
    </div>
  </div>
);

export const HomeDashboard: React.FC = () => {
  const apps = [
    { name: 'App Financeiro', updatedAt: '2026-01-07 10:30', activeUsers: 1200, errors: 3, availability: '99.98%', avgResponse: '180ms' },
    { name: 'App RH', updatedAt: '2026-01-07 10:25', activeUsers: 800, errors: 0, availability: '99.99%', avgResponse: '150ms' },
    { name: 'App Vendas', updatedAt: '2026-01-07 10:20', activeUsers: 2100, errors: 7, availability: '99.95%', avgResponse: '220ms' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {apps.map((app, idx) => (
        <AppCard key={idx} {...app} />
      ))}
    </div>
  );
};
