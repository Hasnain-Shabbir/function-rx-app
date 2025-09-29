import React from "react";
import Svg, { Path } from "react-native-svg";
import { IconProps } from "../types";

const CheckmarkCircle = ({ color = "#5171b1", size = 24 }: IconProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z"
        stroke={color}
        strokeWidth="1.5"
      />
      <Path
        d="M8 12.5L10.5 15L16 9"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default CheckmarkCircle;
