import { Spinner, SpinnerDark } from "@/assets/icons";
import Typography from "@/components/Typography/Typography";
import { cn } from "@/utils/cn";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";
import { Image, TouchableOpacity } from "react-native";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center whitespace-nowrap transition-all duration-300 ease-in-out disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary-500 border-primary-500 active:border-primary-800 border text-white hover:border-gray-800 hover:bg-gray-800 active:border-gray-900 active:bg-gray-900 disabled:border-black disabled:bg-black disabled:opacity-[0.4]",
        outline:
          "border-borderDark hover:border-borderLight border bg-[#ffff] text-gray-700 hover:bg-gray-50 active:border-gray-200 active:bg-gray-200 disabled:opacity-[0.4]",
        link: "text-primary-500 hover:text-primary-700 active:text-black disabled:opacity-[0.4]",
        secondary:
          "border border-gray-100 bg-gray-100 text-black hover:border-gray-200 hover:bg-gray-200 active:border-gray-400 active:bg-gray-400 disabled:opacity-[0.4]",
        danger:
          "bg-danger-50 border-danger-50 text-danger-500 hover:border-danger-100 hover:text-danger-600 active:border-danger-200 hover:bg-danger-100 active:bg-danger-200 active:text-danger-800 border",
        "danger-link":
          "!text-danger-500 hover:!text-danger-600 active:!text-danger-800 disabled:!opacity-[0.4]",
      },
      size: {
        lg: "gap-2 rounded-md px-8 py-4 text-lg font-medium",
        md: "gap-2 rounded-md px-8 py-3 text-base font-medium",
        sm: "gap-2 rounded-sm px-6 py-2 text-sm font-medium",
        xs: "h-[30px] gap-2 rounded-sm px-6 py-2 text-xs font-semibold",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ComponentProps<typeof TouchableOpacity>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLink?: boolean | undefined;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  loading?: boolean;
}

const Button = React.forwardRef<
  React.ElementRef<typeof TouchableOpacity>,
  ButtonProps
>(
  (
    {
      className,
      variant,
      loading = false,
      size,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    // for dynamic size of the spinner
    const spinnerSize = {
      lg: 18,
      md: 16,
      sm: 14,
      xs: 12,
    };

    return (
      <TouchableOpacity
        ref={ref}
        className={cn(
          buttonVariants({ variant, size, className }),
          "items-center",
          loading && "pointer-events-none opacity-[0.4]"
        )}
        disabled={props.disabled || loading}
        onPress={props.onPress}
        {...props}
      >
        {/* in case of the icon button loading */}
        {leftIcon && <>{leftIcon}</>}
        {children && (
          <Typography
            variant="body1"
            className={
              variant === "default"
                ? "text-white"
                : variant === "outline"
                  ? "text-gray-700"
                  : variant === "link"
                    ? "text-primary-500"
                    : variant === "secondary"
                      ? "text-black"
                      : variant === "danger"
                        ? "text-danger-500"
                        : variant === "danger-link"
                          ? "text-danger-500"
                          : "text-white"
            }
          >
            {children}
          </Typography>
        )}
        {loading && (
          <Image
            source={
              variant === "outline" ||
              variant === "link" ||
              variant === "secondary"
                ? SpinnerDark
                : Spinner
            }
            style={{
              width: spinnerSize[size || "md"],
              height: spinnerSize[size || "md"],
            }}
            resizeMode="contain"
          />
        )}
        {!loading && rightIcon && <>{rightIcon}</>}
      </TouchableOpacity>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
