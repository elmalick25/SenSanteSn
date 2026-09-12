export interface BarometreKpi {
  id: string;
  label: string;
  value: number;
  formattedValue: string;
  unit: string;
  progressionPercentage: number;
  progressionLabel: string;
  isPositiveTrend: boolean;
  subtitle: string;
  badgeText: string;
  colorTheme: 'emerald' | 'amber' | 'blue' | 'purple';
  icon: string;
}

export interface MonthlyEnrollmentPoint {
  month: string;
  monthLabel: string;
  actualEnrolled: number;
  targetEnrolled: number;
  growthRate: number;
  isMilestone: boolean;
  milestoneDescription?: string;
}

export interface RegionPerformance {
  rank: number;
  regionName: string;
  coveragePercentage: number;
  enrolledCount: number;
  healedMasCount: number;
  statusLabel: string;
  statusTier: 'elite' | 'high' | 'conform' | 'standard' | 'vigilance' | 'urgent';
  isCriticalZone: boolean;
}

export interface PsePillar {
  pillarCode: string;
  title: string;
  description: string;
  achievementRate: number;
  targetRate: number;
  status: string;
  badgeColor: string;
}

export interface BarometreNationalOverview {
  generatedAt: string;
  periodYear: string;
  periodQuarter: string;
  kpis: BarometreKpi[];
  enrollmentSeries: MonthlyEnrollmentPoint[];
  regionalRankings: RegionPerformance[];
  psePillars: PsePillar[];
  globalPerformanceIndex: number;
  averageMonthlyGain: number;
  nationalTargetCoverage: number;
}
