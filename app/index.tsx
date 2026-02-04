import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import TextRecognition from "@react-native-ml-kit/text-recognition";

interface Word {
  id: number;
  text: string;
  original: string;
  length: number;
}

export default function Home() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [recognizedText, setRecognizedText] = useState("");
  const [words, setWords] = useState<Word[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission needed", "We need access to your photos.");
      }
    })();
  }, []);

  const takePicture = async () => {
    if (!permission?.granted) {
      const { granted } = await requestPermission();
      if (!granted) {
        Alert.alert("Permission required", "Camera access is needed.");
        return;
      }
    }
    setShowCamera(true);
  };

  const capturePhoto = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.85 });
      setShowCamera(false);
      if (photo?.uri) processImage(photo.uri);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not capture photo.");
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.9,
      });
      if (!result.canceled && result.assets?.[0]?.uri) {
        processImage(result.assets[0].uri);
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Could not pick image.");
    }
  };

  const processImage = async (uri: string) => {
    setSelectedImage(uri);
    setIsProcessing(true);
    setRecognizedText("");
    setWords([]);

    try {
      // Pre-process image (smaller size → faster & better quality in many cases)
      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 1000 } }], // 800–1200 works well for most text
        { compress: 0.75, format: ImageManipulator.SaveFormat.JPEG }
      );

      // ML Kit text recognition
      const result = await TextRecognition.recognize(manipResult.uri);

      // Full extracted text
      const fullText = result.text.trim();
      setRecognizedText(fullText);

      // Extract words (you can also use result.blocks / lines / elements for more precision)
      const extractedWords = fullText
        .split(/\s+/)
        .filter(Boolean)
        .map((w, i) => {
          const clean = w.replace(/[^\w\s]/g, "");
          return {
            id: i,
            text: clean,
            original: w,
            length: clean.length,
          };
        })
        .filter((w) => w.text.length > 0);

      setWords(extractedWords);
    } catch (err: any) {
      console.error("OCR error:", err);
      Alert.alert(
        "Error",
        err?.message || "Failed to recognize text. Try a clearer photo."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const clearResults = () => {
    setSelectedImage(null);
    setRecognizedText("");
    setWords([]);
  };

  const viewWordDetails = (word: Word) => {
    router.push({
      pathname: "/details",
      params: {
        word: word.original,
        wordCount: word.length.toString(),
        position: (word.id + 1).toString(),
        totalWords: words.length.toString(),
      },
    });
  };

  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing="back"
        >
          <View style={styles.cameraControls}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowCamera(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={capturePhoto}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Text Scanner</Text>
          <Text style={styles.subtitle}>
            Capture or pick an image → Extract text offline
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cameraButton]}
            onPress={takePicture}
          >
            <Text style={styles.buttonText}>📸 Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.galleryButton]}
            onPress={pickImage}
          >
            <Text style={styles.buttonText}>🖼️ Pick from Gallery</Text>
          </TouchableOpacity>
        </View>

        {selectedImage && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: selectedImage }} style={styles.image} />
          </View>
        )}

        {isProcessing && (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color="#6366f1" />
            <Text style={styles.processingText}>Recognizing text...</Text>
          </View>
        )}

        {recognizedText && !isProcessing && (
          <View style={styles.textContainer}>
            <Text style={styles.sectionTitle}>Recognized Text</Text>
            <View style={styles.textBox}>
              <Text style={styles.recognizedText}>{recognizedText}</Text>
            </View>
          </View>
        )}

        {words.length > 0 && !isProcessing && (
          <View style={styles.wordsContainer}>
            <View style={styles.wordsHeader}>
              <Text style={styles.sectionTitle}>Words ({words.length})</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Tap for details</Text>
              </View>
            </View>

            {words.map((word) => (
              <TouchableOpacity
                key={word.id}
                style={styles.wordItem}
                onPress={() => viewWordDetails(word)}
              >
                <Text style={styles.wordText}>{word.original}</Text>
                <View style={styles.wordInfo}>
                  <Text style={styles.wordLength}>{word.length} chars</Text>
                  <View style={styles.wordBadge}>
                    <Text style={styles.wordNumber}>#{word.id + 1}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {(selectedImage || recognizedText) && !isProcessing && (
          <TouchableOpacity style={styles.clearButton} onPress={clearResults}>
            <Text style={styles.buttonText}>🗑️ Clear Results</Text>
          </TouchableOpacity>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Extract the text you desire. Do it offline with ease.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

// ────────────────────────────────────────────────
// Styles (slightly enhanced with better spacing & shadows)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  scrollView: { flex: 1 },
  header: {
    backgroundColor: "#6366f1",
    padding: 24,
    paddingTop: Platform.OS === "ios" ? 60 : 44,
    alignItems: "center",
  },
  title: { fontSize: 32, fontWeight: "800", color: "white" },
  subtitle: { fontSize: 16, color: "#e0e7ff", marginTop: 6, opacity: 0.9 },
  buttonContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  cameraButton: { backgroundColor: "#6366f1" },
  galleryButton: { backgroundColor: "#10b981" },
  clearButton: {
    backgroundColor: "#ef4444",
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  buttonText: { color: "white", fontSize: 16, fontWeight: "700" },
  imageContainer: {
    margin: 16,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "white",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  image: { width: "100%", height: 320, resizeMode: "contain" },
  processingContainer: { padding: 40, alignItems: "center" },
  processingText: {
    marginTop: 16,
    fontSize: 18,
    color: "#6366f1",
    fontWeight: "600",
  },
  textContainer: {
    margin: 16,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  textBox: {
    backgroundColor: "#f9fafb",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  recognizedText: { fontSize: 15, color: "#374151", lineHeight: 22 },
  wordsContainer: {
    margin: 16,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    elevation: 3,
  },
  wordsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  badge: {
    backgroundColor: "#e0e7ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  processingText: {
    marginTop: 16,
    fontSize: 18,
    color: "#6366f1",
    fontWeight: "600",
  },
  badgeText: { color: "#4f46e5", fontSize: 13, fontWeight: "600" },
  wordItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
  },
  wordText: { fontSize: 16, fontWeight: "600", color: "#1f2937", flex: 1 },
  wordInfo: { flexDirection: "row", alignItems: "center", gap: 12 },
  wordLength: { fontSize: 13, color: "#6b7280" },
  wordBadge: {
    backgroundColor: "#e0e7ff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  wordNumber: { fontSize: 12, color: "#4f46e5", fontWeight: "700" },
  footer: { padding: 24, alignItems: "center" },
  footerText: { fontSize: 13, color: "#9ca3af" },

  // Camera screen
  cameraContainer: { flex: 1 },
  cameraControls: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    padding: 24,
  },
  cancelButton: {
    backgroundColor: "#ef4444aa",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  captureButton: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#6366f1",
  },
});
