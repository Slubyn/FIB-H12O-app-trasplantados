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
    backgroundColor: "#FFF5E5", // fondo crema como dashboard
  },
  contentContainer: {
    paddingBottom: 100,
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
    marginBottom: 16,
  },
  headerImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerOverlay: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: "rgba(255,255,255,0.7)", //el 0. es la opacidad
    justifyContent: "flex-end",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerNumero: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#F95F62",
  },
  headerTitulo: {
    fontSize: 22,
    fontWeight: "600",
    color: "#4E342E",
  },

  // Tabs
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
    minWidth: 100,
    marginRight: 12,
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: "#F5E1C2",
    borderRadius: 14,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4E342E",
  },

  // Secciones
  section: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 14,
    color: "#4E342E",
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
    gap: 12,
  },
  icon: {
    width: 40,
    height: 40,
    marginTop: 4,
  },
  text: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    color: "#4E342E",
  },
  imageRight: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginLeft: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    color: "#F95F62",
  },
});
