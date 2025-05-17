import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  Bell, 
  Lock, 
  Shield, 
  HelpCircle, 
  FileText, 
  Info,
  LogOut,
  ChevronRight,
  MapPin
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useUserStore } from '@/store/user-store';

export default function SettingsScreen() {
  const router = useRouter();
  const { logout } = useUserStore();
  
  const [notifications, setNotifications] = React.useState(true);
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [locationServices, setLocationServices] = React.useState(true);
  
  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Log Out", 
          onPress: () => {
            logout();
            // In a real app, would navigate to login screen
            router.push('/');
          },
          style: "destructive"
        }
      ]
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: 'Settings',
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
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Bell size={20} color={colors.textSecondary} />
              <Text style={styles.settingText}>Push Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: colors.border, true: colors.primary + '80' }}
              thumbColor={notifications ? colors.primary : colors.textTertiary}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Bell size={20} color={colors.textSecondary} />
              <Text style={styles.settingText}>Email Notifications</Text>
            </View>
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              trackColor={{ false: colors.border, true: colors.primary + '80' }}
              thumbColor={emailNotifications ? colors.primary : colors.textTertiary}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MapPin size={20} color={colors.textSecondary} />
              <Text style={styles.settingText}>Location Services</Text>
            </View>
            <Switch
              value={locationServices}
              onValueChange={setLocationServices}
              trackColor={{ false: colors.border, true: colors.primary + '80' }}
              thumbColor={locationServices ? colors.primary : colors.textTertiary}
            />
          </View>
          
          <Pressable style={styles.menuItem} onPress={() => Alert.alert("Privacy Settings", "This would open privacy settings")}>
            <View style={styles.menuItemContent}>
              <Lock size={20} color={colors.textSecondary} />
              <Text style={styles.menuItemText}>Privacy Settings</Text>
            </View>
            <ChevronRight size={20} color={colors.textTertiary} />
          </Pressable>
          
          <Pressable style={styles.menuItem} onPress={() => Alert.alert("Security", "This would open security settings")}>
            <View style={styles.menuItemContent}>
              <Shield size={20} color={colors.textSecondary} />
              <Text style={styles.menuItemText}>Security</Text>
            </View>
            <ChevronRight size={20} color={colors.textTertiary} />
          </Pressable>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <Pressable style={styles.menuItem} onPress={() => Alert.alert("Help Center", "This would open the help center")}>
            <View style={styles.menuItemContent}>
              <HelpCircle size={20} color={colors.textSecondary} />
              <Text style={styles.menuItemText}>Help Center</Text>
            </View>
            <ChevronRight size={20} color={colors.textTertiary} />
          </Pressable>
          
          <Pressable style={styles.menuItem} onPress={() => Alert.alert("Report a Problem", "This would open the problem reporting form")}>
            <View style={styles.menuItemContent}>
              <Info size={20} color={colors.textSecondary} />
              <Text style={styles.menuItemText}>Report a Problem</Text>
            </View>
            <ChevronRight size={20} color={colors.textTertiary} />
          </Pressable>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          
          <Pressable style={styles.menuItem} onPress={() => Alert.alert("Terms of Service", "This would show the terms of service")}>
            <View style={styles.menuItemContent}>
              <FileText size={20} color={colors.textSecondary} />
              <Text style={styles.menuItemText}>Terms of Service</Text>
            </View>
            <ChevronRight size={20} color={colors.textTertiary} />
          </Pressable>
          
          <Pressable style={styles.menuItem} onPress={() => Alert.alert("Privacy Policy", "This would show the privacy policy")}>
            <View style={styles.menuItemContent}>
              <FileText size={20} color={colors.textSecondary} />
              <Text style={styles.menuItemText}>Privacy Policy</Text>
            </View>
            <ChevronRight size={20} color={colors.textTertiary} />
          </Pressable>
        </View>
        
        <Pressable 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <LogOut size={20} color={colors.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
        
        <Text style={styles.versionText}>Version 1.0.0</Text>
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
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginTop: 24,
    marginHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.error,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
    marginLeft: 8,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textTertiary,
    marginTop: 16,
    marginBottom: 32,
  },
});