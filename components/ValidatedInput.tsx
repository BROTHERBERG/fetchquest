import React, { forwardRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TextInputProps,
  Pressable 
} from 'react-native';
import { AlertCircle, Eye, EyeOff, CheckCircle } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface ValidatedInputProps extends Omit<TextInputProps, 'onChangeText' | 'onBlur'> {
  label?: string;
  error?: string;
  errors?: string[];
  hasError?: boolean;
  touched?: boolean;
  isValid?: boolean;
  isValidating?: boolean;
  required?: boolean;
  helpText?: string;
  showValidIcon?: boolean;
  containerStyle?: any;
  labelStyle?: any;
  inputStyle?: any;
  errorStyle?: any;
  onChangeText?: (text: string) => void;
  onBlur?: () => void;
}

export const ValidatedInput = forwardRef<TextInput, ValidatedInputProps>(({
  label,
  error,
  errors = [],
  hasError = false,
  touched = false,
  isValid = true,
  isValidating = false,
  required = false,
  helpText,
  showValidIcon = true,
  containerStyle,
  labelStyle,
  inputStyle,
  errorStyle,
  secureTextEntry,
  onChangeText,
  onBlur,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPasswordField = secureTextEntry;
  const showErrors = touched && hasError && errors.length > 0;
  const showValid = touched && isValid && !isValidating && showValidIcon;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, labelStyle]}>
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
        </View>
      )}
      
      <View style={styles.inputContainer}>
        <TextInput
          ref={ref}
          style={[
            styles.input,
            hasError && touched && styles.inputError,
            isValid && touched && !isValidating && styles.inputValid,
            inputStyle,
          ]}
          secureTextEntry={isPasswordField && !showPassword}
          onChangeText={onChangeText}
          onBlur={onBlur}
          placeholderTextColor={colors.textSecondary}
          {...props}
        />
        
        <View style={styles.iconContainer}>
          {isValidating && (
            <View style={styles.validatingIcon}>
              <Text style={styles.validatingText}>⏳</Text>
            </View>
          )}
          
          {showValid && (
            <CheckCircle size={20} color={colors.success} />
          )}
          
          {showErrors && !isValidating && (
            <AlertCircle size={20} color={colors.error} />
          )}
          
          {isPasswordField && (
            <Pressable onPress={togglePasswordVisibility} style={styles.passwordToggle}>
              {showPassword ? (
                <EyeOff size={20} color={colors.textSecondary} />
              ) : (
                <Eye size={20} color={colors.textSecondary} />
              )}
            </Pressable>
          )}
        </View>
      </View>
      
      {helpText && !showErrors && (
        <Text style={styles.helpText}>{helpText}</Text>
      )}
      
      {showErrors && (
        <View style={styles.errorContainer}>
          {errors.map((errorMsg, index) => (
            <View key={index} style={styles.errorItem}>
              <AlertCircle size={14} color={colors.error} />
              <Text style={[styles.errorText, errorStyle]}>{errorMsg}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
});

ValidatedInput.displayName = 'ValidatedInput';

// Password strength indicator component
interface PasswordStrengthProps {
  password: string;
  strength: 'weak' | 'fair' | 'good' | 'strong';
  score: number;
  strengthColor: string;
}

export function PasswordStrengthIndicator({ 
  password, 
  strength, 
  score, 
  strengthColor 
}: PasswordStrengthProps) {
  if (!password) return null;

  return (
    <View style={styles.strengthContainer}>
      <View style={styles.strengthBar}>
        <View 
          style={[
            styles.strengthFill, 
            { width: `${score}%`, backgroundColor: strengthColor }
          ]} 
        />
      </View>
      <Text style={[styles.strengthText, { color: strengthColor }]}>
        Password strength: {strength.charAt(0).toUpperCase() + strength.slice(1)}
      </Text>
    </View>
  );
}

// Form group component for better organization
interface FormGroupProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  style?: any;
}

export function FormGroup({ children, title, description, style }: FormGroupProps) {
  return (
    <View style={[styles.formGroup, style]}>
      {title && <Text style={styles.groupTitle}>{title}</Text>}
      {description && <Text style={styles.groupDescription}>{description}</Text>}
      {children}
    </View>
  );
}

// Error summary component for forms
interface ErrorSummaryProps {
  errors: Record<string, string[]>;
  touched: Record<string, boolean>;
  title?: string;
}

export function ErrorSummary({ errors, touched, title = 'Please fix the following errors:' }: ErrorSummaryProps) {
  const visibleErrors = Object.entries(errors)
    .filter(([field, fieldErrors]) => touched[field] && fieldErrors.length > 0)
    .flatMap(([field, fieldErrors]) => fieldErrors.map(error => ({ field, error })));

  if (visibleErrors.length === 0) return null;

  return (
    <View style={styles.errorSummary}>
      <View style={styles.errorSummaryHeader}>
        <AlertCircle size={20} color={colors.error} />
        <Text style={styles.errorSummaryTitle}>{title}</Text>
      </View>
      {visibleErrors.map((item, index) => (
        <Text key={index} style={styles.errorSummaryText}>
          • {item.error}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  required: {
    color: colors.error,
  },
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingRight: 40,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.white,
  },
  inputError: {
    borderColor: colors.error,
    backgroundColor: '#fef2f2',
  },
  inputValid: {
    borderColor: colors.success,
  },
  iconContainer: {
    position: 'absolute',
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  validatingIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  validatingText: {
    fontSize: 16,
  },
  passwordToggle: {
    padding: 4,
  },
  helpText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  errorContainer: {
    marginTop: 6,
    gap: 4,
  },
  errorItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    flex: 1,
    lineHeight: 16,
  },
  strengthContainer: {
    marginTop: 8,
  },
  strengthBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  formGroup: {
    marginBottom: 24,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  groupDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  errorSummary: {
    backgroundColor: '#fef2f2',
    borderColor: colors.error,
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  errorSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  errorSummaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.error,
  },
  errorSummaryText: {
    fontSize: 12,
    color: colors.error,
    marginLeft: 4,
    lineHeight: 16,
  },
});