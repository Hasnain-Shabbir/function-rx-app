import React from "react";
import Svg, { Path } from "react-native-svg";

interface ChevronLeftProps {
  width?: number;
  height?: number;
  color?: string;
}

const ChevronLeft: React.FC<ChevronLeftProps> = ({
  width = 12,
  height = 20,
  color = "#838786",
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 12 20" fill="none">
      <Path
        d="M10.5 1L2.20711 9.29289C1.87377 9.62623 1.70711 9.79289 1.70711 10C1.70711 10.2071 1.87377 10.3738 2.20711 10.7071L10.5 19"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default ChevronLeft;
