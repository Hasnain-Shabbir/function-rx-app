export interface SequenceCardProps {
  title?: string;
  date?: string;
  completionCount?: string;
  tag?: "completed" | "in-progress" | "todo";
}
