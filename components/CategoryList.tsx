import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/styles/typography';

type Category = {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
};

type CategoryListProps = {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string) => void;
  hideLabels?: boolean;
};

export const CategoryList = ({ 
  categories,
  selectedCategory, 
  onSelectCategory,
  hideLabels = false 
}: CategoryListProps) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((category) => {
        const isSelected = selectedCategory === category.id;
        const Icon = category.icon;
        
        return (
          <TouchableOpacity
            key={category.id}
            style={[styles.category, isSelected && styles.selectedCategory]}
            onPress={() => onSelectCategory(category.id)}
          >
            <View style={[styles.iconContainer, { backgroundColor: category.color + '20' }]}>
              <Icon size={20} color={category.color} />
            </View>
            
            {!hideLabels && (
              <Text 
                style={[styles.categoryText, isSelected && styles.selectedCategoryText]}
                numberOfLines={1}
              >
                {category.name}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 12,
  },
  category: {
    alignItems: 'center',
    gap: 4,
  },
  selectedCategory: {
    opacity: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    ...typography.caption,
    color: colors.textSecondary,
    maxWidth: 80,
    textAlign: 'center',
  },
  selectedCategoryText: {
    color: colors.text,
    fontWeight: '600',
  },
});
