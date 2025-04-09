import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  LayoutChangeEvent,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useNavigation } from "@react-navigation/native";

import temas from "@/app/guia/temas.json";
import { iconMap } from "@/constants/iconMap";
import { imageMap } from "@/constants/imageMap";

export default function GuiaDetalleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const scrollRef = useRef<ScrollView>(null);
  const sectionPositions = useRef<Record<string, number>>({});

  const navigation = useNavigation();
  const tema = temas.find((t) => t.id === id);

  useEffect(() => {
    if (tema) {
      navigation.setOptions({ title: tema.titulo });
    }
  }, [tema]);

  const handleSectionLayout = (titulo: string, e: LayoutChangeEvent) => {
    sectionPositions.current[titulo] = e.nativeEvent.layout.y;
  };

  const scrollToSection = (titulo: string) => {
    const y = sectionPositions.current[titulo] || 0;
    scrollRef.current?.scrollTo({ y, animated: true });
  };

  if (!tema) {
    return (
      <View style={styles.noTemaContainer}>
        <Text style={styles.title}>Tema no encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Cabecera visual */}
      <View style={styles.headerContainer}>
        {imageMap[tema.imagenFondo] && (
          <Image
            source={imageMap[tema.imagenFondo]}
            style={styles.headerImage}
            resizeMode="cover"
          />
        )}
        <View style={styles.headerOverlay}>
          <Text style={styles.headerNumero}>{tema.id}</Text>
          <Text style={styles.headerTitulo}>{tema.titulo}</Text>
        </View>
      </View>

      {/* Tabs ahora en layout normal, no superpuestos */}
      {tema.secciones.length > 1 && (
        <ScrollView
          horizontal
          style={styles.tabs}
          contentContainerStyle={styles.tabsContent}
          showsHorizontalScrollIndicator={false}
        >
          {tema.secciones.map((sec) => (
            <TouchableOpacity
              key={sec.titulo}
              onPress={() => scrollToSection(sec.titulo)}
              style={styles.tabButton}
            >
              <Text
                style={styles.tabText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {sec.titulo}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Contenido */}
      {tema.secciones.map((sec) => (
        <View
          key={sec.titulo}
          onLayout={(e) => handleSectionLayout(sec.titulo, e)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>{sec.titulo}</Text>
          {sec.contenido?.map((item, i) => (
            <View key={i} style={styles.card}>
              {iconMap[item.icono] && (
                <Image source={iconMap[item.icono]} style={styles.icon} />
              )}
              <Text style={styles.text}>{item.texto}</Text>
              {item.imagen && imageMap[item.imagen] && (
                <Image
                  source={imageMap[item.imagen]}
                  style={styles.imageRight}
                />
              )}
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    paddingBottom: 80,
  },
  noTemaContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // Cabecera
  headerContainer: {
    width: "100%",
    height: 220,
    position: "relative",
    marginBottom: 10,
  },
  headerImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
  },
  headerOverlay: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: "rgba(255,255,255,0.8)",
    justifyContent: "flex-end",
  },
  headerNumero: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#222",
  },
  headerTitulo: {
    fontSize: 20,
    fontWeight: "600",
    color: "#444",
  },

  // Tabs (no absolute)
  tabs: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
  },
  tabsContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  tabButton: {
    minWidth: 80,
    marginRight: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#eee",
    borderRadius: 10,
  },
  tabText: {
    fontSize: 14,
    flexShrink: 1,
    maxWidth: 180,
    overflow: "hidden",
  },

  // Secciones
  section: {
    marginBottom: 25,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
    gap: 10,
  },
  icon: {
    width: 40,
    height: 40,
    marginTop: 5,
  },
  text: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
  },
  imageRight: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginLeft: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
});
