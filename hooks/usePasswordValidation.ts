/**
 * Password Validation Business Logic Hook
 * Based on R5 rules
 * Encapsulates password strength validation logic
 */

import { useMemo, useCallback } from "react";

interface PasswordRules {
  min_length: number;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
  disallow_last_5: boolean;
}

interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  checks: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
  };
}

interface UsePasswordValidationParams {
  password: string;
  rules: PasswordRules;
  previousPasswords?: string[]; // For reuse check (hashed comparison would be done server-side)
}

interface UsePasswordValidationReturn {
  validation: PasswordValidationResult;
  validatePassword: (password: string) => PasswordValidationResult;
  getPasswordStrength: (password: string) => "weak" | "medium" | "strong";
}

/**
 * Password validation business logic hook
 * Validates password against strong password policy
 */
export function usePasswordValidation(
  params: UsePasswordValidationParams
): UsePasswordValidationReturn {
  const { password, rules, previousPasswords = [] } = params;

  const validatePassword = useCallback(
    (pwd: string): PasswordValidationResult => {
      const errors: string[] = [];
      const checks = {
        minLength: pwd.length >= rules.min_length,
        hasUppercase: /[A-Z]/.test(pwd),
        hasLowercase: /[a-z]/.test(pwd),
        hasNumber: /[0-9]/.test(pwd),
        hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
      };

      if (!checks.minLength) {
        errors.push(`Password must be at least ${rules.min_length} characters long.`);
      }
      if (rules.uppercase && !checks.hasUppercase) {
        errors.push("Password must contain at least one uppercase letter.");
      }
      if (rules.lowercase && !checks.hasLowercase) {
        errors.push("Password must contain at least one lowercase letter.");
      }
      if (rules.number && !checks.hasNumber) {
        errors.push("Password must contain at least one number.");
      }
      if (rules.special && !checks.hasSpecial) {
        errors.push("Password must contain at least one special character.");
      }

      // Password reuse check (client-side check - server will do final validation)
      if (rules.disallow_last_5 && previousPasswords.length > 0) {
        // Note: In real implementation, this would compare hashed passwords server-side
        // This is just a placeholder for the client-side check
      }

      return {
        isValid: errors.length === 0,
        errors,
        checks,
      };
    },
    [rules, previousPasswords]
  );

  const validation = useMemo(() => {
    return validatePassword(password);
  }, [password, validatePassword]);

  const getPasswordStrength = useCallback(
    (pwd: string): "weak" | "medium" | "strong" => {
      if (pwd.length < rules.min_length) return "weak";

      let strength = 0;
      if (pwd.length >= rules.min_length) strength++;
      if (/[A-Z]/.test(pwd)) strength++;
      if (/[a-z]/.test(pwd)) strength++;
      if (/[0-9]/.test(pwd)) strength++;
      if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) strength++;

      if (strength <= 2) return "weak";
      if (strength <= 4) return "medium";
      return "strong";
    },
    [rules]
  );

  return {
    validation,
    validatePassword,
    getPasswordStrength,
  };
}

