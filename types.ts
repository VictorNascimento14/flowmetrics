
export interface UserMetric {
  id: string;
  name: string;
  role: string;
  avatar: string;
  meetingTime: string;
  meetingProgress: number;
  talkPercentage: number;
  listenPercentage: number;
}

export interface PlatformStat {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

export interface SentimentData {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

export interface ChartData {
  name: string;
  meetings: number;
  hours: number;
  [key: string]: string | number;
}

export interface EngagementData {
  day: string;
  dau: number;
  wau: number;
  [key: string]: string | number;
}

export interface FeatureUsage {
  feature: string;
  usage: number;
  [key: string]: string | number;
}

export interface LearningTrend {
  day: string;
  concluded: number;
  plans: number;
  [key: string]: string | number;
}

export interface BusinessTrend {
  day: string;
  newUsers: number;
  growth: number;
  [key: string]: string | number;
}

export interface SourceData {
  name: string;
  value: number;
  color: string;
}
