import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronDown, ChevronUp, Info, MapPin } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { categories } from '@/constants/categories';

interface MapLegendProps {
  expanded?: boolean;
  onToggle?: () => void;
  onCategoryPress?: (categoryId: string) => void;
  selectedCategories?: string[];
}

export const MapLegend = ({ 
  expanded = false, 
  onToggle,
  onCategoryPress,
  selectedCategories = []
}: MapLegendProps) => {
  return (
    <View style={[styles.container, expanded && styles.containerExpanded]}>
      <TouchableOpacity style={styles.header} onPress={onToggle}>
        <Text style={styles.title}>Map Legend</Text>
        {expanded ? (
          <ChevronUp size={16} color={colors.text} />
        ) : (
          <ChevronDown size={16} color={colors.text} />
        )}
      </TouchableOpacity>
      
      {expanded && (
        <View style={styles.content}>
          <View style={styles.legendSection}>
            <Text style={styles.sectionTitle}>Quest Categories</Text>
            {categories.map(category => (
              <TouchableOpacity 
                key={category.id}
                style={styles.legendItem}
                onPress={() => onCategoryPress?.(category.id)}
                disabled={!onCategoryPress}
              >
                <View 
                  style={[
                    styles.colorIndicator, 
                    { 
                      backgroundColor: category.color,
                      opacity: selectedCategories.includes(category.id) || selectedCategories.length === 0 ? 1 : 0.4
                    }
                  ]} 
                />
                <Text 
                  style={[
                    styles.legendText,
                    selectedCategories.includes(category.id) && styles.selectedText
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.legendSection}>
            <Text style={styles.sectionTitle}>Quest Rarity</Text>
            <View style={styles.legendItem}>
              <View style={[styles.colorIndicator, { backgroundColor: colors.legendary }]} />
              <Text style={styles.legendText}>Legendary (100+ coins)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.colorIndicator, { backgroundColor: colors.epic }]} />
              <Text style={styles.legendText}>Epic (50-99 coins)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.colorIndicator, { backgroundColor: colors.rare || '#0070DD' }]} />
              <Text style={styles.legendText}>Rare (25-49 coins)</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.colorIndicator, { backgroundColor: colors.uncommon || '#1EFF00' }]} />
              <Text style={styles.legendText}>Uncommon (10-24 coins)</Text>
            </View>
          </View>
          
          <View style={styles.legendSection}>
            <Text style={styles.sectionTitle}>Special Indicators</Text>
            <View style={styles.legendItem}>
              <View style={[styles.colorIndicator, { backgroundColor: colors.error }]} />
              <Text style={styles.legendText}>Urgent Quest</Text>
            </View>
          </View>
          
          <View style={styles.footer}>
            <Info size={14} color={colors.textSecondary} />
            <Text style={styles.footerText}>
              Tap on any marker to view quest details
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    bottom: 100,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
    width: 250,
    maxHeight: 300,
  },
  containerExpanded: {
    maxHeight: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  content: {
    padding: 12,
  },
  legendSection: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  legendText: {
    fontSize: 12,
    color: colors.text,
  },
  selectedText: {
    fontWeight: '600',
    color: colors.primary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginLeft: 6,
  },
});