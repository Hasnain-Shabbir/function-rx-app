import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Alert, Image, TouchableOpacity, View } from "react-native";

interface ImagePickerProps {
  onImageSelected?: (uri: string, file?: any) => void;
  initialImage?: string | null;
  size?: number;
  className?: string;
}

const ImagePickerComponent: React.FC<ImagePickerProps> = ({
  onImageSelected,
  initialImage,
  size = 120,
  className = "",
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(
    initialImage || null
  );

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Sorry, we need camera roll permissions to select an image!"
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const imageUri = result.assets[0].uri;

      // Create file object for upload
      const file = {
        uri: imageUri,
        type: "image/jpeg",
        name: `profile_${Date.now()}.jpg`,
      };

      setSelectedImage(imageUri);
      onImageSelected?.(imageUri, file);
    }
  };

  const showImageOptions = () => {
    Alert.alert("Select Image", "Choose an option", [
      {
        text: "Camera",
        onPress: () => takePhoto(),
      },
      {
        text: "Photo Library",
        onPress: () => pickImage(),
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Sorry, we need camera permissions to take a photo!"
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const imageUri = result.assets[0].uri;

      // Create file object for upload
      const file = {
        uri: imageUri,
        type: "image/jpeg",
        name: `profile_${Date.now()}.jpg`,
      };

      setSelectedImage(imageUri);
      onImageSelected?.(imageUri, file);
    }
  };

  return (
    <View className={`items-center ${className}`}>
      <TouchableOpacity
        onPress={showImageOptions}
        activeOpacity={0.8}
        style={{ width: size, height: size }}
      >
        <View
          className="relative bg-gray-100 rounded-full items-center justify-center"
          style={{ width: size, height: size }}
        >
          {selectedImage ? (
            <Image
              source={{ uri: selectedImage }}
              style={{ width: size, height: size }}
              className="rounded-full"
              resizeMode="cover"
            />
          ) : (
            <Image
              source={require("@/assets/images/user-avatar.png")}
              style={{ width: size, height: size }}
              className="rounded-full"
              resizeMode="cover"
            />
          )}

          {/* Camera Icon Overlay */}
          <View
            className="absolute bottom-0 right-0 bg-white rounded-full border-2 border-gray-300 items-center justify-center"
            style={{
              width: size * 0.3,
              height: size * 0.3,
            }}
          >
            <View
              className="bg-gray-600 rounded-full"
              style={{
                width: size * 0.2,
                height: size * 0.2,
              }}
            >
              {/* Simple camera icon representation */}
              <View
                className="absolute top-1/2 left-1/2 bg-white rounded-full"
                style={{
                  width: size * 0.08,
                  height: size * 0.08,
                  marginTop: -(size * 0.04),
                  marginLeft: -(size * 0.04),
                }}
              />
              <View
                className="absolute top-1/4 left-1/2 bg-white rounded-sm"
                style={{
                  width: size * 0.06,
                  height: size * 0.02,
                  marginTop: -(size * 0.01),
                  marginLeft: -(size * 0.03),
                }}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ImagePickerComponent;
