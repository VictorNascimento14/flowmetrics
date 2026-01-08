
import React, { useEffect, useState } from 'react';
import { kpiService, StudyFlowKPIs } from '../services/kpiService';

interface AppMonitorProps {
  name: string;
  updatedAt: string;
  activeUsers: number;
  errors: number;
  availability: string;
  avgResponse: string;
  isSupabase?: boolean;
}

const AppCard: React.FC<AppMonitorProps> = ({ name, updatedAt, activeUsers, errors, availability, avgResponse, isSupabase }) => (
  <div className={`bg-card-dark border ${isSupabase ? 'border-primary/30 shadow-[0_0_15px_rgba(217,70,239,0.05)]' : 'border-gray-800'} rounded-2xl p-6 shadow-xl hover:border-primary/50 hover:shadow-[0_0_20px_rgba(217,70,239,0.15)] transition-all duration-300 group cursor-default relative overflow-hidden`}>
    {isSupabase && (
      <div className="absolute top-0 right-0 px-2 py-0.5 bg-primary/20 text-primary text-[8px] font-bold uppercase tracking-wider rounded-bl-lg border-l border-b border-primary/20">
        Live Data
      </div>
    )}
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-primary transition-colors">{name}</h3>
      <span className="text-[10px] text-gray-500 font-medium">Atualizado: {updatedAt}</span>
    </div>

    <div className="grid grid-cols-2 gap-3">
      <div className="bg-gray-900/40 border border-gray-800/50 rounded-xl p-4 flex flex-col items-center justify-center text-center group-hover:border-primary/20 transition-colors">
        <span className="text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-wider">Usuários Totais</span>
        <span className="text-2xl font-bold text-white">{activeUsers}</span>
      </div>
      <div className="bg-gray-900/40 border border-gray-800/50 rounded-xl p-4 flex flex-col items-center justify-center text-center group-hover:border-primary/20 transition-colors">
        <span className="text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-wider">Status Erro</span>
        <span className={`text-2xl font-bold ${errors > 0 ? 'text-red-500' : 'text-gray-400'}`}>{errors > 0 ? 'Alerta' : 'OK'}</span>
      </div>
      <div className="bg-gray-900/40 border border-gray-800/50 rounded-xl p-4 flex flex-col items-center justify-center text-center group-hover:border-primary/20 transition-colors">
        <span className="text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-wider">Planos (Total)</span>
        <span className="text-2xl font-bold text-green-500">{availability}</span>
      </div>
      <div className="bg-gray-900/40 border border-gray-800/50 rounded-xl p-4 flex flex-col items-center justify-center text-center group-hover:border-primary/20 transition-colors">
        <span className="text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-wider">Planos Ativos</span>
        <span className="text-2xl font-bold text-yellow-500">{avgResponse}</span>
      </div>
    </div>
  </div>
);

export const HomeDashboard: React.FC = () => {
  const [studyFlowKpis, setStudyFlowKpis] = useState<StudyFlowKPIs | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await kpiService.fetchStudyFlowKPIs();
        setStudyFlowKpis(data);
      } catch (error) {
        console.error('Error fetching StudyFlow KPIs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const apps = [
    { name: 'App Financeiro', updatedAt: '2026-01-07 10:30', activeUsers: 1200, errors: 3, availability: '145', avgResponse: '82' },
    { name: 'App RH', updatedAt: '2026-01-07 10:25', activeUsers: 800, errors: 0, availability: '312', avgResponse: '156' },
    { name: 'App Vendas', updatedAt: '2026-01-07 10:20', activeUsers: 2100, errors: 7, availability: '540', avgResponse: '210' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AppCard
        name="StudyFlow"
        updatedAt={studyFlowKpis?.lastUpdate || 'Carregando...'}
        activeUsers={studyFlowKpis?.totalUsers || 0}
        errors={0}
        availability={studyFlowKpis?.totalPlans.toString() || '0'}
        avgResponse={studyFlowKpis?.activePlans.toString() || '0'}
        isSupabase={true}
      />
      {apps.map((app, idx) => (
        <AppCard key={idx} {...app} />
      ))}
    </div>
  );
};
