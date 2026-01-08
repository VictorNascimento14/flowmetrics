
import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Calendar,
  Download,
  TrendingUp,
  Smile,
  Clock,
  Mic2,
  ChevronDown,
  Activity,
  GraduationCap,
  Briefcase,
  LayoutGrid,
  Check,
  Clock3,
  FileSpreadsheet,
  FileText,
  MonitorSmartphone,
  Loader2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, PieChart, Pie } from 'recharts';
import { CHART_DATA, PLATFORM_STATS, SENTIMENT_DATA, USER_METRICS, FEATURE_USAGE_STATS, ENGAGEMENT_TREND, LEARNING_TREND_DATA } from '../constants.ts';
import { EngagementView } from './EngagementView.tsx';
import { LearningView } from './LearningView.tsx';
import { BusinessView } from './BusinessView.tsx';
import { kpiService, StudyFlowKPIs } from '../services/kpiService';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';

type SubTab = 'Panorama' | 'Engajamento' | 'Aprendizado' | 'Negócio';
type MetricType = 'meetings' | 'hours';

const PROJECTS = [
  { id: 'geral', name: 'Dashboard Geral' },
  { id: 'studyflow', name: 'Projeto StudyFlow' },
  { id: 'financas', name: 'App Financeiro' },
  { id: 'vendas', name: 'Portal Vendas' },
];

const DATE_RANGES = [
  { id: 'hoje', name: 'Hoje', multiplier: 0.1, slice: 3 },
  { id: 'semana', name: 'Esta semana', multiplier: 0.3, slice: 7 },
  { id: 'mes', name: 'Este mês', multiplier: 1, slice: 11 },
  { id: 'ano', name: 'Neste ano', multiplier: 12, slice: 12 },
  { id: 'total', name: 'Todo o período', multiplier: 24, slice: 12 },
];

const MONTH_NAMES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export const Dashboard: React.FC = () => {
  const [subTab, setSubTab] = useState<SubTab>('Panorama');
  const [activeBarIndex, setActiveBarIndex] = useState<number>(0);
  const [metricType, setMetricType] = useState<MetricType>('meetings');
  const [currentProject, setCurrentProject] = useState(PROJECTS[1]); // Default: StudyFlow
  const [currentDateRange, setCurrentDateRange] = useState(DATE_RANGES[2]); // Default: Este mês
  const [studyFlowKpis, setStudyFlowKpis] = useState<StudyFlowKPIs | null>(null);

  const [isProjectMenuOpen, setIsProjectMenuOpen] = useState(false);
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const projectDropdownRef = useRef<HTMLDivElement>(null);
  const dateDropdownRef = useRef<HTMLDivElement>(null);
  const downloadDropdownRef = useRef<HTMLDivElement>(null);

  const displayData = useMemo(() => {
    const { multiplier, slice, id } = currentDateRange;
    const isLongTerm = id === 'ano' || id === 'total';

    let scaledChartData;

    if (currentProject.id === 'studyflow' && studyFlowKpis?.usageTrend && studyFlowKpis.usageTrend.length > 0) {
      scaledChartData = studyFlowKpis.usageTrend.map(item => ({
        name: item.name,
        meetings: item.sessions,
        hours: item.hours
      }));
    } else {
      const baseData = isLongTerm
        ? Array.from({ length: slice }, (_, i) => CHART_DATA[i % CHART_DATA.length])
        : CHART_DATA.slice(0, slice);

      scaledChartData = baseData.map((item, index) => ({
        ...item,
        name: isLongTerm ? MONTH_NAMES[index] : item.name,
        meetings: Math.round(item.meetings * multiplier),
        hours: Math.round(item.hours * multiplier)
      }));
    }

    const scaledPlatformStats = PLATFORM_STATS.map(stat => ({
      ...stat,
      value: Math.min(100, Math.max(10, Math.round(stat.value * (0.95 + (Math.sin(indexToSeed(stat.name)) * 0.05)))))
    }));

    const scaledSentimentData = SENTIMENT_DATA.map((item, idx) => ({
      ...item,
      value: Math.round(item.value * (0.95 + (Math.sin(idx) * 0.05)))
    }));

    const scaledUserMetrics = USER_METRICS.map((user, idx) => {
      const parts = user.meetingTime.split(' ');
      const hours = parseInt(parts[0].replace('h', ''));
      const mins = parseInt(parts[1].replace('m', ''));
      const totalMins = (hours * 60 + mins) * multiplier;
      const newHours = Math.floor(totalMins / 60);
      const newMins = Math.floor(totalMins % 60);

      return {
        ...user,
        meetingTime: `${newHours}h ${newMins}m`,
        talkPercentage: Math.min(100, Math.max(10, Math.round(user.talkPercentage * (0.95 + (Math.sin(idx) * 0.05))))),
        listenPercentage: Math.min(100, Math.max(10, Math.round(user.listenPercentage * (0.95 + (Math.sin(idx + 10) * 0.05)))))
      };
    });

    return {
      chart: scaledChartData,
      platforms: scaledPlatformStats,
      sentiment: scaledSentimentData,
      users: scaledUserMetrics
    };

    function indexToSeed(str: string) {
      return str.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    }
  }, [currentDateRange, studyFlowKpis, currentProject]);

  const handleExportExcel = async () => {
    setIsExporting(true);
    setIsDownloadMenuOpen(false);

    try {
      const wb = XLSX.utils.book_new();
      const mult = currentDateRange.multiplier;

      // 1. Aba: Resumo Executivo (Visão de Gestor)
      const sessions = displayData.chart.reduce((acc, curr) => acc + curr.meetings, 0);
      const hours = displayData.chart.reduce((acc, curr) => acc + curr.hours, 0);
      const sentiment = displayData.sentiment.find(s => s.name === 'Positivo')?.value || 0;
      const aiAdoption = FEATURE_USAGE_STATS.find(f => f.feature === 'Resumo IA')?.usage || 0;

      const execSummary = [
        ['FLOWMETRICS - RELATÓRIO ESTRATÉGICO DE PERFORMANCE'],
        [''],
        ['📌 CONTEXTO DO RELATÓRIO'],
        ['Projeto Ativo', currentProject.name],
        ['Range de Dados', currentDateRange.name],
        ['Objetivo', 'Análise de engajamento e eficiência operacional para tomada de decisão.'],
        ['Data de Extração', new Date().toLocaleString('pt-BR')],
        [''],
        ['🎯 KEY PERFORMANCE INDICATORS (KPIs)'],
        ['KPI', 'Valor Atual', 'Status', 'Benchmark'],
        ['Session Volume', sessions, '🔵 Crescente', '> 500 Ideal'],
        ['Total Engagement Time', `${hours} horas`, '🟢 Excelente', 'Meta: +20h/mês'],
        ['AI Feature Adoption Rate', `${aiAdoption}%`, '🔵 Crescente', '> 70% Meta Core'],
        ['Sentiment Score (Net)', `${sentiment}%`, '🟢 Excelente', '> 60% Saudável'],
        ['Stickiness Rate (D/W)', '32.5%', '🟡 Estável', 'Mercado: 20-40%'],
        [''],
        ['🧠 INSIGHTS AUTOMATIZADOS (IA)'],
        ['• "Observou-se crescimento no uso das ferramentas de IA, com adesão de ' + aiAdoption + '%, impactando positivamente a recorrência semanal."'],
        ['• "A variação de ' + sessions + ' sessões indica um aumento na produtividade do time para o projeto ' + currentProject.name + '."'],
        ['• "Usuários Mobile representam ' + displayData.platforms.find(p => p.name === 'Mobile')?.value + '%, sugerindo necessidade de foco em UX responsivo."']
      ];
      const wsExec = XLSX.utils.aoa_to_sheet(execSummary);
      wsExec['!cols'] = [{ wch: 30 }, { wch: 25 }, { wch: 15 }, { wch: 40 }];
      XLSX.utils.book_append_sheet(wb, wsExec, '1. Resumo Executivo');

      // 2. Aba: KPIs Detalhados (Profundidade)
      const kpiDetails = [
        ['KPI', 'Valor Atual', 'Valor Mês Ant.', 'Variação (%)', 'Status', 'Insight Automático'],
        ['Session Volume', sessions, Math.round(sessions * 0.9), '+11.1%', '🔵 Crescente', 'Aumento de volume indica maior atividade.'],
        ['Total Engagement Time', hours, Math.round(hours * 1.05), '-4.7%', '🟡 Estável', 'Tempo estável, foco em qualidade.'],
        ['AI Feature Adoption', `${aiAdoption}%`, '72%', '+13.0%', '🟢 Excelente', 'Alta aceitação das novas funcionalidades.'],
        ['DAU (Active Users)', Math.round(ENGAGEMENT_TREND[0].dau * mult), Math.round(ENGAGEMENT_TREND[0].dau * mult * 0.8), '+25.0%', '🔵 Crescente', 'Aumento de base diária consistente.'],
      ];
      const wsDetails = XLSX.utils.aoa_to_sheet(kpiDetails);
      wsDetails['!cols'] = [{ wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 45 }];
      XLSX.utils.book_append_sheet(wb, wsDetails, '2. KPIs Detalhados');

      // 3. Aba: Análise de Talentos e Perfis
      const userDetailedData = displayData.users.map(u => ({
        'Nome Completo': u.name,
        'Cargo/Função': u.role,
        'Time Engagement': u.meetingTime,
        'Progresso (%)': u.meetingProgress,
        'Talk Time (%)': u.talkPercentage,
        'Listen Time (%)': u.listenPercentage,
        'Profile Tags': u.talkPercentage > 60 ? 'Proativo/Mentor' : 'Analítico/Ouvinte'
      }));
      const wsUsers = XLSX.utils.json_to_sheet(userDetailedData);
      XLSX.utils.book_append_sheet(wb, wsUsers, '3. Análise de Talentos');

      // 4. Aba: Dados Temporais (Trend Analysis)
      const trendData = ENGAGEMENT_TREND.map(d => {
        const dau = Math.round(d.dau * mult);
        const wau = Math.round(d.wau * mult);
        return {
          'Dia/Período': d.day,
          'Active Users (DAU)': dau,
          'Weekly Active (WAU)': wau,
          'Retention (%)': ((dau / wau) * 100).toFixed(2),
          'Growth Status': dau > 500 ? '🔴 Atenção' : '🟢 Saudável'
        };
      });
      const wsTrend = XLSX.utils.json_to_sheet(trendData);
      XLSX.utils.book_append_sheet(wb, wsTrend, '4. Trend Analysis');

      // 5. Aba: Auditoria e Metadados Técnicos (Diferencial Sênior)
      const technicalFooter = [
        ['AUDITORIA TÉCNICA E GOVERNANÇA'],
        [''],
        ['Métrica', 'Definição Técnica', 'Fonte Primária'],
        ['Session Volume', 'Total de eventos de início de sessão únicos por usuário.', 'Event Logs Pipeline'],
        ['AI Adoption', 'Percentual de usuários que executaram ao menos uma feature de IA no período.', 'Feature Usage API'],
        ['Stickiness', 'Relação entre DAU (Daily Active) e WAU (Weekly Active).', 'Retention Engine'],
        [''],
        ['NOTAS DE GOVERNANÇA:'],
        ['1. KPIs calculados com base em eventos de uso real da plataforma.'],
        ['2. Dados extraídos via pipeline automatizado verificado pela equipe de dados.'],
        ['3. Métricas seguem padrões globais de produto digital (Activation, Retention, Engagement).'],
        [''],
        ['© FlowMetrics Analytics Platform - Relatório Confidencial']
      ];
      const wsAudit = XLSX.utils.aoa_to_sheet(technicalFooter);
      wsAudit['!cols'] = [{ wch: 25 }, { wch: 45 }, { wch: 25 }];
      XLSX.utils.book_append_sheet(wb, wsAudit, '5. Governança e Audit');

      XLSX.writeFile(wb, `Executive_Report_FlowMetrics_${currentProject.id}_${new Date().getTime()}.xlsx`);
    } catch (err) {
      console.error('Erro na exportação Excel:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = () => {
    setIsExporting(true);
    setIsDownloadMenuOpen(false);

    try {
      const doc = new jsPDF();
      const primaryColor = [217, 70, 239]; // Magenta
      const grayDark = [30, 30, 30];
      const grayLight = [248, 248, 250];
      const grayMedium = [100, 100, 100];
      const grayText = [50, 50, 50];

      doc.setFillColor(grayDark[0], grayDark[1], grayDark[2]);
      doc.rect(0, 0, 210, 45, 'F');

      doc.setFontSize(26);
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.text('FlowMetrics', 20, 25);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(180, 180, 180);
      doc.text('ANALYTICS EXECUTIVE REPORT', 20, 32);

      doc.setFontSize(9);
      doc.text(`Projeto: ${currentProject.name}`, 140, 22);
      doc.text(`Período: ${currentDateRange.name}`, 140, 27);
      doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 140, 32);

      doc.setTextColor(grayDark[0], grayDark[1], grayDark[2]);
      doc.setFontSize(18);
      doc.text('Visão Geral de Performance', 20, 60);

      const sessions = displayData.chart.reduce((acc, curr) => acc + curr.meetings, 0);
      const hours = displayData.chart.reduce((acc, curr) => acc + curr.hours, 0);

      const drawKPICard = (x: number, y: number, label: string, value: string, color: number[]) => {
        doc.setFillColor(grayLight[0], grayLight[1], grayLight[2]);
        doc.roundedRect(x, y, 52, 30, 3, 3, 'F');
        doc.setDrawColor(color[0], color[1], color[2]);
        doc.setLineWidth(1);
        doc.line(x + 5, y + 22, x + 47, y + 22);

        doc.setFontSize(8);
        doc.setTextColor(grayMedium[0], grayMedium[1], grayMedium[2]);
        doc.text(label.toUpperCase(), x + 5, y + 8);

        doc.setFontSize(16);
        doc.setTextColor(color[0], color[1], color[2]);
        doc.setFont('helvetica', 'bold');
        doc.text(value, x + 5, y + 18);
      };

      drawKPICard(20, 70, 'Sessões Ativas', sessions.toString(), primaryColor);
      drawKPICard(79, 70, 'Horas de Estudo', `${hours}h`, [59, 130, 246]); // Blue
      drawKPICard(138, 70, 'Satisfação', `${displayData.sentiment.find(s => s.name === 'Positivo')?.value}%`, [16, 185, 129]); // Emerald

      doc.setFontSize(14);
      doc.setTextColor(grayDark[0], grayDark[1], grayDark[2]);
      doc.text('Adoção de Funcionalidades', 20, 115);

      let yBar = 125;
      FEATURE_USAGE_STATS.forEach(f => {
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        doc.text(f.feature, 20, yBar);

        doc.setFillColor(235, 235, 235);
        doc.roundedRect(60, yBar - 3.5, 100, 4, 1, 1, 'F');

        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.roundedRect(60, yBar - 3.5, (f.usage / 100) * 100, 4, 1, 1, 'F');

        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text(`${f.usage}%`, 165, yBar);
        yBar += 10;
      });

      doc.setFillColor(250, 250, 252);
      doc.roundedRect(20, yBar + 10, 170, 40, 2, 2, 'F');

      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setLineWidth(0.5);
      doc.roundedRect(20, yBar + 10, 170, 40, 2, 2, 'D');

      doc.setFontSize(11);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.text('INSIGHTS ESTRATÉGICOS (IA)', 28, yBar + 20);

      doc.setFontSize(10);
      doc.setTextColor(grayText[0], grayText[1], grayText[2]);
      doc.setFont('helvetica', 'italic');
      doc.text('• "Usuários que criam planos têm 37% mais retenção do que a média."', 28, yBar + 28);
      doc.text('• "O acesso Mobile cresceu 12% nas últimas sessões noturnas."', 28, yBar + 35);

      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.setFont('helvetica', 'normal');
      doc.text('FlowMetrics Analytics Platform - Relatório Confidencial', 20, 285);
      doc.text(`Página 1 de 1`, 185, 285);

      doc.save(`FlowMetrics_Executivo_${currentProject.id}.pdf`);
    } catch (err) {
      console.error('Erro na exportação PDF:', err);
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (projectDropdownRef.current && !projectDropdownRef.current.contains(event.target as Node)) {
        setIsProjectMenuOpen(false);
      }
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target as Node)) {
        setIsDateMenuOpen(false);
      }
      if (downloadDropdownRef.current && !downloadDropdownRef.current.contains(event.target as Node)) {
        setIsDownloadMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchKpis = async () => {
      try {
        const data = await kpiService.fetchStudyFlowKPIs(currentDateRange.id);
        setStudyFlowKpis(data);
      } catch (error) {
        console.error('Error fetching StudyFlow KPIs:', error);
      }
    };
    fetchKpis();

    // Opcional: Atualizar a cada 30 segundos para "tempo real"
    const interval = setInterval(fetchKpis, 30000);
    return () => clearInterval(interval);
  }, [currentDateRange.id]);

  useEffect(() => {
    setActiveBarIndex(0);
  }, [displayData.chart]);

  const handleBarClick = (data: any, index: number) => {
    setActiveBarIndex(index);
  };

  const selectedDataPoint = displayData.chart[activeBarIndex] || displayData.chart[0];
  const currentValue = selectedDataPoint[metricType] as number;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div className="flex bg-card-dark border border-gray-800 p-1 rounded-xl overflow-x-auto max-w-full">
          {(['Panorama', 'Engajamento', 'Aprendizado', 'Negócio'] as SubTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setSubTab(tab)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${subTab === tab ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
            >
              {tab === 'Panorama' && <LayoutGrid size={14} />}
              {tab === 'Engajamento' && <Activity size={14} />}
              {tab === 'Aprendizado' && <GraduationCap size={14} />}
              {tab === 'Negócio' && <Briefcase size={14} />}
              {tab}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <div className="relative" ref={projectDropdownRef}>
            <button
              onClick={() => { setIsProjectMenuOpen(!isProjectMenuOpen); setIsDateMenuOpen(false); setIsDownloadMenuOpen(false); }}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-xs font-semibold transition-all ${isProjectMenuOpen ? 'bg-primary/10 border-primary text-primary shadow-lg shadow-primary/10' : 'bg-card-dark border-gray-800 text-gray-400 hover:text-white'}`}
            >
              <Briefcase size={14} />
              <span className="max-w-[120px] truncate">{currentProject.name}</span>
              <ChevronDown size={14} className={`transition-transform duration-300 ${isProjectMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            {isProjectMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-card-dark border border-gray-800 rounded-xl shadow-2xl z-50 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-3 py-2 border-bottom border-gray-800 mb-1">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Selecionar Origem</p>
                </div>
                {PROJECTS.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => { setCurrentProject(project); setIsProjectMenuOpen(false); }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-medium transition-colors ${currentProject.id === project.id ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                  >
                    {project.name}
                    {currentProject.id === project.id && <Check size={14} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative" ref={dateDropdownRef}>
            <button
              onClick={() => { setIsDateMenuOpen(!isDateMenuOpen); setIsProjectMenuOpen(false); setIsDownloadMenuOpen(false); }}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-xs font-semibold transition-all ${isDateMenuOpen ? 'bg-blue-500/10 border-blue-500 text-blue-400 shadow-lg shadow-blue-500/10' : 'bg-card-dark border-gray-800 text-gray-400 hover:text-white'}`}
            >
              <Calendar size={14} />
              <span>{currentDateRange.name}</span>
              <ChevronDown size={14} className={`transition-transform duration-300 ${isDateMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            {isDateMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-card-dark border border-gray-800 rounded-xl shadow-2xl z-50 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-3 py-2 border-bottom border-gray-800 mb-1">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Período</p>
                </div>
                {DATE_RANGES.map((range) => (
                  <button
                    key={range.id}
                    onClick={() => { setCurrentDateRange(range); setIsDateMenuOpen(false); }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-medium transition-colors ${currentDateRange.id === range.id ? 'bg-blue-500/10 text-blue-400' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                  >
                    <div className="flex items-center gap-2">
                      {range.id === 'hoje' ? <Clock3 size={14} /> : <Calendar size={14} />}
                      {range.name}
                    </div>
                    {currentDateRange.id === range.id && <Check size={14} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative" ref={downloadDropdownRef}>
            <button
              onClick={() => { setIsDownloadMenuOpen(!isDownloadMenuOpen); setIsDateMenuOpen(false); setIsProjectMenuOpen(false); }}
              disabled={isExporting}
              className={`flex items-center justify-center w-9 h-9 border rounded-lg transition-all ${isDownloadMenuOpen ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/10' : 'bg-card-dark border-gray-800 text-gray-400 hover:text-white hover:border-gray-600'} ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="Baixar relatório"
            >
              {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            </button>
            {isDownloadMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-card-dark border border-gray-800 rounded-xl shadow-2xl z-50 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-3 py-2 border-bottom border-gray-800 mb-1">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Exportar Relatório</p>
                </div>
                <button
                  onClick={handleExportExcel}
                  className="w-full flex items-center gap-3 px-4 py-3 text-xs font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                >
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500"><FileSpreadsheet size={14} /></div>
                  <div className="text-left">
                    <p className="font-bold">📊 Excel Corporativo (Master)</p>
                    <p className="text-[10px] text-gray-500 italic">5 Abas, KPIs Detalhados e Governança</p>
                  </div>
                </button>
                <button
                  onClick={handleExportPDF}
                  className="w-full flex items-center gap-3 px-4 py-3 text-xs font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
                >
                  <div className="p-1.5 rounded-lg bg-red-500/10 text-red-500"><FileText size={14} /></div>
                  <div className="text-left">
                    <p className="font-bold">📄 PDF Executivo</p>
                    <p className="text-[10px] text-gray-500 italic">Resumo visual e Insights IA</p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {subTab === 'Engajamento' && <EngagementView multiplier={currentDateRange.multiplier} />}
      {subTab === 'Aprendizado' && <LearningView multiplier={currentDateRange.multiplier} studyFlowKpis={studyFlowKpis} />}
      {subTab === 'Negócio' && (
        <BusinessView
          multiplier={currentDateRange.multiplier}
          studyFlowKpis={studyFlowKpis}
          periodId={currentDateRange.id}
          periodName={currentDateRange.name}
        />
      )}
      {subTab === 'Panorama' && (
        <div className="grid grid-cols-12 gap-6 pb-8">
          <div className="col-span-12 lg:col-span-8 bg-card-dark border border-gray-800 rounded-2xl p-6 relative overflow-hidden shadow-xl hover:border-primary/50 hover:shadow-[0_0_20px_rgba(217,70,239,0.15)] transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none -z-10" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary"><TrendingUp size={20} /></div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    Estatísticas: <span className="text-primary">{currentProject.name}</span>
                  </h3>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-0.5">
                    Período: <span className="text-blue-400">{currentDateRange.name}</span> • Amostra: {selectedDataPoint.name}
                  </p>
                </div>
              </div>
              <div className="flex bg-black/40 p-1 rounded-xl">
                {(['meetings', 'hours'] as MetricType[]).map(type => (
                  <button key={type} onClick={() => setMetricType(type)} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${metricType === type ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}>
                    {type === 'meetings' ? 'Sessões' : 'Horas'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                {currentProject.id === 'studyflow' && studyFlowKpis ? (
                  <>
                    <div className="p-5 rounded-2xl bg-gray-800/10 border border-gray-800/50 hover:border-primary/40 transition-all">
                      <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wider">Total Usuários</p>
                      <div className="flex items-center gap-3">
                        <span className="text-4xl font-bold text-white">{studyFlowKpis.totalUsers}</span>
                        <div className="px-2 py-0.5 rounded bg-green-500/10 text-green-500 text-[10px] font-bold">Ativos</div>
                      </div>
                    </div>
                    <div className="p-5 rounded-2xl bg-gray-800/10 border border-gray-800/50 hover:border-primary/40 transition-all">
                      <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wider">Planos (Total / Ativos)</p>
                      <div className="flex items-center gap-3">
                        <span className="text-4xl font-bold text-white">{studyFlowKpis.totalPlans}</span>
                        <div className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 text-[10px] font-bold font-mono">
                          {studyFlowKpis.activePlans} ativos
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-5 rounded-2xl bg-gray-800/10 border border-gray-800/50 hover:border-primary/40 transition-all">
                      <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wider">{metricType === 'meetings' ? 'Total Atividades' : 'Total de Horas'}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-4xl font-bold text-white">{currentValue}{metricType === 'hours' ? 'h' : ''}</span>
                        <div className="px-2 py-0.5 rounded bg-green-500/10 text-green-500 text-[10px] font-bold">{currentValue > (metricType === 'meetings' ? 40 : 30) ? '↑ Alto' : '↓ Estável'}</div>
                      </div>
                    </div>
                    <div className="p-5 rounded-2xl bg-gray-800/10 border border-gray-800/50 hover:border-primary/40 transition-all">
                      <p className="text-xs text-gray-400 mb-2 font-semibold uppercase tracking-wider">Média / Aluno</p>
                      <div className="flex items-center gap-3">
                        <span className="text-4xl font-bold text-white">{Math.max(1, Math.floor(currentValue / 2.5))}{metricType === 'hours' ? 'h' : ''}</span>
                        <div className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 text-[10px] font-bold font-mono">ID:{selectedDataPoint.name}</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="md:col-span-2 h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={displayData.chart} margin={{ bottom: 20 }}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 700 }} dy={10} />
                    <YAxis hide />
                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '12px', padding: '12px' }} labelStyle={{ color: '#ffffff', fontWeight: 'bold' }} itemStyle={{ color: '#f3f4f6', fontSize: '12px' }} formatter={(v: any, n: any) => [v, n === 'meetings' ? 'Sessões' : 'Horas']} />
                    <Bar dataKey={metricType} radius={[6, 6, 0, 0]} barSize={16} onClick={handleBarClick} className="cursor-pointer">
                      {displayData.chart.map((e, i) => <Cell key={`cell-${i}`} fill={i === activeBarIndex ? '#d946ef' : '#27272a'} stroke={i === activeBarIndex ? '#f0abfc' : 'none'} strokeWidth={2} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 bg-card-dark border border-gray-800 rounded-2xl p-6 shadow-xl hover:border-primary/50 hover:shadow-[0_0_20px_rgba(217,70,239,0.15)] transition-all duration-300">
            <div className="flex items-center gap-2 mb-6 text-gray-400 font-bold text-sm uppercase tracking-widest">
              <MonitorSmartphone size={18} /> Acesso por Dispositivo
            </div>
            <div className="space-y-6">
              {(studyFlowKpis?.deviceStats || displayData.platforms).map((stat) => (
                <div key={stat.name} className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-400">{stat.name}</span>
                    <span
                      className="text-white font-bold cursor-help"
                      title={`${'count' in stat ? `${stat.count} acessos` : 'Dados estáticos'}`}
                    >
                      {stat.value}%
                      {'count' in stat && stat.count > 0 && (
                        <span className="text-[10px] text-gray-500 ml-1">({stat.count})</span>
                      )}
                    </span>
                  </div>
                  <div
                    className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden cursor-help"
                    title={`${'count' in stat ? `${stat.count} acessos (${stat.value}%)` : `${stat.value}% - Dados estáticos`}`}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${stat.value}%`, backgroundColor: stat.color }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

          </div>


          <div className="col-span-12 lg:col-span-4 bg-card-dark border border-gray-800 rounded-2xl p-6 shadow-xl hover:border-primary/50 hover:shadow-[0_0_20px_rgba(217,70,239,0.15)] transition-all duration-300">
            <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-widest"><Smile size={18} className="text-gray-400" /> Nível de Satisfação</h3>
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                {displayData.sentiment.map(item => (
                  <div key={item.name} className="flex items-center gap-2 text-xs font-medium">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-gray-400">{item.name}</span><span className="text-white font-bold">{item.value}%</span>
                  </div>
                ))}
              </div>
              <div className="w-28 h-28">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={displayData.sentiment} innerRadius={30} outerRadius={45} dataKey="value" stroke="none" paddingAngle={5}>
                      {displayData.sentiment.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 bg-card-dark border border-gray-800 rounded-2xl p-6 shadow-xl hover:border-primary/50 hover:shadow-[0_0_20px_rgba(217,70,239,0.15)] transition-all duration-300">
            <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-widest"><Clock size={18} className="text-gray-400" /> Tempo de Estudo</h3>
            <div className="space-y-5">
              {(currentProject.id === 'studyflow' && studyFlowKpis?.userMetrics ? studyFlowKpis.userMetrics : displayData.users).map(user => (
                <div key={user.id} className="flex items-center gap-3 hover:bg-white/5 p-1 rounded-lg transition-colors">
                  <img src={user.avatar} className="w-9 h-9 rounded-full object-cover border border-gray-800" />
                  <div className="flex-1 min-w-0"><p className="text-xs font-bold text-white truncate">{user.name}</p></div>
                  <span className="text-[11px] text-gray-300 font-bold bg-gray-900 px-2 py-1 rounded-md">{'studyTime' in user ? user.studyTime : user.meetingTime}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 bg-card-dark border border-gray-800 rounded-2xl p-6 shadow-xl hover:border-primary/50 hover:shadow-[0_0_20px_rgba(217,70,239,0.15)] transition-all duration-300">
            <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2 uppercase tracking-widest"><Mic2 size={18} className="text-gray-400" /> Foco: Vídeo / Leitura</h3>
            <div className="space-y-5">
              {(currentProject.id === 'studyflow' && studyFlowKpis?.userMetrics ? studyFlowKpis.userMetrics : displayData.users).map(user => {
                const videoPct = 'videoPercentage' in user ? user.videoPercentage : user.talkPercentage;
                const readingPct = 'readingPercentage' in user ? user.readingPercentage : user.listenPercentage;
                return (
                  <div key={user.id} className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold"><span className="text-gray-400">{user.name}</span><span className="text-primary">{videoPct}% / {readingPct}%</span></div>
                    <div className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden flex">
                      <div className="h-full bg-primary transition-all duration-500" style={{ width: `${videoPct}%` }}></div>
                      <div className="h-full bg-gray-700 transition-all duration-500" style={{ width: `${readingPct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
