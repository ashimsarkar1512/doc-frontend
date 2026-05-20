export interface FilterButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export interface AssessmentCardProps {
  title: string;
  description: string;
  gradient: string;
  image?: string;
}


export interface PaginationButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  isActive?: boolean;
  ariaLabel?: string;
}




