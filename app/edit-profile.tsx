import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { ArrowLeft, Camera, User, MapPin, Phone, Mail, FileText } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { useUserStore } from '@/store/user-store';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateUser } = useUserStore();
  const [loading, setLoading] = useState(false);
  
  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Please log in to edit your profile.</Text>
      </View>
    );
  }
  
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || '');
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || '');
  const [address, setAddress] = useState(user.address || '');
  
  const handleSave = () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert("Error", "Name and email are required");
      return;
    }
    
    setLoading(true);
    
    // In a real app, would make an API call here
    setTimeout(() => {
      updateUser({
        name: name.trim(),
        bio: bio.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
      });
      
      setLoading(false);
      
      Alert.alert(
        "Profile Updated",
        "Your profile has been successfully updated.",
        [
          { 
            text: "OK", 
            onPress: () => router.back() 
          }
        ]
      );
    }, 1000);
  };
  
  const handleChangePhoto = () => {
    // In a real app, would open image picker
    Alert.alert("Change Photo", "This would open the image picker");
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: 'Edit Profile',
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
      
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: user.avatar }}
              style={styles.avatar}
            />
            <Pressable 
              style={styles.changePhotoButton}
              onPress={handleChangePhoto}
            >
              <Camera size={20} color="white" />
            </Pressable>
          </View>
          
          <View style={styles.formGroup}>
            <View style={styles.labelContainer}>
              <User size={18} color={colors.textSecondary} />
              <Text style={styles.label}>Name</Text>
            </View>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor={colors.textTertiary}
            />
          </View>
          
          <View style={styles.formGroup}>
            <View style={styles.labelContainer}>
              <FileText size={18} color={colors.textSecondary} />
              <Text style={styles.label}>Bio</Text>
            </View>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell others about yourself..."
              placeholderTextColor={colors.textTertiary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
          
          <View style={styles.formGroup}>
            <View style={styles.labelContainer}>
              <Mail size={18} color={colors.textSecondary} />
              <Text style={styles.label}>Email</Text>
            </View>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Your email address"
              placeholderTextColor={colors.textTertiary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          <View style={styles.formGroup}>
            <View style={styles.labelContainer}>
              <Phone size={18} color={colors.textSecondary} />
              <Text style={styles.label}>Phone</Text>
            </View>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Your phone number"
              placeholderTextColor={colors.textTertiary}
              keyboardType="phone-pad"
            />
          </View>
          
          <View style={styles.formGroup}>
            <View style={styles.labelContainer}>
              <MapPin size={18} color={colors.textSecondary} />
              <Text style={styles.label}>Address</Text>
            </View>
            <TextInput
              style={styles.input}
              value={address}
              onChangeText={setAddress}
              placeholder="Your address"
              placeholderTextColor={colors.textTertiary}
            />
          </View>
        </ScrollView>
        
        <View style={styles.footer}>
          <Button
            title="Save Changes"
            onPress={handleSave}
            fullWidth
            loading={loading}
          />
        </View>
      </KeyboardAvoidingView>
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
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  changePhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  formGroup: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
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
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
});