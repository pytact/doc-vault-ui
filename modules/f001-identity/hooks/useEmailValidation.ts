/**
 * Email Validation Business Logic Hook
 * Based on R5 rules
 * Encapsulates email format validation logic
 */

import { useMemo, useCallback } from "react";

interface UseEmailValidationParams {
  email: string;
}

interface UseEmailValidationReturn {
  isValid: boolean;
  error: string | null;
  validateEmail: (email: string) => { isValid: boolean; error: string | null };
}

/**
 * Email validation business logic hook
 * Validates email format (RFC 5322)
 */
export function useEmailValidation(
  params: UseEmailValidationParams
): UseEmailValidationReturn {
  const { email } = params;

  const validateEmail = useCallback(
    (emailValue: string): { isValid: boolean; error: string | null } => {
      if (!emailValue || emailValue.trim().length === 0) {
        return { isValid: false, error: "Email is required." };
      }

      // RFC 5322 basic validation (simplified)
      const emailRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

      if (emailValue.length > 254) {
        return {
          isValid: false,
          error: "Email must be 254 characters or less.",
        };
      }

      if (!emailRegex.test(emailValue)) {
        return { isValid: false, error: "Invalid email format." };
      }

      return { isValid: true, error: null };
    },
    []
  );

  const validation = useMemo(() => {
    return validateEmail(email);
  }, [email, validateEmail]);

  return {
    isValid: validation.isValid,
    error: validation.error,
    validateEmail,
  };
}

