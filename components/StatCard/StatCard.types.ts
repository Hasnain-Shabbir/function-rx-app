import { ComponentType } from "react";

export interface StatCardProps {
  id: number;
  title: string;
  count: number;
  icon: ComponentType<any>;
}
