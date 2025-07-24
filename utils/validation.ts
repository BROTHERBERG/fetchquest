export interface ValidationRule<T = any> {
  test: (value: T) => boolean;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface FieldValidation {
  value: any;
  rules: ValidationRule[];
  required?: boolean;
}

// Core validation functions
export function validateField(value: any, rules: ValidationRule[], required = false): ValidationResult {
  const errors: string[] = [];

  // Check required fields
  if (required && (value === null || value === undefined || value === '')) {
    errors.push('This field is required');
    return { isValid: false, errors };
  }

  // Skip validation for empty optional fields
  if (!required && (value === null || value === undefined || value === '')) {
    return { isValid: true, errors: [] };
  }

  // Run validation rules
  for (const rule of rules) {
    if (!rule.test(value)) {
      errors.push(rule.message);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateForm(fields: Record<string, FieldValidation>): Record<string, ValidationResult> & { isFormValid: boolean } {
  const results: Record<string, ValidationResult> = {};
  let isFormValid = true;

  for (const [fieldName, field] of Object.entries(fields)) {
    const result = validateField(field.value, field.rules, field.required);
    results[fieldName] = result;
    
    if (!result.isValid) {
      isFormValid = false;
    }
  }

  return {
    ...results,
    isFormValid,
  };
}

// Common validation rules
export const ValidationRules = {
  // Email validation
  email: (): ValidationRule<string> => ({
    test: (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },
    message: 'Please enter a valid email address',
  }),

  // Password validation
  password: (minLength = 6): ValidationRule<string> => ({
    test: (value: string) => value.length >= minLength,
    message: `Password must be at least ${minLength} characters long`,
  }),

  strongPassword: (): ValidationRule<string> => ({
    test: (value: string) => {
      // At least 8 characters, one uppercase, one lowercase, one number
      const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
      return strongPasswordRegex.test(value);
    },
    message: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number',
  }),

  // Length validation
  minLength: (min: number): ValidationRule<string> => ({
    test: (value: string) => value.length >= min,
    message: `Must be at least ${min} characters long`,
  }),

  maxLength: (max: number): ValidationRule<string> => ({
    test: (value: string) => value.length <= max,
    message: `Must be no more than ${max} characters long`,
  }),

  // Number validation
  minValue: (min: number): ValidationRule<number> => ({
    test: (value: number) => value >= min,
    message: `Must be at least ${min}`,
  }),

  maxValue: (max: number): ValidationRule<number> => ({
    test: (value: number) => value <= max,
    message: `Must be no more than ${max}`,
  }),

  positiveNumber: (): ValidationRule<number> => ({
    test: (value: number) => value > 0,
    message: 'Must be a positive number',
  }),

  integer: (): ValidationRule<number> => ({
    test: (value: number) => Number.isInteger(value),
    message: 'Must be a whole number',
  }),

  // Phone number validation
  phoneNumber: (): ValidationRule<string> => ({
    test: (value: string) => {
      // Simple phone number validation (US format)
      const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
      return phoneRegex.test(value.replace(/\s/g, ''));
    },
    message: 'Please enter a valid phone number',
  }),

  // URL validation
  url: (): ValidationRule<string> => ({
    test: (value: string) => {
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    message: 'Please enter a valid URL',
  }),

  // Date validation
  futureDate: (): ValidationRule<Date> => ({
    test: (value: Date) => value > new Date(),
    message: 'Date must be in the future',
  }),

  pastDate: (): ValidationRule<Date> => ({
    test: (value: Date) => value < new Date(),
    message: 'Date must be in the past',
  }),

  // Custom validation for FetchQuest specific fields
  taskPrice: (): ValidationRule<number> => ({
    test: (value: number) => value >= 5 && value <= 500,
    message: 'Task price must be between $5 and $500',
  }),

  taskTitle: (): ValidationRule<string> => ({
    test: (value: string) => value.trim().length >= 3 && value.trim().length <= 100,
    message: 'Task title must be between 3 and 100 characters',
  }),

  taskDescription: (): ValidationRule<string> => ({
    test: (value: string) => value.trim().length >= 10 && value.trim().length <= 500,
    message: 'Task description must be between 10 and 500 characters',
  }),

  // Location validation
  coordinate: (): ValidationRule<number> => ({
    test: (value: number) => !isNaN(value) && isFinite(value),
    message: 'Invalid coordinate',
  }),

  latitude: (): ValidationRule<number> => ({
    test: (value: number) => value >= -90 && value <= 90,
    message: 'Latitude must be between -90 and 90',
  }),

  longitude: (): ValidationRule<number> => ({
    test: (value: number) => value >= -180 && value <= 180,
    message: 'Longitude must be between -180 and 180',
  }),

  // File validation
  imageFile: (): ValidationRule<string> => ({
    test: (value: string) => {
      const imageExtensions = /\.(jpg|jpeg|png|gif|webp)$/i;
      return imageExtensions.test(value);
    },
    message: 'Please select a valid image file (JPG, PNG, GIF, WebP)',
  }),

  fileSize: (maxSizeMB: number): ValidationRule<number> => ({
    test: (sizeInBytes: number) => sizeInBytes <= maxSizeMB * 1024 * 1024,
    message: `File size must be less than ${maxSizeMB}MB`,
  }),

  // Array validation
  nonEmptyArray: (): ValidationRule<any[]> => ({
    test: (value: any[]) => Array.isArray(value) && value.length > 0,
    message: 'At least one item must be selected',
  }),

  maxArrayLength: (max: number): ValidationRule<any[]> => ({
    test: (value: any[]) => Array.isArray(value) && value.length <= max,
    message: `No more than ${max} items allowed`,
  }),

  // Sanitization helpers
  noHtml: (): ValidationRule<string> => ({
    test: (value: string) => !/<[^>]*>/g.test(value),
    message: 'HTML tags are not allowed',
  }),

  noScript: (): ValidationRule<string> => ({
    test: (value: string) => !/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(value),
    message: 'Script tags are not allowed',
  }),
};

// Validation presets for common forms
export const ValidationPresets = {
  registration: {
    email: {
      rules: [ValidationRules.email()],
      required: true,
    },
    password: {
      rules: [ValidationRules.strongPassword()],
      required: true,
    },
    confirmPassword: (password: string) => ({
      rules: [{
        test: (value: string) => value === password,
        message: 'Passwords do not match',
      }],
      required: true,
    }),
    name: {
      rules: [ValidationRules.minLength(2), ValidationRules.maxLength(50)],
      required: true,
    },
  },

  login: {
    email: {
      rules: [ValidationRules.email()],
      required: true,
    },
    password: {
      rules: [ValidationRules.minLength(1)],
      required: true,
    },
  },

  taskCreation: {
    title: {
      rules: [ValidationRules.taskTitle(), ValidationRules.noHtml()],
      required: true,
    },
    description: {
      rules: [ValidationRules.taskDescription(), ValidationRules.noHtml()],
      required: true,
    },
    price: {
      rules: [ValidationRules.taskPrice(), ValidationRules.positiveNumber()],
      required: true,
    },
    category: {
      rules: [ValidationRules.minLength(1)],
      required: true,
    },
    dueDate: {
      rules: [ValidationRules.futureDate()],
      required: false,
    },
  },

  profile: {
    name: {
      rules: [ValidationRules.minLength(2), ValidationRules.maxLength(50), ValidationRules.noHtml()],
      required: true,
    },
    bio: {
      rules: [ValidationRules.maxLength(500), ValidationRules.noHtml()],
      required: false,
    },
    phone: {
      rules: [ValidationRules.phoneNumber()],
      required: false,
    },
  },
};

// Sanitization utilities
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/on\w+="[^"]*"/gi, ''); // Remove event handlers
}

export function sanitizeHtml(input: string): string {
  // Basic HTML sanitization - in production, use a library like DOMPurify
  const allowedTags = ['b', 'i', 'u', 'em', 'strong', 'p', 'br'];
  const tagRegex = /<(\/?)([\w]+)[^>]*>/g;
  
  return input.replace(tagRegex, (match, closing, tagName) => {
    if (allowedTags.includes(tagName.toLowerCase())) {
      return `<${closing}${tagName}>`;
    }
    return '';
  });
}