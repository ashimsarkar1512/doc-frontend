export interface Consultation {
  id: string;
  code?: string;
  title: string;
  category: string;
  status: 'DRAFT' | 'PENDING' | 'REVIEWED' | 'ACCEPTED' | 'REFIL_REQUESTED' | 'REJECTED';
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

export type TabType = 'DRAFT' | 'PENDING' | 'REVIEWED' | 'ACCEPTED' | 'REFIL_REQUESTED' | 'REJECTED' | 'My Orders';

export interface KpiCardProps {
  value: string | number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  bgColor: string;
  textColor: string;
  borderColor: string;
}