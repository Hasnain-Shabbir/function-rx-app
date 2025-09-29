export interface IconProps {
  color?: string;
  size?: number;
}

export type IconName = "home" | "analytics" | "motion" | "user";

export const ICON_COLORS = {
  primary: "#5171b1",
  gray: "#838786",
  white: "#ffffff",
} as const;

export const ICON_SIZE = 25;
