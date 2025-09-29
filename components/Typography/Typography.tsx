import React from "react";
import { Text } from "react-native";

import type { TypographyProps } from "./Typography.types";
import { getFontWeight, variantStyles } from "./typographyData";

const Typography = React.forwardRef<Text, TypographyProps>(
  ({ children, fontWeight, variant, style, ...props }, ref) => {
    const fontWeightClass = getFontWeight(variant, fontWeight);
    const variantClass = variantStyles[variant];

    return (
      <Text
        ref={ref}
        className={`${fontWeightClass} ${variantClass}`}
        style={style}
        {...props}
      >
        {children}
      </Text>
    );
  }
);

Typography.displayName = "Typography";

export default Typography;
