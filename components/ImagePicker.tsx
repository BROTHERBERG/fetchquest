import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera, ImagePlus, X } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface ImagePickerProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export const TaskImagePicker: React.FC<ImagePickerProps> = ({
  images,
  onImagesChange,
  maxImages = 5,
}) => {
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0].uri) {
      onImagesChange([...images, result.assets[0].uri]);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Sorry, we need camera permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0].uri) {
      onImagesChange([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onImagesChange(newImages);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {images.map((uri, index) => (
          <View key={uri} style={styles.imageContainer}>
            <Image source={{ uri }} style={styles.image} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeImage(index)}
            >
              <X size={16} color="white" />
            </TouchableOpacity>
          </View>
        ))}
        
        {images.length < maxImages && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={pickImage}
            >
              <ImagePlus size={24} color={colors.primary} />
              <Text style={styles.addButtonText}>Gallery</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.addButton}
              onPress={takePhoto}
            >
              <Camera size={24} color={colors.primary} />
              <Text style={styles.addButtonText}>Camera</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      
      <Text style={styles.helper}>
        {images.length}/{maxImages} images added
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  scrollContent: {
    gap: 8,
    paddingHorizontal: 16,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    padding: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  addButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.card,
  },
  addButtonText: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textSecondary,
  },
  helper: {
    marginTop: 4,
    marginLeft: 16,
    fontSize: 12,
    color: colors.textSecondary,
  },
});
