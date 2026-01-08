
import React, { useMemo } from 'react';
import { TrendingUp, UserPlus, Zap, Globe, Rocket, PieChart as PieIcon, ChevronUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { BUSINESS_TREND_DATA, SOURCE_DISTRIBUTION } from '../constants.ts';
import { StudyFlowKPIs } from '../services/kpiService';

interface BusinessViewProps {
  multiplier: number;
  studyFlowKpis: StudyFlowKPIs | null;
  periodId: string;
  periodName: string;
}

export const BusinessView: React.FC<BusinessViewProps> = ({ multiplier, studyFlowKpis, periodId, periodName }) => {
  const dynamicTrend = useMemo(() => {
    // Use real data if available, otherwise use static scaled data
    if (studyFlowKpis?.userAcquisitionTrend && studyFlowKpis.userAcquisitionTrend.length > 0) {
      return studyFlowKpis.userAcquisitionTrend;
    }

    return BUSINESS_TREND_DATA.map(item => ({
      ...item,
      newUsers: Math.round(item.newUsers * multiplier)
    }));
  }, [multiplier, studyFlowKpis]);

  const stats = useMemo(() => {
    // Determine context for subtexts
    let periodLabel = 'no período';
    let comparisonLabel = 'período anterior';

    if (periodId === 'hoje') {
      periodLabel = 'hoje';
      comparisonLabel = 'ontem';
    } else if (periodId === 'semana') {
      periodLabel = 'esta semana';
      comparisonLabel = 'semana anterior';
    } else if (periodId === 'mes') {
      periodLabel = 'este mês';
      comparisonLabel = 'mês anterior';
    }

    return [
      {
        label: `Novos Usuários / ${periodName.split(' ')[1] || periodName}`,
        value: studyFlowKpis ? studyFlowKpis.periodUsers.toLocaleString() : Math.round(42 * multiplier).toLocaleString(),
        realValue: studyFlowKpis?.periodUsers || null,
        icon: UserPlus,
        color: 'text-indigo-400',
        sub: studyFlowKpis
          ? `${studyFlowKpis.periodGrowth >= 0 ? '+' : ''}${studyFlowKpis.periodGrowth.toFixed(1)}% vs ${comparisonLabel}`
          : '+18% vs ontem'
      },
      {
        label: 'Crescimento',
        value: studyFlowKpis
          ? `${studyFlowKpis.periodGrowth >= 0 ? '+' : ''}${studyFlowKpis.periodGrowth.toFixed(1)}%`
          : `+${(24.8 * (0.9 + Math.random() * 0.2)).toFixed(1)}%`,
        realValue: studyFlowKpis?.periodGrowth || null,
        icon: Rocket,
        color: 'text-violet-400',
        sub: studyFlowKpis
          ? (studyFlowKpis.periodGrowth > 0 ? 'Tendência de alta' : 'Tendência de baixa')
          : 'Tendência de alta'
      },
      {
        label: 'Taxa de Ativação',
        value: studyFlowKpis
          ? `${studyFlowKpis.activationRate.toFixed(1)}%`
          : `${(62.4 * (0.9 + Math.random() * 0.2)).toFixed(1)}%`,
        realValue: studyFlowKpis?.activationRate || null,
        icon: Zap,
        color: 'text-yellow-400',
        sub: studyFlowKpis
          ? `${studyFlowKpis.activationRate > 40 ? 'Acima da' : 'Abaixo da'} média (40%)`
          : 'Média de mercado: 40%'
      },
      {
        label: 'Feature Core #1',
        value: 'Resumo IA',
        realValue: null,
        icon: Globe,
        color: 'text-pink-400',
        sub: '85% usam no 1º dia'
      },
    ];
  }, [multiplier, studyFlowKpis]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card-dark border border-gray-800 rounded-2xl p-5 shadow-lg group hover:border-primary/50 hover:shadow-[0_0_20px_rgba(217,70,239,0.15)] transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg bg-gray-800/50 ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <div className="flex items-center gap-1 text-green-500 text-[10px] font-bold">
                <ChevronUp size={12} /> {i === 2 ? 'Explosivo' : 'Top'}
              </div>
            </div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{stat.label}</p>
            <p
              className="text-2xl font-bold text-white transition-all duration-300 cursor-help"
              title={stat.realValue !== null ? `Dados em tempo real: ${stat.value}` : 'Dados estáticos'}
            >
              {stat.value}
            </p>
            <p className="text-[10px] text-gray-500 mt-2">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 bg-card-dark border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden hover:border-primary/50 hover:shadow-[0_0_20px_rgba(217,70,239,0.15)] transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Rocket size={80} className="text-indigo-500" />
          </div>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
              <TrendingUp size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Aquisição de Novos Usuários</h3>
              <p className="text-xs text-gray-500">Evolução no tempo</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dynamicTrend}>
                <defs>
                  <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                <YAxis hide />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }} itemStyle={{ color: '#fff' }} />
                <Area type="monotone" dataKey="newUsers" stroke="#6366f1" fillOpacity={1} fill="url(#colorNew)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-card-dark border border-gray-800 rounded-2xl p-6 shadow-xl hover:border-primary/50 hover:shadow-[0_0_20px_rgba(217,70,239,0.15)] transition-all duration-300">
          <div className="flex items-center gap-2 mb-6">
            <PieIcon size={18} className="text-gray-500" />
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Origens de Acesso</h3>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={SOURCE_DISTRIBUTION} innerRadius={60} outerRadius={80} dataKey="value" stroke="none" paddingAngle={8}>
                  {SOURCE_DISTRIBUTION.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {SOURCE_DISTRIBUTION.map((source, i) => (
              <div key={i} className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: source.color }} />
                  <span className="text-gray-400 font-medium">{source.name}</span>
                </div>
                <span className="text-white font-bold">{source.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
