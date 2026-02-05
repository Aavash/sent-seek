import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Details() {
  const params = useLocalSearchParams();
  const word = String(params.word ?? "");
  const wordCount = Number(params.wordCount ?? 0);
  const position = Number(params.position ?? 0);
  const totalWords = Number(params.totalWords ?? 0);

  const vowels = (word.match(/[aeiou]/gi) || []).length;
  const consonants = word.length - vowels;

  const copyWord = async () => {
    await Clipboard.setStringAsync(word);
    alert("Word copied!");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.wordDisplay}>{word}</Text>

        <TouchableOpacity
          onPress={copyWord}
          style={{ alignSelf: "center", marginTop: 8 }}
        >
          <Text style={{ color: "#6366f1", fontWeight: "600" }}>
            📋 Copy word
          </Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Word Information</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Word</Text>
          <Text style={styles.infoValue}>{word}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Characters</Text>
          <Text style={styles.infoValue}>{wordCount}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Position</Text>
          <Text style={styles.infoValue}>
            #{position} of {totalWords}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Vowels</Text>
          <Text style={styles.infoValue}>{vowels}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Consonants</Text>
          <Text style={styles.infoValue}>{consonants}</Text>
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
          Character Breakdown
        </Text>
        <View style={styles.charactersContainer}>
          {word.split("").map((char, i) => (
            <View key={i} style={styles.charBox}>
              <Text style={styles.charText}>{char}</Text>
              <Text style={styles.charIndex}>{i + 1}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  card: {
    backgroundColor: "white",
    margin: 16,
    padding: 24,
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  wordDisplay: {
    fontSize: 56,
    fontWeight: "800",
    color: "#6366f1",
    textAlign: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  infoLabel: { fontSize: 16, color: "#6b7280", fontWeight: "500" },
  infoValue: { fontSize: 16, color: "#1f2937", fontWeight: "700" },
  charactersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 12,
  },
  charBox: {
    backgroundColor: "#e0e7ff",
    width: 54,
    height: 68,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  charText: { fontSize: 28, fontWeight: "bold", color: "#4f46e5" },
  charIndex: { fontSize: 11, color: "#6366f1", marginTop: 4 },
});
