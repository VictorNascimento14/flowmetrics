
import React, { useMemo } from 'react';
import { BookOpen, CheckCircle2, FileJson, CalendarDays, Timer, LineChart, BrainCircuit } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { LEARNING_TREND_DATA } from '../constants.ts';

interface LearningViewProps {
  multiplier: number;
}

const LEARNING_PIE = [
  { name: 'Concluído', value: 72, color: '#10b981' },
  { name: 'Em Aberto', value: 28, color: '#1f2937' },
];

export const LearningView: React.FC<LearningViewProps> = ({ multiplier }) => {
  const dynamicTrend = useMemo(() => {
    return LEARNING_TREND_DATA.map(item => ({
      ...item,
      concluded: Math.round(item.concluded * multiplier),
      plans: Math.round(item.plans * multiplier)
    }));
  }, [multiplier]);

  const stats = useMemo(() => [
    { label: 'Aulas Concluídas', value: Math.round(1240 * multiplier).toLocaleString(), icon: CheckCircle2, color: 'text-emerald-400', sub: '+12% vs mês anterior' },
    { label: 'Resumos Gerados', value: Math.round(852 * multiplier).toLocaleString(), icon: BrainCircuit, color: 'text-cyan-400', sub: '92% de satisfação' },
    { label: 'Planos Criados', value: Math.round(315 * multiplier).toLocaleString(), icon: CalendarDays, color: 'text-blue-400', sub: 'Média 2.4/usuário' },
    { label: 'Tempo Médio Plano', value: `${(4.2 * (0.95 + Math.random() * 0.1)).toFixed(1)} dias`, icon: Timer, color: 'text-amber-400', sub: '-15% tempo de conclusão' },
  ], [multiplier]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card-dark border border-gray-800 rounded-2xl p-5 shadow-lg border-b-2 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(217,70,239,0.15)] transition-all duration-300" style={{ borderBottomColor: i === 0 ? '#10b981' : i === 1 ? '#22d3ee' : 'transparent' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg bg-gray-800/50 ${stat.color}`}>
                <stat.icon size={18} />
              </div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
            </div>
            <p className="text-2xl font-bold text-white mb-1 transition-all duration-300">{stat.value}</p>
            <p className="text-[10px] text-gray-500 font-medium">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 bg-card-dark border border-gray-800 rounded-2xl p-6 shadow-xl hover:border-primary/50 hover:shadow-[0_0_20px_rgba(217,70,239,0.15)] transition-all duration-300">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                <LineChart size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Conteúdos Concluídos</h3>
                <p className="text-xs text-gray-500">Volume de aprendizado diário</p>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dynamicTrend}>
                <defs>
                  <linearGradient id="colorConcluded" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                <YAxis hide />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }} itemStyle={{ color: '#fff' }} />
                <Area type="step" dataKey="concluded" stroke="#10b981" fillOpacity={1} fill="url(#colorConcluded)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-card-dark border border-gray-800 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center hover:border-primary/50 hover:shadow-[0_0_20px_rgba(217,70,239,0.15)] transition-all duration-300">
          <h3 className="text-xs font-bold text-gray-500 mb-6 uppercase tracking-widest w-full text-center">Taxa de Conclusão Global</h3>
          <div className="relative w-48 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={LEARNING_PIE} innerRadius={60} outerRadius={80} dataKey="value" stroke="none" paddingAngle={5} startAngle={180} endAngle={0}>
                  {LEARNING_PIE.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
              <span className="text-3xl font-bold text-white">72%</span>
              <span className="text-[10px] text-emerald-500 font-bold">+5% este mês</span>
            </div>
          </div>
          <div className="mt-4 space-y-2 w-full">
             <div className="flex justify-between items-center bg-gray-900/50 p-3 rounded-xl border border-gray-800">
                <span className="text-xs text-gray-400 font-medium">Retenção após Plano</span>
                <span className="text-xs text-white font-bold">88%</span>
             </div>
             <p className="text-[10px] text-gray-500 text-center italic">Usuários que criam planos voltam 3x mais.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
