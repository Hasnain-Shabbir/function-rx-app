import { PasswordHidden, PasswordShow } from "@/assets/icons";
import { usePasswordValidation } from "@/hooks/usePasswordValidation";
import { useUrlValidation } from "@/hooks/useUrlValidation";
import { cn } from "@/utils/cn";

// Import the URL validation hook

import { cva } from "class-variance-authority";
import { type JSX, useEffect, useRef, useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

export interface InputProps extends React.ComponentProps<typeof TextInput> {
  variant?: "default";
  inputSize?: "md" | "sm" | "lg" | "xs";
  passwordWithIcon?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  label?: string;
  labelStyles?: string;
  min?: number;
  isError?: boolean;
  leftIconStyles?: string;
  rightIconStyles?: string;
  errorMessage?: string;
  renderEmailChange?: () => JSX.Element;
  parentStyles?: string;
  addAsterisk?: boolean;
  focusInput?: boolean;
  setFocusInputFalse?: () => void;
  // Password validation props
  showPasswordStrength?: boolean;
  confirmPassword?: string;
  isConfirmPasswordField?: boolean;
  // URL validation props
  isUrlField?: boolean;
  urlValidation?: boolean;
  rightLabelElement?: JSX.Element;
  setUrlError?: (error: boolean) => void;
  // Web-specific props that need to be handled
  name?: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  onKeyDown?: (e: any) => void;
  onChange?: (e: any) => void;
}

const labelSize = {
  lg: "text-base leading-[20px] font-medium",
  sm: "text-sm font-medium  leading-[20px]",
  md: "text-sm font-medium  leading-[20px]",
  xs: "text-xs font-medium leading-[14px]",
};

const inputVariants = cva(
  "border-borderDark flex w-full border bg-[#ffff] px-[12px]",
  {
    variants: {
      variant: {
        default: "",
      },
      inputSize: {
        lg: "h-[52px] rounded-md text-lg leading-[20px] font-normal",
        md: "h-[44px] rounded-md text-base font-normal",
        xs: "h-[30px] rounded-sm text-xs leading-[12px] font-normal",
        sm: "h-[36px] rounded-sm text-sm leading-[18px] font-normal",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "md",
    },
  }
);

const Input = ({
  className,
  name,
  type,
  variant,
  inputSize,
  passwordWithIcon,
  leftIcon,
  rightIcon,
  label,
  labelStyles,
  renderEmailChange,
  min,
  disabled,
  isError,
  errorMessage,
  addAsterisk,
  required,
  focusInput = false,
  setFocusInputFalse = () => {},
  parentStyles = "",
  rightIconStyles = "h-[20px] w-[20px] ml-2",
  leftIconStyles = "h-[20px] w-[20px] mr-2",
  rightLabelElement = <></>,
  // Password validation props
  showPasswordStrength = false,
  confirmPassword = "",
  isConfirmPasswordField = false,
  // URL validation props
  isUrlField = false,
  urlValidation = false,
  value,
  onChange,
  onKeyDown,
  ...props
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const showAsterisk = required && addAsterisk && !label?.includes("*");
  const [showToggleIcon] = useState(type === "password" && passwordWithIcon);
  const [passwordVisible, setPasswordVisibility] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const {
    urlError,
    hasUrlError,
    handleUrlChange,
    handleUrlKeyDown,
    handleUrlFocus,
  } = useUrlValidation({
    isUrlField,
    urlValidation,
    value: value as string,
    onChange,
  });

  const { passwordStrength, passwordMismatch, getBorderColor } =
    usePasswordValidation({
      type,
      value,
      showPasswordStrength,
      confirmPassword,
      isConfirmPasswordField,
    });
  // Handle input changes - use URL handler if URL field, otherwise use original onChange
  const handleInputChange = (text: string) => {
    if (isUrlField && handleUrlChange) {
      // Create a mock event for URL validation
      const mockEvent = { target: { value: text } } as any;
      handleUrlChange(mockEvent);
    } else if (onChange) {
      // Create a mock event for onChange
      const mockEvent = { target: { value: text } } as any;
      onChange(mockEvent);
    }
  };

  // Handle key down events - combine URL handler with original onKeyDown
  const handleKeyDown = (e: any) => {
    // Handle URL-specific key events if it's a URL field
    if (isUrlField) {
      handleUrlKeyDown(e);
    }

    // Call original onKeyDown if provided
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  const handleDivClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    // Handle URL-specific focus behavior
    if (isUrlField) {
      handleUrlFocus(inputRef as any);
    }
  };

  useEffect(() => {
    if (focusInput) {
      if (inputRef.current) {
        inputRef.current.focus();
        // Handle URL-specific focus behavior
        if (isUrlField) {
          handleUrlFocus(inputRef as any);
        }
      }
      setFocusInputFalse();
    }
    return () => {
      setFocusInputFalse();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusInput]);

  // Determine if there's an error (original error, password error, or URL error)
  const hasError = isError || hasUrlError;
  const displayErrorMessage = errorMessage || urlError;

  return (
    <TouchableOpacity
      className={cn(
        "relative flex flex-col gap-2",
        disabled && "cursor-not-allowed",
        parentStyles
      )}
      onPress={handleDivClick}
      activeOpacity={1}
    >
      {label && (
        <Text className={cn(labelSize[inputSize || "md"], labelStyles)}>
          {label}
          {rightLabelElement}
          {showAsterisk && (
            <Text className="text-danger-500 font-medium">*</Text>
          )}
        </Text>
      )}
      <View
        className={cn(
          "flex",
          inputVariants({ variant, inputSize }),
          getBorderColor(isFocused, hasError),

          isFocused ? "border-primary-300 border-2" : "",
          showToggleIcon ? "justify-between" : "justify-start",
          isError && "border-danger-400 border-2",
          disabled && "bg-gray-50",
          type === "date" ? "py-[7px]" : "",
          className
        )}
      >
        {leftIcon && (
          <Image
            className={cn(leftIconStyles, disabled && "opacity-30")}
            source={{ uri: leftIcon }}
          />
        )}
        <TextInput
          ref={inputRef}
          secureTextEntry={
            showToggleIcon ? !passwordVisible : type === "password"
          }
          editable={!disabled}
          value={value}
          onChangeText={handleInputChange}
          onKeyPress={handleKeyDown}
          style={{
            flex: 1,
            height: "100%",
            paddingVertical: 8,
            fontSize: 16,
            color: "#000000",
            backgroundColor: "transparent",
            textAlign: "left",
          }}
          onFocus={handleFocus}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {showToggleIcon && (
          <TouchableOpacity
            onPress={() => setPasswordVisibility((prev) => !prev)}
            className={cn(rightIconStyles, disabled && "opacity-30")}
          >
            <Image
              source={passwordVisible ? PasswordShow : PasswordHidden}
              className="h-[20px] w-[20px]"
            />
          </TouchableOpacity>
        )}
        {rightIcon && (
          <Image
            className={cn(rightIconStyles, disabled && "opacity-30")}
            source={{ uri: rightIcon }}
          />
        )}
        {renderEmailChange && renderEmailChange()}
      </View>

      {type === "password" && showPasswordStrength && passwordStrength && (
        <View className="mt-1">
          <Text className={cn("text-xs", passwordStrength.color)}>
            {passwordStrength.message}
          </Text>
        </View>
      )}
      {/* Password mismatch error */}
      {isConfirmPasswordField && passwordMismatch && (
        <View className="mt-1">
          <Text className="text-danger-500 text-xs">
            Passwords do not match
          </Text>
        </View>
      )}

      {/* {isValidUrlFormat && (
          <div className="mt-1">
            <p className="text-xs text-green-600">Valid URL format</p>
          </div>
        )} */}
      {/* Error messages (original, password, or URL errors) */}
      {hasError && displayErrorMessage && (
        <View className="">
          <View className="flex items-start gap-1">
            {/* <img src={InformationRed} /> */}
            <Text className="text-danger-400 text-xs">
              {displayErrorMessage}
            </Text>
          </View>
        </View>
      )}

      {/* {isError && errorMessage && (
        <div className="flex items-center gap-1">
          <p className="text-danger-400 text-xs">{errorMessage}</p>
        </div>
      )} */}
    </TouchableOpacity>
  );
};

Input.displayName = "Input";

export { Input, inputVariants, labelSize };
