import React from "react";
import Svg, { Path } from "react-native-svg";
import { IconProps } from "../types";

const HomeIcon = ({ color = "#838786", size = 25 }: IconProps) => {
  return (
    <Svg width={size} height={size - 1} viewBox="0 0 25 24" fill="none">
      <Path
        d="M15.75 17C14.9505 17.6224 13.9002 18 12.75 18C11.5998 18 10.5495 17.6224 9.75 17"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      <Path
        d="M3.10139 13.2135C2.74837 10.9162 2.57186 9.76763 3.00617 8.74938C3.44047 7.73112 4.40403 7.03443 6.33114 5.64106L7.77099 4.6C10.1683 2.86667 11.3669 2 12.75 2C14.1331 2 15.3317 2.86667 17.729 4.6L19.1689 5.64106C21.096 7.03443 22.0595 7.73112 22.4938 8.74938C22.9281 9.76763 22.7516 10.9162 22.3986 13.2135L22.0976 15.1724C21.5971 18.4289 21.3469 20.0572 20.179 21.0286C19.0111 22 17.3037 22 13.8888 22H11.6112C8.19633 22 6.48891 22 5.321 21.0286C4.15309 20.0572 3.90287 18.4289 3.40243 15.1724L3.10139 13.2135Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default HomeIcon;
