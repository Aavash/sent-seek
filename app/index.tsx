import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Generate 20 different dummy items
const dummyItems = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  title: `Item ${index + 1}`,
  description: `This is a detailed description for item ${index + 1}.`,
  // Different icons or images for variety
  icon:
    index % 5 === 0
      ? "📱"
      : index % 5 === 1
      ? "📚"
      : index % 5 === 2
      ? "🎨"
      : index % 5 === 3
      ? "⚡"
      : "🌟",
  // Different background colors for visual variety
  bgColor:
    index % 4 === 0
      ? "#E3F2FD"
      : index % 4 === 1
      ? "#F3E5F5"
      : index % 4 === 2
      ? "#E8F5E8"
      : "#FFF3E0",
}));

const DummyScrollView = () => {
  const handleItemPress = (itemId: Number) => {
    console.log(`Item ${itemId} pressed`);
    // Add your onPress logic here
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={true}>
      {dummyItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[styles.itemContainer, { backgroundColor: item.bgColor }]}
          onPress={() => handleItemPress(item.id)}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>{item.icon}</Text>
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>

            {/* Additional details for variety */}
            <View style={styles.detailsContainer}>
              <Text style={styles.detailText}>
                ID: {item.id.toString().padStart(2, "0")}
              </Text>
              <Text style={styles.detailText}>
                Status:{" "}
                {item.id % 3 === 0
                  ? "Active"
                  : item.id % 3 === 1
                  ? "Pending"
                  : "Completed"}
              </Text>
            </View>
          </View>

          <View style={styles.arrowContainer}>
            <Text style={styles.arrow}>→</Text>
          </View>
        </TouchableOpacity>
      ))}

      {/* Bottom padding for better scrolling */}
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  iconText: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  detailsContainer: {
    flexDirection: "row",
  },
  detailText: {
    fontSize: 12,
    color: "#888",
    marginRight: 12,
    backgroundColor: "rgba(255,255,255,0.7)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  arrowContainer: {
    paddingLeft: 8,
  },
  arrow: {
    fontSize: 20,
    color: "#666",
  },
  bottomPadding: {
    height: 30,
  },
});

export default DummyScrollView;
