export interface Consultation {
  id: string;
  title: string;
  category: string;
  status: 'Approved' | 'Pending' | 'Declined';
  image: string;
}

export type TabType = 'Approved' | 'Pending' | 'Declined' | 'History';

export interface KpiCardProps {
  value: string | number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  bgColor: string;
  textColor: string;
  borderColor: string;
}