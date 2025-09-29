import React from "react";
import { Text } from "react-native";

import { cn } from "@/utils/cn";
import type { TypographyProps } from "./Typography.types";
import { getFontWeight, variantStyles } from "./typographyData";

const Typography = React.forwardRef<Text, TypographyProps>(
  ({ children, className, fontWeight, variant, style, ...props }, ref) => {
    const fontWeightClass = getFontWeight(variant, fontWeight);
    const variantClass = variantStyles[variant];

    return (
      <Text
        ref={ref}
        className={cn(fontWeightClass, variantClass, className)}
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
