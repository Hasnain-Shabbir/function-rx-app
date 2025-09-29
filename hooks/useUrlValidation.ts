import { useCallback, useEffect, useState } from 'react';

interface UseUrlValidationProps {
  isUrlField?: boolean;
  urlValidation?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface UseUrlValidationReturn {
  urlError: string;
  hasUrlError: boolean;
  handleUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUrlKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleUrlFocus: (inputRef: React.RefObject<HTMLInputElement>) => void;
  initializeUrlField: () => void;
  isValidUrlFormat: boolean;
}

export const useUrlValidation = ({
  isUrlField = false,
  urlValidation = false,
  value = '',
  onChange,
}: UseUrlValidationProps): UseUrlValidationReturn => {
  const [urlError, setUrlError] = useState<string>('');

  // URL validation helper functions
  const isValidUrl = useCallback((url: string): boolean => {
    try {
      const urlObj = new URL(url);

      // Check if it has a valid protocol
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return false;
      }

      // Check if hostname exists and is not empty
      if (!urlObj.hostname || urlObj.hostname.trim() === '') {
        return false;
      }

      // Check if hostname has at least one dot (for domain.extension format)
      if (!urlObj.hostname.includes('.')) {
        return false;
      }

      // Check if hostname has valid domain format (no consecutive dots, doesn't start/end with dot)
      if (
        urlObj.hostname.includes('..') ||
        urlObj.hostname.startsWith('.') ||
        urlObj.hostname.endsWith('.')
      ) {
        return false;
      }

      // Check if the domain has a valid TLD (at least 2 characters after the last dot)
      const parts = urlObj.hostname.split('.');
      const tld = parts[parts.length - 1];
      if (tld.length < 2) {
        return false;
      }

      // Check if TLD contains only letters (no numbers or special chars)
      if (!/^[a-zA-Z]+$/.test(tld)) {
        return false;
      }

      // Additional check: ensure domain parts are valid
      for (const part of parts) {
        if (part.length === 0) return false;
        // Each part should contain only valid domain characters
        if (!/^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(part)) {
          return false;
        }
      }

      return true;
    } catch {
      return false;
    }
  }, []);

  //   const formatUrlValue = useCallback((inputValue: string): string => {
  //     if (!inputValue) return 'https://';
  //     if (inputValue.startsWith('https://') || inputValue.startsWith('http://')) {
  //       return inputValue;
  //     }
  //     return `https://${inputValue}`;
  //   }, []);

  // Validate URL
  const validateUrl = useCallback(
    (url: string) => {
      if (!urlValidation || !isUrlField) return;

      if (!url || url === 'https://') {
        setUrlError('');
        return;
      }

      if (!isValidUrl(url)) {
        setUrlError('Please enter a valid URL');
      } else {
        setUrlError('');
      }
    },
    [urlValidation, isUrlField, isValidUrl],
  );

  // Handle URL input changes
  const handleUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isUrlField) {
        // If not a URL field, just pass through to original onChange
        if (onChange) {
          onChange(e);
        }
        return;
      }

      const inputValue = e.target.value;
      let newValue = inputValue;

      // Ensure https:// prefix is always present for URL fields
      if (inputValue.length < 8) {
        // If user tries to delete the https:// prefix, restore it
        newValue = 'https://';
      } else if (
        !inputValue.startsWith('https://') &&
        !inputValue.startsWith('http://')
      ) {
        // If user pastes or types without protocol, add https://
        newValue = `https://${inputValue}`;
      }

      // Create new event object with modified value
      const newEvent = {
        ...e,
        target: {
          ...e.target,
          value: newValue,
        },
      };

      // Validate URL if validation is enabled
      if (urlValidation) {
        validateUrl(newValue);
      }

      // Call original onChange if provided
      if (onChange) {
        onChange(newEvent as React.ChangeEvent<HTMLInputElement>);
      }
    },
    [isUrlField, urlValidation, validateUrl, onChange],
  );

  // Handle key events for URL fields
  const handleUrlKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isUrlField) return;

      const input = e.target as HTMLInputElement;
      const selectionStart = input.selectionStart || 0;
      const selectionEnd = input.selectionEnd || 0;

      // Prevent deletion of https:// prefix
      if (
        (e.key === 'Backspace' || e.key === 'Delete') &&
        selectionStart <= 8 &&
        selectionEnd <= 8
      ) {
        e.preventDefault();
        // Move cursor to after https://
        setTimeout(() => {
          input.setSelectionRange(8, 8);
        }, 0);
      }
    },
    [isUrlField],
  );

  // Handle focus for URL fields
  const handleUrlFocus = useCallback(
    (inputRef: React.RefObject<HTMLInputElement>) => {
      if (!isUrlField) return;

      // For URL fields, position cursor after https://
      setTimeout(() => {
        const currentValue = inputRef.current?.value || '';
        if (currentValue === 'https://') {
          inputRef.current?.setSelectionRange(8, 8);
        }
      }, 0);
    },
    [isUrlField],
  );

  // Initialize URL field with https:// if empty
  const initializeUrlField = useCallback(() => {
    if (isUrlField && (!value || value === '')) {
      const newEvent = {
        target: {
          value: 'https://',
        },
      } as React.ChangeEvent<HTMLInputElement>;

      if (onChange) {
        onChange(newEvent);
      }
    }
  }, [isUrlField, value, onChange]);

  // Auto-initialize URL field
  useEffect(() => {
    initializeUrlField();
  }, [initializeUrlField]);

  // Check if current value is a valid URL format
  const isValidUrlFormat =
    !!isUrlField &&
    !!urlValidation &&
    !urlError &&
    !!value &&
    value !== 'https://' &&
    isValidUrl(value);

  return {
    urlError,
    hasUrlError: urlError !== '',
    handleUrlChange,
    handleUrlKeyDown,
    handleUrlFocus,
    initializeUrlField,
    isValidUrlFormat,
  };
};
