import React from 'react';
import { View, TextInput, StyleSheet, Pressable, Platform } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  style?: any;
}

export const SearchBar = ({
  value,
  onChangeText,
  placeholder = 'Search tasks...',
  onSubmit,
  style,
}: SearchBarProps) => {
  const handleClear = () => {
    onChangeText('');
  };
  
  return (
    <View style={[styles.container, style]}>
      <View style={styles.searchIcon}>
        <Search size={18} color={colors.textSecondary} />
      </View>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        clearButtonMode="never"
      />
      {value.length > 0 && (
        <Pressable style={styles.clearButton} onPress={handleClear}>
          <X size={16} color={colors.textSecondary} />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: colors.text,
    paddingVertical: 8,
  },
  clearButton: {
    padding: 4,
  },
});