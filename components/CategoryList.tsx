import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/styles/typography';
import { LucideIcon } from 'lucide-react-native';

type Category = {
  id: string;
  name: string;
  color: string;
  icon?: React.ComponentType<any> | React.ReactNode;
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
  // Function to safely render the icon
  const renderIcon = (category: Category) => {
    if (!category.icon) {
      // If no icon, just show the color circle
      return <View style={[styles.colorCircle, { backgroundColor: category.color }]} />;
    }
    
    try {
      // If the icon is a component type (like from lucide-react)
      if (typeof category.icon === 'function') {
        const IconComponent = category.icon as React.ComponentType<any>;
        return (
          <IconComponent 
            size={24} 
            color={category.color} 
            style={styles.iconStyle}
          />
        );
      }
      
      // If it's a React element, just return it
      return category.icon;
    } catch (error) {
      // Fallback if rendering fails
      console.warn('Error rendering icon:', error);
      return <View style={[styles.colorCircle, { backgroundColor: category.color }]} />;
    }
  };

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((category) => {
        const isSelected = selectedCategory === category.id;
        
        return (
          <TouchableOpacity
            key={category.id}
            style={[styles.category, isSelected && styles.selectedCategory]}
            onPress={() => onSelectCategory(category.id)}
          >
            <View style={[styles.iconContainer, { backgroundColor: category.color + '20' }]}>
              {renderIcon(category)}
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
  colorCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  iconStyle: {
    width: 24,
    height: 24,
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
