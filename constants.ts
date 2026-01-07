
import { UserMetric, PlatformStat, SentimentData, ChartData, EngagementData, FeatureUsage, LearningTrend, BusinessTrend, SourceData } from './types';

export const USER_METRICS: UserMetric[] = [
  {
    id: '1',
    name: 'Elina Lopez',
    role: 'Designer Web',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80',
    meetingTime: '40h 10m',
    meetingProgress: 75,
    talkPercentage: 80,
    listenPercentage: 20,
  },
  {
    id: '2',
    name: 'Sarah Alves',
    role: 'Pesquisadora UX',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&q=80',
    meetingTime: '22h 15m',
    meetingProgress: 50,
    talkPercentage: 60,
    listenPercentage: 40,
  },
  {
    id: '3',
    name: 'João Silva',
    role: 'Dev Frontend',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80',
    meetingTime: '45h 00m',
    meetingProgress: 80,
    talkPercentage: 50,
    listenPercentage: 50,
  },
];

export const PLATFORM_STATS: PlatformStat[] = [
  { name: 'Desktop', value: 72, color: '#d946ef' },
  { name: 'Mobile', value: 28, color: '#3b82f6' },
];

export const SENTIMENT_DATA: SentimentData[] = [
  { name: 'Positivo', value: 34, color: '#d946ef' },
  { name: 'Negativo', value: 21, color: '#be185d' },
  { name: 'Neutro', value: 45, color: '#4b5563' },
];

export const CHART_DATA: ChartData[] = [
  { name: '01/05', meetings: 20, hours: 15 },
  { name: '02/05', meetings: 35, hours: 28 },
  { name: '03/05', meetings: 45, hours: 32 },
  { name: '04/05', meetings: 30, hours: 25 },
  { name: '05/05', meetings: 55, hours: 44 },
  { name: '06/05', meetings: 80, hours: 65 },
  { name: '07/05', meetings: 40, hours: 30 },
  { name: '08/05', meetings: 35, hours: 26 },
  { name: '09/05', meetings: 60, hours: 48 },
  { name: '10/05', meetings: 45, hours: 38 },
  { name: '11/05', meetings: 30, hours: 24 },
];

export const ENGAGEMENT_TREND: EngagementData[] = [
  { day: 'Seg', dau: 450, wau: 2100 },
  { day: 'Ter', dau: 520, wau: 2150 },
  { day: 'Qua', dau: 610, wau: 2200 },
  { day: 'Qui', dau: 580, wau: 2180 },
  { day: 'Sex', dau: 490, wau: 2120 },
  { day: 'Sáb', dau: 210, wau: 1800 },
  { day: 'Dom', dau: 180, wau: 1750 },
];

export const FEATURE_USAGE_STATS: FeatureUsage[] = [
  { feature: 'Resumo IA', usage: 85 },
  { feature: 'Planner', usage: 72 },
  { feature: 'Post-it Digital', usage: 45 },
  { feature: 'Transcrições', usage: 60 },
  { feature: 'Ações', usage: 55 },
];

export const LEARNING_TREND_DATA: LearningTrend[] = [
  { day: 'Seg', concluded: 120, plans: 45 },
  { day: 'Ter', concluded: 150, plans: 52 },
  { day: 'Qua', concluded: 185, plans: 68 },
  { day: 'Qui', concluded: 160, plans: 50 },
  { day: 'Sex', concluded: 140, plans: 40 },
  { day: 'Sáb', concluded: 90, plans: 25 },
  { day: 'Dom', concluded: 75, plans: 20 },
];

export const BUSINESS_TREND_DATA: BusinessTrend[] = [
  { day: '01/01', newUsers: 12, growth: 2 },
  { day: '02/01', newUsers: 18, growth: 5 },
  { day: '03/01', newUsers: 25, growth: 8 },
  { day: '04/01', newUsers: 22, growth: 7 },
  { day: '05/01', newUsers: 30, growth: 12 },
  { day: '06/01', newUsers: 45, growth: 15 },
  { day: '07/01', newUsers: 38, growth: 14 },
];

export const SOURCE_DISTRIBUTION: SourceData[] = [
  { name: 'Cursos', value: 45, color: '#6366f1' },
  { name: 'Indicações', value: 30, color: '#a855f7' },
  { name: 'Link Direto', value: 25, color: '#ec4899' },
];
