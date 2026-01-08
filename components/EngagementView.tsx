
import React, { useState, useMemo } from 'react';
import { Users, RotateCcw, MousePointerClick, Clock, BarChart3 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { ENGAGEMENT_TREND, FEATURE_USAGE_STATS } from '../constants.ts';

interface EngagementViewProps {
  multiplier: number;
}

export const EngagementView: React.FC<EngagementViewProps> = ({ multiplier }) => {
  const [activeBarIndex, setActiveBarIndex] = useState<number>(0);

  const dynamicTrend = useMemo(() => {
    return ENGAGEMENT_TREND.map(item => ({
      ...item,
      dau: Math.round(item.dau * multiplier),
      wau: Math.round(item.wau * multiplier)
    }));
  }, [multiplier]);

  // Estatísticas memoizadas para não mudarem ao abrir menus
  const stats = useMemo(() => [
    { label: 'Taxa de Retenção', value: `${(68.5 * (0.95 + Math.random() * 0.1)).toFixed(1)}%`, icon: RotateCcw, color: 'text-primary', trend: '+2.4%' },
    { label: 'Sessões / Usuário', value: (4.2 * (0.9 + Math.random() * 0.2)).toFixed(1), icon: MousePointerClick, color: 'text-blue-400', trend: '+0.8' },
    { label: 'Tempo Médio Uso', value: `${Math.round(18 * multiplier)}m ${Math.round(45 * multiplier)}s`, icon: Clock, color: 'text-green-400', trend: '-1m 12s' },
    { label: 'Total MAU', value: `${(12.4 * multiplier).toFixed(1)}k`, icon: Users, color: 'text-purple-400', trend: '+15%' },
  ], [multiplier]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card-dark border border-gray-800 rounded-2xl p-5 shadow-lg hover:border-primary/50 hover:shadow-[0_0_20px_rgba(217,70,239,0.15)] transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg bg-gray-800/50 ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-white transition-all duration-300">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 lg:col-span-8 bg-card-dark border border-gray-800 rounded-2xl p-4 md:p-6 shadow-xl hover:border-primary/50 hover:shadow-[0_0_20px_rgba(217,70,239,0.15)] transition-all duration-300">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <BarChart3 size={20} />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">Tendência de Usuários Ativos</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dynamicTrend}>
                <defs>
                  <linearGradient id="colorDau" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d946ef" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#d946ef" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 600}} dy={10} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '12px' }}
                  labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                  itemStyle={{ color: '#f3f4f6' }}
                  formatter={(value: any, name: any) => [value, name === 'dau' ? 'Diário' : 'Semanal']}
                />
                <Area type="monotone" dataKey="dau" stroke="#d946ef" fillOpacity={1} fill="url(#colorDau)" strokeWidth={3} />
                <Area type="monotone" dataKey="wau" stroke="#3b82f6" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4 text-[10px] font-bold uppercase tracking-widest">
            <div className="flex items-center gap-2"><div className="w-3 h-1 bg-primary"></div> <span className="text-gray-400">DAU (Diário)</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-1 bg-blue-500 border-t border-dashed"></div> <span className="text-gray-400">WAU (Semanal)</span></div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-card-dark border border-gray-800 rounded-2xl p-4 md:p-6 shadow-xl hover:border-primary/50 hover:shadow-[0_0_20px_rgba(217,70,239,0.15)] transition-all duration-300">
          <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2">
            <MousePointerClick size={16} className="text-gray-500" /> Uso por Funcionalidade
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={FEATURE_USAGE_STATS} layout="vertical" margin={{ left: -10 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="feature" type="category" axisLine={false} tickLine={false} tick={{fill: '#f3f4f6', fontSize: 11, fontWeight: 'bold'}} width={110} />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '12px' }} formatter={(value: any) => [`${value}%`, 'Uso']} />
                <Bar dataKey="usage" radius={[0, 6, 6, 0]} barSize={12} onClick={(d, i) => setActiveBarIndex(i)} className="cursor-pointer">
                  {FEATURE_USAGE_STATS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === activeBarIndex ? '#d946ef' : '#27272a'} stroke={index === activeBarIndex ? '#f0abfc' : 'none'} strokeWidth={1} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
