import { useState, useCallback, useEffect } from 'react';
import { 
  ValidationRule, 
  ValidationResult, 
  FieldValidation, 
  validateField, 
  validateForm,
  sanitizeInput 
} from '@/utils/validation';

// Single field validation hook
export function useFieldValidation(
  initialValue: any = '',
  rules: ValidationRule[] = [],
  required = false
) {
  const [value, setValue] = useState(initialValue);
  const [validation, setValidation] = useState<ValidationResult>({ isValid: true, errors: [] });
  const [touched, setTouched] = useState(false);
  const [dirty, setDirty] = useState(false);

  const validate = useCallback(() => {
    const result = validateField(value, rules, required);
    setValidation(result);
    return result;
  }, [value, rules, required]);

  const handleChange = useCallback((newValue: any, shouldValidate = true) => {
    setValue(newValue);
    setDirty(true);
    
    if (shouldValidate && touched) {
      // Validate immediately if field has been touched
      const result = validateField(newValue, rules, required);
      setValidation(result);
    }
  }, [rules, required, touched]);

  const handleBlur = useCallback(() => {
    setTouched(true);
    validate();
  }, [validate]);

  const reset = useCallback(() => {
    setValue(initialValue);
    setValidation({ isValid: true, errors: [] });
    setTouched(false);
    setDirty(false);
  }, [initialValue]);

  const clear = useCallback(() => {
    setValue('');
    setValidation({ isValid: true, errors: [] });
    setTouched(false);
    setDirty(false);
  }, []);

  return {
    value,
    setValue: handleChange,
    validation,
    touched,
    dirty,
    isValid: validation.isValid,
    errors: validation.errors,
    validate,
    handleBlur,
    reset,
    clear,
  };
}

// Form validation hook
export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationSchema: Record<keyof T, { rules: ValidationRule[]; required?: boolean }>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<keyof T, string[]>>({} as Record<keyof T, string[]>);
  const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);

  const validateSingleField = useCallback((fieldName: keyof T, value: any) => {
    const fieldSchema = validationSchema[fieldName];
    if (!fieldSchema) return { isValid: true, errors: [] };

    return validateField(value, fieldSchema.rules, fieldSchema.required);
  }, [validationSchema]);

  const validateAllFields = useCallback(() => {
    const fieldValidations: Record<string, FieldValidation> = {};
    
    for (const [fieldName, value] of Object.entries(values)) {
      const fieldSchema = validationSchema[fieldName as keyof T];
      if (fieldSchema) {
        fieldValidations[fieldName] = {
          value,
          rules: fieldSchema.rules,
          required: fieldSchema.required,
        };
      }
    }

    const results = validateForm(fieldValidations);
    const newErrors: Record<keyof T, string[]> = {} as Record<keyof T, string[]>;
    
    for (const [fieldName, result] of Object.entries(results)) {
      if (fieldName !== 'isFormValid') {
        newErrors[fieldName as keyof T] = (result as ValidationResult).errors;
      }
    }
    
    setErrors(newErrors);
    return results.isFormValid;
  }, [values, validationSchema]);

  const setValue = useCallback((fieldName: keyof T, value: any, shouldValidate = true) => {
    setValues(prev => ({ ...prev, [fieldName]: value }));
    
    if (shouldValidate && (touched[fieldName] || submitCount > 0)) {
      const result = validateSingleField(fieldName, value);
      setErrors(prev => ({ ...prev, [fieldName]: result.errors }));
    }
  }, [validateSingleField, touched, submitCount]);

  const setFieldTouched = useCallback((fieldName: keyof T) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    
    // Validate on first touch
    const result = validateSingleField(fieldName, values[fieldName]);
    setErrors(prev => ({ ...prev, [fieldName]: result.errors }));
  }, [validateSingleField, values]);

  const handleSubmit = useCallback(async (onSubmit: (values: T) => Promise<void> | void) => {
    setSubmitCount(prev => prev + 1);
    setIsSubmitting(true);

    try {
      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce((acc, key) => {
        acc[key as keyof T] = true;
        return acc;
      }, {} as Record<keyof T, boolean>);
      setTouched(allTouched);

      // Validate all fields
      const isValid = validateAllFields();
      
      if (isValid) {
        await onSubmit(values);
      }
      
      return isValid;
    } catch (error) {
      console.error('Form submission error:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validateAllFields]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({} as Record<keyof T, string[]>);
    setTouched({} as Record<keyof T, boolean>);
    setSubmitCount(0);
    setIsSubmitting(false);
  }, [initialValues]);

  const getFieldProps = useCallback((fieldName: keyof T) => ({
    value: values[fieldName],
    onChangeText: (value: any) => setValue(fieldName, value),
    onBlur: () => setFieldTouched(fieldName),
    error: errors[fieldName]?.[0], // Return first error
    errors: errors[fieldName] || [],
    hasError: (errors[fieldName] || []).length > 0,
    touched: touched[fieldName] || false,
  }), [values, errors, touched, setValue, setFieldTouched]);

  const isValid = Object.values(errors).every(fieldErrors => fieldErrors.length === 0);
  const hasErrors = Object.values(errors).some(fieldErrors => fieldErrors.length > 0);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    submitCount,
    isValid,
    hasErrors,
    setValue,
    setFieldTouched,
    validateAllFields,
    handleSubmit,
    reset,
    getFieldProps,
  };
}

// Real-time validation hook with debouncing
export function useRealTimeValidation(
  value: any,
  rules: ValidationRule[],
  required = false,
  debounceMs = 300
) {
  const [validation, setValidation] = useState<ValidationResult>({ isValid: true, errors: [] });
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    setIsValidating(true);
    
    const timeoutId = setTimeout(() => {
      const result = validateField(value, rules, required);
      setValidation(result);
      setIsValidating(false);
    }, debounceMs);

    return () => {
      clearTimeout(timeoutId);
      setIsValidating(false);
    };
  }, [value, rules, required, debounceMs]);

  return {
    validation,
    isValidating,
    isValid: validation.isValid,
    errors: validation.errors,
  };
}

// Sanitized input hook
export function useSanitizedInput(initialValue = '') {
  const [value, setValue] = useState(initialValue);
  const [sanitized, setSanitized] = useState(sanitizeInput(initialValue));

  const handleChange = useCallback((newValue: string) => {
    setValue(newValue);
    setSanitized(sanitizeInput(newValue));
  }, []);

  const reset = useCallback(() => {
    const sanitizedInitial = sanitizeInput(initialValue);
    setValue(initialValue);
    setSanitized(sanitizedInitial);
  }, [initialValue]);

  return {
    value,
    sanitized,
    setValue: handleChange,
    reset,
    isDirty: value !== sanitizeInput(initialValue),
  };
}

// Password validation hook with strength indicator
export function usePasswordValidation(password: string = '') {
  const [strength, setStrength] = useState<'weak' | 'fair' | 'good' | 'strong'>('weak');
  const [score, setScore] = useState(0);

  useEffect(() => {
    let currentScore = 0;
    
    // Length check
    if (password.length >= 8) currentScore += 25;
    if (password.length >= 12) currentScore += 10;
    
    // Character variety checks
    if (/[a-z]/.test(password)) currentScore += 15;
    if (/[A-Z]/.test(password)) currentScore += 15;
    if (/[0-9]/.test(password)) currentScore += 15;
    if (/[^A-Za-z0-9]/.test(password)) currentScore += 20;
    
    setScore(currentScore);
    
    // Determine strength
    if (currentScore < 30) setStrength('weak');
    else if (currentScore < 60) setStrength('fair');
    else if (currentScore < 80) setStrength('good');
    else setStrength('strong');
  }, [password]);

  const strengthColor = {
    weak: '#e74c3c',
    fair: '#f39c12',
    good: '#f1c40f',
    strong: '#27ae60',
  }[strength];

  return {
    strength,
    score,
    strengthColor,
    isStrong: strength === 'strong' || strength === 'good',
  };
}