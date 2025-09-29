import { cn } from "@/utils/cn";
import React, { type FC, useEffect, useRef, useState } from "react";
import { TextInput, View } from "react-native";

interface InputOTPProps {
  slots?: number;
  onChange?: (value: string) => void;
  className?: string;
  required?: boolean;
}

const InputOTP: FC<InputOTPProps> = ({
  slots = 4,
  onChange,
  className,
  required,
}) => {
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [inputValues, setInputValues] = useState<string[]>(
    new Array(slots).fill("")
  );

  // Helper function to update values and trigger onChange
  const updateValues = (newValues: string[]) => {
    setInputValues(newValues);
    onChange?.(newValues.join(""));
  };

  // Handle input change for each slot
  const handleChange = (text: string, index: number) => {
    if (/^[0-9]?$/.test(text)) {
      const newValues = [...inputValues];
      newValues[index] = text;
      updateValues(newValues);

      // Move focus to the next input if available
      if (text && index < slots - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  // Handle paste event
  const handlePaste = (text: string, index: number) => {
    const digits = text.replace(/\D/g, ""); // Remove non-digits

    if (digits.length === 0) return;

    const newValues = [...inputValues];

    // Fill the slots starting from the current index
    for (let i = 0; i < digits.length && index + i < slots; i++) {
      newValues[index + i] = digits[i];
    }

    updateValues(newValues);

    // Focus on the next empty slot or the last filled slot
    const nextFocusIndex = Math.min(index + digits.length, slots - 1);
    inputRefs.current[nextFocusIndex]?.focus();
  };

  // Handle Backspace key to move focus back
  const handleKeyPress = (event: any, index: number) => {
    if (
      event.nativeEvent.key === "Backspace" &&
      !inputValues[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Ensure focus starts at the first slot
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <View
      className={cn("flex flex-row gap-2 justify-center space-x-4", className)}
    >
      {inputValues.map((_, index) => (
        <TextInput
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          value={inputValues[index]}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(event) => handleKeyPress(event, index)}
          keyboardType="numeric"
          maxLength={1}
          style={{
            height: 44,
            width: 44,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#d1d5db",
            textAlign: "center",
            fontSize: 18,
            fontWeight: "600",
          }}
        />
      ))}
    </View>
  );
};

export default InputOTP;
