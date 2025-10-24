import React from "react";
import Svg, { Path } from "react-native-svg";

const Calendar = ({ className = "" }) => {
  return (
    <Svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      <Path
        d="M12 1.3335V2.66683M4 1.3335V2.66683"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7.99717 8.6665H8.00315M7.99717 11.3332H8.00315M10.6608 8.6665H10.6668M5.3335 8.6665H5.33948M5.3335 11.3332H5.33948"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2.3335 5.3335H13.6668"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M1.66699 8.16216C1.66699 5.25729 1.66699 3.80486 2.50174 2.90243C3.33648 2 4.67999 2 7.36699 2H8.63366C11.3207 2 12.6642 2 13.4989 2.90243C14.3337 3.80486 14.3337 5.25729 14.3337 8.16216V8.5045C14.3337 11.4094 14.3337 12.8618 13.4989 13.7642C12.6642 14.6667 11.3207 14.6667 8.63366 14.6667H7.36699C4.67999 14.6667 3.33648 14.6667 2.50174 13.7642C1.66699 12.8618 1.66699 11.4094 1.66699 8.5045V8.16216Z"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2 5.3335H14"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default Calendar;
