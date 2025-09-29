import { ViewProps } from "react-native";
import type { AvatarSize } from "./avatarData";

export interface AvatarProps extends ViewProps {
  size?: AvatarSize;
  alt?: string;
  src?: string;
  imgStyles?: string;
  type?: "rounded" | "rectangle";
}
