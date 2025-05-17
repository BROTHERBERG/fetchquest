import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera, X } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface TaskImagePickerProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export const TaskImagePicker = ({
  images,
  onImagesChange,
  maxImages = 4,
}: TaskImagePickerProps) => {
  const pickImage = async () => {
    if (images.length >= maxImages) {
      return;
    }

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
    if (images.length >= maxImages) {
      return;
    }

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
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.imageList}>
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
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionButton, { marginRight: 8 }]}
                onPress={takePhoto}
              >
                <Camera size={24} color={colors.primary} />
                <Text style={styles.actionText}>Take Photo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.actionButton}
                onPress={pickImage}
              >
                <Camera size={24} color={colors.primary} />
                <Text style={styles.actionText}>Upload</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
      
      <Text style={styles.helperText}>
        {images.length} of {maxImages} photos added
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  imageList: {
    flexDirection: 'row',
    padding: 4,
  },
  imageContainer: {
    position: 'relative',
    marginRight: 8,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    padding: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 100,
    height: 100,
    backgroundColor: colors.card,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  actionText: {
    fontSize: 12,
    color: colors.primary,
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
});
