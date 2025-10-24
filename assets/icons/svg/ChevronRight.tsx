import React from "react";
import Svg, { Path } from "react-native-svg";

const ChevronRight = ({ size = 16, color = "#838786" }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M6 12L9.29289 8.70711C9.62623 8.37377 9.79289 8.20711 9.79289 8C9.79289 7.79289 9.62623 7.62623 9.29289 7.29289L6 4"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default ChevronRight;
