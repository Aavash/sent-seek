// app/settings.tsx
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type WordGroup = {
  id: string;
  name: string;
  icon: string;
  color: string;
  words: string[];
  isEnabled: boolean;
  isCustom: boolean;
};

export default function SettingsScreen() {
  const [wordGroups, setWordGroups] = useState<WordGroup[]>([
    {
      id: "1",
      name: "Allergens",
      icon: "warning",
      color: "#F44336",
      words: [
        "peanut",
        "tree nut",
        "milk",
        "egg",
        "soy",
        "wheat",
        "shellfish",
        "fish",
        "sesame",
      ],
      isEnabled: true,
      isCustom: false,
    },
    {
      id: "2",
      name: "Preservatives",
      icon: "science",
      color: "#9C27B0",
      words: [
        "BHT",
        "BHA",
        "sodium benzoate",
        "potassium sorbate",
        "sodium nitrate",
        "sodium nitrite",
        "sulfites",
      ],
      isEnabled: true,
      isCustom: false,
    },
    {
      id: "3",
      name: "Artificial Colors",
      icon: "palette",
      color: "#E91E63",
      words: [
        "red 40",
        "yellow 5",
        "yellow 6",
        "blue 1",
        "blue 2",
        "green 3",
        "caramel color",
      ],
      isEnabled: true,
      isCustom: false,
    },
    {
      id: "4",
      name: "Sweeteners",
      icon: "cake",
      color: "#FF9800",
      words: [
        "aspartame",
        "sucralose",
        "saccharin",
        "high fructose corn syrup",
        "stevia",
        "monk fruit",
        "erythritol",
      ],
      isEnabled: true,
      isCustom: false,
    },
    {
      id: "5",
      name: "Additives",
      icon: "add-circle",
      color: "#2196F3",
      words: [
        "MSG",
        "xanthan gum",
        "guar gum",
        "carrageenan",
        "lecithin",
        "maltodextrin",
      ],
      isEnabled: true,
      isCustom: false,
    },
    {
      id: "6",
      name: "Fats & Oils",
      icon: "water-drop",
      color: "#4CAF50",
      words: [
        "palm oil",
        "hydrogenated oil",
        "partially hydrogenated oil",
        "trans fat",
        "coconut oil",
        "canola oil",
      ],
      isEnabled: true,
      isCustom: false,
    },
  ]);

  const [customGroupName, setCustomGroupName] = useState("");
  const [customWords, setCustomWords] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<WordGroup | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [wordInput, setWordInput] = useState("");

  const toggleGroup = (id: string) => {
    setWordGroups((groups) =>
      groups.map((group) =>
        group.id === id ? { ...group, isEnabled: !group.isEnabled } : group,
      ),
    );
  };

  const handleAddGroup = () => {
    if (!customGroupName.trim() || !customWords.trim()) {
      Alert.alert("Error", "Please enter both group name and words");
      return;
    }

    const newGroup: WordGroup = {
      id: `custom-${Date.now()}`,
      name: customGroupName.trim(),
      icon: "add-circle",
      color: "#607D8B",
      words: customWords
        .split(",")
        .map((word) => word.trim())
        .filter((word) => word.length > 0),
      isEnabled: true,
      isCustom: true,
    };

    setWordGroups([...wordGroups, newGroup]);
    setCustomGroupName("");
    setCustomWords("");
    setAddModalVisible(false);
    Alert.alert("Success", "Custom group added successfully!");
  };

  const handleDeleteGroup = (id: string) => {
    Alert.alert("Delete Group", "Are you sure you want to delete this group?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setWordGroups((groups) => groups.filter((group) => group.id !== id));
          if (selectedGroup?.id === id) {
            setSelectedGroup(null);
            setModalVisible(false);
          }
        },
      },
    ]);
  };

  const handleAddWordToGroup = (groupId: string, newWord: string) => {
    if (!newWord.trim()) return;

    const wordToAdd = newWord.trim();
    setWordGroups((groups) =>
      groups.map((group) => {
        if (group.id === groupId && !group.words.includes(wordToAdd)) {
          return { ...group, words: [...group.words, wordToAdd] };
        }
        return group;
      }),
    );

    // Update selected group if it's the one being edited
    if (selectedGroup?.id === groupId) {
      setSelectedGroup((prev) => {
        if (prev && !prev.words.includes(wordToAdd)) {
          return { ...prev, words: [...prev.words, wordToAdd] };
        }
        return prev;
      });
    }
  };

  const handleRemoveWord = (groupId: string, wordIndex: number) => {
    setWordGroups((groups) =>
      groups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              words: group.words.filter((_, index) => index !== wordIndex),
            }
          : group,
      ),
    );

    if (selectedGroup?.id === groupId) {
      setSelectedGroup((prev) => ({
        ...prev!,
        words: prev!.words.filter((_, index) => index !== wordIndex),
      }));
    }
  };

  const renderGroupItem = ({ item }: { item: WordGroup }) => (
    <View style={[styles.groupCard, { borderLeftColor: item.color }]}>
      <View style={styles.groupHeader}>
        <View style={styles.groupInfo}>
          <MaterialIcons name={item.icon as any} size={24} color={item.color} />
          <View style={styles.groupTextContainer}>
            <Text style={styles.groupName}>{item.name}</Text>
            <Text style={styles.groupDescription}>
              {item.isCustom ? "Custom Group" : "Pre-defined Group"}
            </Text>
          </View>
          <View style={styles.wordCount}>
            <Text style={styles.wordCountText}>{item.words.length} words</Text>
          </View>
        </View>
        <View style={styles.groupActions}>
          <Switch
            value={item.isEnabled}
            onValueChange={() => toggleGroup(item.id)}
            trackColor={{ false: "#767577", true: item.color + "80" }}
            thumbColor={item.isEnabled ? item.color : "#f4f3f4"}
          />
          <TouchableOpacity
            onPress={() => {
              setSelectedGroup(item);
              setModalVisible(true);
            }}
            style={styles.editButton}
          >
            <MaterialIcons name="edit" size={20} color="#6366f1" />
          </TouchableOpacity>
          {item.isCustom && (
            <TouchableOpacity
              onPress={() => handleDeleteGroup(item.id)}
              style={styles.deleteButton}
            >
              <MaterialIcons name="delete" size={20} color="#F44336" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.wordChips}>
        {item.words.slice(0, 4).map((word, index) => (
          <View key={index} style={styles.wordChip}>
            <Text style={styles.wordChipText}>{word}</Text>
          </View>
        ))}
        {item.words.length > 4 && (
          <View style={styles.moreChip}>
            <Text style={styles.moreChipText}>+{item.words.length - 4}</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ingredient Categories</Text>
        <Text style={styles.subtitle}>
          Manage food ingredient groups for detection
        </Text>
      </View>

      <View style={styles.infoCard}>
        <MaterialIcons name="info" size={20} color="#6366f1" />
        <Text style={styles.infoText}>
          Enabled groups will be highlighted during ingredient scanning
        </Text>
      </View>

      <FlatList
        data={wordGroups}
        renderItem={renderGroupItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setAddModalVisible(true)}
      >
        <MaterialIcons name="add-circle-outline" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Create Custom Group</Text>
      </TouchableOpacity>

      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {wordGroups.filter((g) => g.isEnabled).length}
          </Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {wordGroups.reduce((total, group) => total + group.words.length, 0)}
          </Text>
          <Text style={styles.statLabel}>Total Ingredients</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {wordGroups.filter((g) => g.isCustom).length}
          </Text>
          <Text style={styles.statLabel}>Custom</Text>
        </View>
      </View>

      {/* Group Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedGroup && (
              <>
                <View style={styles.modalHeader}>
                  <View
                    style={[
                      styles.modalIcon,
                      { backgroundColor: selectedGroup.color + "20" },
                    ]}
                  >
                    <MaterialIcons
                      name={selectedGroup.icon as any}
                      size={30}
                      color={selectedGroup.color}
                    />
                  </View>
                  <View style={styles.modalTitleContainer}>
                    <Text style={styles.modalTitle}>{selectedGroup.name}</Text>
                    <Text style={styles.modalSubtitle}>
                      {selectedGroup.words.length} ingredients •{" "}
                      {selectedGroup.isCustom ? "Custom" : "Pre-defined"}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <MaterialIcons name="close" size={24} color="#666" />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalScrollContent}>
                  <View style={styles.wordsSection}>
                    <Text style={styles.sectionTitle}>
                      Ingredients to detect:
                    </Text>
                    <View style={styles.allWordsContainer}>
                      {selectedGroup.words.map((word, index) => (
                        <View key={index} style={styles.detailedWordChip}>
                          <Text style={styles.detailedWordText}>{word}</Text>
                          <TouchableOpacity
                            onPress={() =>
                              handleRemoveWord(selectedGroup.id, index)
                            }
                            style={styles.removeWordButton}
                          >
                            <MaterialIcons
                              name="close"
                              size={16}
                              color="#F44336"
                            />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  </View>

                  <View style={styles.addWordSection}>
                    <Text style={styles.inputLabel}>Add New Ingredient</Text>
                    <View style={styles.addWordInputContainer}>
                      <TextInput
                        style={styles.addWordInput}
                        placeholder="Enter ingredient name..."
                        placeholderTextColor="#999"
                        value={wordInput}
                        onChangeText={setWordInput}
                        onSubmitEditing={(e) => {
                          handleAddWordToGroup(
                            selectedGroup.id,
                            e.nativeEvent.text,
                          );
                          setWordInput("");
                        }}
                      />
                      <TouchableOpacity
                        style={[
                          styles.addWordButton,
                          !wordInput.trim() && styles.addWordButtonDisabled,
                        ]}
                        onPress={() => {
                          if (wordInput.trim()) {
                            handleAddWordToGroup(selectedGroup.id, wordInput);
                            setWordInput("");
                          }
                        }}
                        disabled={!wordInput.trim()}
                      >
                        <MaterialIcons name="add" size={20} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </ScrollView>

                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={styles.doneButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.doneButtonText}>Done</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Add Group Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addModalVisible}
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Custom Group</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setAddModalVisible(false)}
              >
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScrollContent}>
              <View style={styles.formSection}>
                <Text style={styles.inputLabel}>Group Name</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g., Spices, Gluten-Free, Vegan, etc."
                  value={customGroupName}
                  onChangeText={setCustomGroupName}
                  placeholderTextColor="#999"
                />

                <Text style={styles.inputLabel}>
                  Ingredients (comma separated)
                </Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  placeholder="e.g., turmeric, cumin, paprika, cinnamon"
                  value={customWords}
                  onChangeText={setCustomWords}
                  multiline
                  numberOfLines={4}
                  placeholderTextColor="#999"
                />

                <View style={styles.exampleCard}>
                  <MaterialIcons name="lightbulb" size={18} color="#FF9800" />
                  <Text style={styles.exampleText}>
                    Enter ingredients separated by commas. Example: "turmeric,
                    cumin, paprika, cinnamon"
                  </Text>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  (!customGroupName.trim() || !customWords.trim()) &&
                    styles.saveButtonDisabled,
                ]}
                onPress={handleAddGroup}
                disabled={!customGroupName.trim() || !customWords.trim()}
              >
                <Text style={styles.saveButtonText}>Create Group</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 24,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#212529",
  },
  subtitle: {
    fontSize: 15,
    color: "#6c757d",
    marginTop: 6,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e3f2fd",
    marginHorizontal: 20,
    marginVertical: 15,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#0d47a1",
    lineHeight: 20,
  },
  listContainer: {
    padding: 16,
  },
  groupCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  groupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  groupInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  groupTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  groupName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#212529",
  },
  groupDescription: {
    fontSize: 12,
    color: "#6c757d",
    marginTop: 2,
  },
  wordCount: {
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  wordCountText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#495057",
  },
  groupActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  editButton: {
    padding: 6,
  },
  deleteButton: {
    padding: 6,
  },
  wordChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  wordChip: {
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  wordChipText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#495057",
  },
  moreChip: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  moreChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6366f1",
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 18,
    borderRadius: 14,
    gap: 12,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  statsCard: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 24,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#6366f1",
  },
  statLabel: {
    fontSize: 13,
    color: "#6c757d",
    marginTop: 6,
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#e9ecef",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  modalIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  modalTitleContainer: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#212529",
  },
  modalSubtitle: {
    fontSize: 13,
    color: "#6c757d",
    marginTop: 4,
  },
  closeButton: {
    padding: 4,
  },
  modalScrollContent: {
    maxHeight: 400,
  },
  wordsSection: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 20,
  },
  allWordsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  detailedWordChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e9ecef",
    gap: 10,
  },
  detailedWordText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#495057",
  },
  removeWordButton: {
    padding: 2,
  },
  addWordSection: {
    padding: 24,
    paddingTop: 0,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 12,
  },
  addWordInputContainer: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  addWordInput: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#212529",
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  addWordButton: {
    backgroundColor: "#6366f1",
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  addWordButtonDisabled: {
    backgroundColor: "#adb5bd",
  },
  modalFooter: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
  },
  doneButton: {
    backgroundColor: "#6366f1",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  doneButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  formSection: {
    padding: 24,
  },
  textInput: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#212529",
    borderWidth: 1,
    borderColor: "#dee2e6",
    marginBottom: 20,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  exampleCard: {
    flexDirection: "row",
    backgroundColor: "#fff3cd",
    padding: 16,
    borderRadius: 12,
    gap: 12,
    alignItems: "flex-start",
  },
  exampleText: {
    flex: 1,
    fontSize: 14,
    color: "#856404",
    lineHeight: 20,
  },
  saveButton: {
    backgroundColor: "#6366f1",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonDisabled: {
    backgroundColor: "#adb5bd",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
});
