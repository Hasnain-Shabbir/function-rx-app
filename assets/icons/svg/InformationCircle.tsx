import React from "react";
import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";

const InformationCircle = () => {
  return (
    <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <G clipPath="url(#clip0_7447_4545)">
        <Path
          d="M14.6663 7.99984C14.6663 4.31794 11.6816 1.33317 7.99967 1.33317C4.31778 1.33317 1.33301 4.31794 1.33301 7.99984C1.33301 11.6817 4.31778 14.6665 7.99967 14.6665C11.6816 14.6665 14.6663 11.6817 14.6663 7.99984Z"
          stroke="white"
          strokeWidth="1.5"
        />
        <Path
          d="M8.1613 11.333V7.99967C8.1613 7.6854 8.1613 7.52827 8.06366 7.43064C7.96603 7.33301 7.8089 7.33301 7.49463 7.33301"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M7.9945 5.33301H8.00049"
          stroke="white"
          stroke-width="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_7447_4545">
          <Rect width="16" height="16" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default InformationCircle;
