// app/test/index.tsx
import React, { useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  LayoutChangeEvent,
} from "react-native";

export default function TestScreen() {
  const scrollRef = useRef<ScrollView>(null);
  const sectionPositions = useRef<Record<string, number>>({});

  const scrollToSection = (key: string) => {
    const y = sectionPositions.current[key];
    if (y !== undefined && scrollRef.current) {
      scrollRef.current.scrollTo({ y, animated: true });
    }
  };

  const setSectionPosition = (key: string, e: LayoutChangeEvent) => {
    sectionPositions.current[key] = e.nativeEvent.layout.y;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {/* Header fijo */}
        <View style={styles.fakeHeader}>
          <Text style={styles.title}>Header simulado</Text>
        </View>

        {/* Tabs horizontales */}
        <ScrollView
          horizontal
          contentContainerStyle={styles.tabsContainer}
          showsHorizontalScrollIndicator={false}
        >
          {["Tab 1", "Tab 2", "Tab 3"].map((label, idx) => (
            <TouchableOpacity
              key={label}
              style={styles.tab}
              onPress={() => scrollToSection(label)}
            >
              <Text>{label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Secciones */}
        {["Tab 1", "Tab 2", "Tab 3"].map((label, i) => (
          <View
            key={label}
            onLayout={(e) => setSectionPosition(label, e)}
            style={styles.section}
          >
            <Text style={styles.sectionTitle}>{label}</Text>
            <Text style={styles.content}>
              {"\n"}Contenido de {label} {"\n".repeat(30)}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingBottom: 80,
    flexGrow: 1,
  },
  fakeHeader: {
    height: 100,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  tabsContainer: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  tab: {
    backgroundColor: "#ddd",
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 10,
  },
  section: {
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
});
