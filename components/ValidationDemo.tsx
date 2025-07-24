import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { ValidatedInput, PasswordStrengthIndicator, FormGroup, ErrorSummary } from './ValidatedInput';
import { useFormValidation, usePasswordValidation } from '@/hooks/useValidation';
import { ValidationPresets, ValidationRules } from '@/utils/validation';
import { colors } from '@/constants/colors';

export function ValidationDemo() {
  const {
    values,
    errors,
    touched,
    isSubmitting,
    hasErrors,
    getFieldProps,
    handleSubmit,
    reset,
  } = useFormValidation(
    {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      taskTitle: '',
      taskDescription: '',
      taskPrice: '',
    },
    {
      email: ValidationPresets.registration.email,
      password: ValidationPresets.registration.password,
      confirmPassword: ValidationPresets.registration.confirmPassword(values.password),
      name: ValidationPresets.registration.name,
      taskTitle: ValidationPresets.taskCreation.title,
      taskDescription: ValidationPresets.taskCreation.description,
      taskPrice: {
        rules: [
          ValidationRules.positiveNumber(),
          ValidationRules.taskPrice(),
        ],
        required: true,
      },
    }
  );

  const passwordStrength = usePasswordValidation(values.password);

  const onSubmit = async (formValues: typeof values) => {
    console.log('Form submitted with values:', formValues);
    Alert.alert('Success!', 'Form validation passed. Check console for values.');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Validation System Demo</Text>
      <Text style={styles.subtitle}>
        This demonstrates comprehensive form validation with real-time feedback
      </Text>

      <ErrorSummary 
        errors={errors} 
        touched={touched} 
        title="Please fix these issues:"
      />

      <FormGroup title="User Registration" description="Basic user information with validation">
        <ValidatedInput
          label="Full Name"
          placeholder="Enter your full name"
          required
          {...getFieldProps('name')}
        />

        <ValidatedInput
          label="Email Address"
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          required
          {...getFieldProps('email')}
        />

        <ValidatedInput
          label="Password"
          placeholder="Enter a strong password"
          secureTextEntry
          required
          helpText="Password must contain uppercase, lowercase, number, and be 8+ characters"
          {...getFieldProps('password')}
        />

        <PasswordStrengthIndicator
          password={values.password}
          strength={passwordStrength.strength}
          score={passwordStrength.score}
          strengthColor={passwordStrength.strengthColor}
        />

        <ValidatedInput
          label="Confirm Password"
          placeholder="Confirm your password"
          secureTextEntry
          required
          {...getFieldProps('confirmPassword')}
        />
      </FormGroup>

      <FormGroup title="Task Creation" description="Create a new task with validation">
        <ValidatedInput
          label="Task Title"
          placeholder="What needs to be done?"
          required
          helpText="Between 3-100 characters, no HTML allowed"
          {...getFieldProps('taskTitle')}
        />

        <ValidatedInput
          label="Task Description"
          placeholder="Describe the task in detail..."
          multiline
          numberOfLines={4}
          required
          helpText="Between 10-500 characters with clear instructions"
          {...getFieldProps('taskDescription')}
        />

        <ValidatedInput
          label="Task Price"
          placeholder="Enter price ($5-$500)"
          keyboardType="numeric"
          required
          helpText="Price must be between $5 and $500"
          {...getFieldProps('taskPrice')}
          onChangeText={(text) => {
            // Parse as number for validation
            const numericValue = parseFloat(text) || 0;
            getFieldProps('taskPrice').onChangeText(numericValue);
          }}
        />
      </FormGroup>

      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.button, styles.resetButton]}
          onPress={reset}
          disabled={isSubmitting}
        >
          <Text style={styles.resetButtonText}>Reset Form</Text>
        </Pressable>

        <Pressable
          style={[
            styles.button, 
            styles.submitButton,
            (hasErrors || isSubmitting) && styles.buttonDisabled
          ]}
          onPress={() => handleSubmit(onSubmit)}
          disabled={hasErrors || isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Validating...' : 'Submit Form'}
          </Text>
        </Pressable>
      </View>

      <View style={styles.validationInfo}>
        <Text style={styles.infoTitle}>Validation Features:</Text>
        <Text style={styles.infoText}>✅ Real-time validation feedback</Text>
        <Text style={styles.infoText}>✅ Password strength indicator</Text>
        <Text style={styles.infoText}>✅ HTML/Script injection prevention</Text>
        <Text style={styles.infoText}>✅ Form-level error summary</Text>
        <Text style={styles.infoText}>✅ Touch-based validation triggers</Text>
        <Text style={styles.infoText}>✅ Custom validation rules</Text>
        <Text style={styles.infoText}>✅ Async form submission handling</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 24,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  submitButton: {
    backgroundColor: colors.primary,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.white,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  validationInfo: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 6,
    lineHeight: 20,
  },
});