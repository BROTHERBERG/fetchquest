import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Pressable, 
  Alert,
  Image,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  Camera, 
  Upload, 
  Shield, 
  CheckCircle, 
  Phone,
  Mail,
  AlertCircle
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { useUserStore } from '@/store/user-store';

export default function VerifyIdentityScreen() {
  const router = useRouter();
  const { user, updateUser } = useUserStore();
  const [verificationMethod, setVerificationMethod] = useState<'id' | 'phone' | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Please log in to verify your identity.</Text>
      </View>
    );
  }
  
  const handleVerifyWithID = () => {
    setVerificationMethod('id');
  };
  
  const handleVerifyWithPhone = () => {
    setVerificationMethod('phone');
  };
  
  const handleUploadID = () => {
    // In a real app, this would open the image picker
    Alert.alert('Upload ID', 'This would open the image picker');
    setStep(2);
  };
  
  const handleTakePhoto = () => {
    // In a real app, this would open the camera
    Alert.alert('Take Photo', 'This would open the camera');
    setStep(2);
  };
  
  const handleSendVerificationCode = () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }
    
    setLoading(true);
    
    // In a real app, this would send a verification code
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      Alert.alert('Verification Code Sent', 'A verification code has been sent to your phone.');
    }, 1000);
  };
  
  const handleVerifyCode = () => {
    if (!verificationCode.trim()) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }
    
    setLoading(true);
    
    // In a real app, this would verify the code
    setTimeout(() => {
      setLoading(false);
      
      // Update user verification status
      updateUser({
        isVerified: true
      });
      
      Alert.alert(
        'Verification Successful',
        'Your identity has been verified. You now have a verified badge on your profile.',
        [
          { 
            text: 'OK', 
            onPress: () => router.back() 
          }
        ]
      );
    }, 1500);
  };
  
  const renderVerificationMethodSelection = () => (
    <View style={styles.methodsContainer}>
      <Text style={styles.sectionTitle}>Select Verification Method</Text>
      
      <Pressable 
        style={[
          styles.methodCard,
          verificationMethod === 'id' && styles.selectedMethodCard
        ]}
        onPress={handleVerifyWithID}
      >
        <Shield size={24} color={colors.primary} />
        <View style={styles.methodInfo}>
          <Text style={styles.methodTitle}>Verify with ID</Text>
          <Text style={styles.methodDescription}>
            Upload a photo of your government-issued ID
          </Text>
        </View>
        <CheckCircle 
          size={20} 
          color={verificationMethod === 'id' ? colors.primary : colors.border} 
          fill={verificationMethod === 'id' ? colors.primaryLight : 'transparent'}
        />
      </Pressable>
      
      <Pressable 
        style={[
          styles.methodCard,
          verificationMethod === 'phone' && styles.selectedMethodCard
        ]}
        onPress={handleVerifyWithPhone}
      >
        <Phone size={24} color={colors.primary} />
        <View style={styles.methodInfo}>
          <Text style={styles.methodTitle}>Verify with Phone</Text>
          <Text style={styles.methodDescription}>
            Receive a verification code via SMS
          </Text>
        </View>
        <CheckCircle 
          size={20} 
          color={verificationMethod === 'phone' ? colors.primary : colors.border} 
          fill={verificationMethod === 'phone' ? colors.primaryLight : 'transparent'}
        />
      </Pressable>
    </View>
  );
  
  const renderIDVerification = () => (
    <View style={styles.idVerificationContainer}>
      {step === 1 ? (
        <>
          <Text style={styles.sectionTitle}>Upload ID Document</Text>
          <Text style={styles.sectionDescription}>
            Please upload a clear photo of your government-issued ID. We accept driver's licenses, passports, and national ID cards.
          </Text>
          
          <View style={styles.uploadOptions}>
            <Pressable 
              style={styles.uploadOption}
              onPress={handleUploadID}
            >
              <View style={styles.uploadIconContainer}>
                <Upload size={24} color={colors.primary} />
              </View>
              <Text style={styles.uploadOptionText}>Upload from Gallery</Text>
            </Pressable>
            
            <Pressable 
              style={styles.uploadOption}
              onPress={handleTakePhoto}
            >
              <View style={styles.uploadIconContainer}>
                <Camera size={24} color={colors.primary} />
              </View>
              <Text style={styles.uploadOptionText}>Take Photo</Text>
            </Pressable>
          </View>
          
          <View style={styles.idExampleContainer}>
            <Text style={styles.idExampleTitle}>Example:</Text>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1575908539614-ff89490f4a78?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZHJpdmVycyUyMGxpY2Vuc2V8ZW58MHx8MHx8fDA%3D' }}
              style={styles.idExample}
              resizeMode="cover"
            />
          </View>
        </>
      ) : (
        <>
          <Text style={styles.sectionTitle}>Review Information</Text>
          <Text style={styles.sectionDescription}>
            We're reviewing your ID. This process typically takes 1-2 business days. You'll receive a notification when your verification is complete.
          </Text>
          
          <View style={styles.statusContainer}>
            <AlertCircle size={24} color={colors.warning} />
            <Text style={styles.statusText}>Verification in progress</Text>
          </View>
          
          <Button
            title="Return to Profile"
            onPress={() => router.back()}
            style={styles.returnButton}
          />
        </>
      )}
    </View>
  );
  
  const renderPhoneVerification = () => (
    <View style={styles.phoneVerificationContainer}>
      {step === 1 ? (
        <>
          <Text style={styles.sectionTitle}>Verify Phone Number</Text>
          <Text style={styles.sectionDescription}>
            Enter your phone number to receive a verification code via SMS.
          </Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="(123) 456-7890"
              placeholderTextColor={colors.textTertiary}
              keyboardType="phone-pad"
            />
          </View>
          
          <Button
            title="Send Verification Code"
            onPress={handleSendVerificationCode}
            loading={loading}
            style={styles.actionButton}
          />
        </>
      ) : (
        <>
          <Text style={styles.sectionTitle}>Enter Verification Code</Text>
          <Text style={styles.sectionDescription}>
            We've sent a verification code to {phoneNumber}. Enter it below to complete verification.
          </Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Verification Code</Text>
            <TextInput
              style={styles.input}
              value={verificationCode}
              onChangeText={setVerificationCode}
              placeholder="123456"
              placeholderTextColor={colors.textTertiary}
              keyboardType="number-pad"
            />
          </View>
          
          <Button
            title="Verify"
            onPress={handleVerifyCode}
            loading={loading}
            style={styles.actionButton}
          />
          
          <Pressable 
            style={styles.resendButton}
            onPress={() => {
              Alert.alert('Resend Code', 'Verification code resent.');
            }}
          >
            <Text style={styles.resendButtonText}>Resend Code</Text>
          </Pressable>
        </>
      )}
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: 'Verify Identity',
          headerLeft: () => (
            <Pressable 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color={colors.text} />
            </Pressable>
          ),
        }}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Shield size={48} color={colors.primary} />
          <Text style={styles.title}>Identity Verification</Text>
          <Text style={styles.subtitle}>
            Verify your identity to build trust with other users and unlock additional features.
          </Text>
        </View>
        
        {!verificationMethod && renderVerificationMethodSelection()}
        {verificationMethod === 'id' && renderIDVerification()}
        {verificationMethod === 'phone' && renderPhoneVerification()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  methodsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 24,
    lineHeight: 20,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedMethodCard: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  methodInfo: {
    flex: 1,
    marginLeft: 16,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  idVerificationContainer: {
    marginBottom: 24,
  },
  uploadOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  uploadOption: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  uploadIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  uploadOptionText: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
  },
  idExampleContainer: {
    marginTop: 16,
  },
  idExampleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  idExample: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: colors.card,
  },
  phoneVerificationContainer: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionButton: {
    marginBottom: 16,
  },
  resendButton: {
    alignItems: 'center',
    padding: 8,
  },
  resendButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondaryLight,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  statusText: {
    fontSize: 16,
    color: colors.warning,
    fontWeight: '500',
    marginLeft: 12,
  },
  returnButton: {
    marginTop: 16,
  },
});