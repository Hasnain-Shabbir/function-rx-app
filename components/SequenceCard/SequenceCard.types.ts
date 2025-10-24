export interface SequenceCardProps {
  title?: string;
  sequenceName?: string;
  date?: string;
  completionCount?: string;
  progress?: number;
  totalProgress?: number;
  status?: string;
  message?: string;
  onStart?: () => void;
}
