import { useEffect, useState } from 'react';

export const getPasswordStrength = (password: string) => {
  if (password.length < 8) {
    return {
      strength: 'weak',
      message: 'Password is too short',
      color: 'text-danger-500',
    };
  }

  const hasLetters = /[a-zA-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const criteriaMet = [hasLetters, hasNumbers, hasSpecialChar].filter(
    Boolean,
  ).length;

  if (criteriaMet < 2) {
    return {
      strength: 'weak',
      message: 'Password is weak',
      color: 'text-danger-500',
    };
  } else if (criteriaMet < 3) {
    return {
      strength: 'good',
      message: 'Password is good',
      color: 'text-warning-500',
    };
  } else {
    return {
      strength: 'strong',
      message: 'Password is strong',
      color: 'text-success-500',
    };
  }
};

interface UsePasswordValidationProps {
  type?: string;
  value?: string | ReadonlyArray<string> | number;
  showPasswordStrength?: boolean;
  confirmPassword?: string;
  isConfirmPasswordField?: boolean;
}

interface PasswordStrength {
  strength: string;
  message: string;
  color: string;
}

interface UsePasswordValidationReturn {
  passwordStrength: PasswordStrength | null;
  passwordMismatch: boolean;
  shouldShowError: boolean;
  getBorderColor: (isFocused: boolean, isError?: boolean) => string;
}

export const usePasswordValidation = ({
  type,
  value,
  showPasswordStrength = false,
  confirmPassword = '',
  isConfirmPasswordField = false,
}: UsePasswordValidationProps): UsePasswordValidationReturn => {
  const [passwordStrength, setPasswordStrength] =
    useState<PasswordStrength | null>(null);
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  // Check password strength in real-time
  useEffect(() => {
    if (
      type === 'password' &&
      showPasswordStrength &&
      value &&
      typeof value === 'string'
    ) {
      const strength = getPasswordStrength(value);
      setPasswordStrength(strength);
    } else if (type === 'password' && showPasswordStrength && !value) {
      setPasswordStrength(null);
    }
  }, [value, type, showPasswordStrength]);

  // Check password confirmation match
  useEffect(() => {
    if (isConfirmPasswordField && value && confirmPassword) {
      setPasswordMismatch(value !== confirmPassword);
    } else if (isConfirmPasswordField && !value) {
      setPasswordMismatch(false);
    }
  }, [value, confirmPassword, isConfirmPasswordField]);

  // Determine if input should show error state
  const shouldShowError =
    (type === 'password' &&
      showPasswordStrength &&
      passwordStrength?.strength === 'weak') ||
    (isConfirmPasswordField && passwordMismatch);

  // Determine border color based on password strength or error state
  const getBorderColor = (isFocused: boolean, isError?: boolean) => {
    if (isError || shouldShowError) return 'border-danger-500 border-2';
    if (type === 'password' && showPasswordStrength && passwordStrength) {
      if (passwordStrength.strength === 'good')
        return 'border-warning-500 border-2';
      if (passwordStrength.strength === 'strong')
        return 'border-primary-300 border-2';
    }
    if (isFocused) return 'border-primary-300 border-2';
    return '';
  };

  return {
    passwordStrength,
    passwordMismatch,
    shouldShowError,
    getBorderColor,
  };
};
