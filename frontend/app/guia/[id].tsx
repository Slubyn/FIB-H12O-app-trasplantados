// Ruta: /app/guia/[id].tsx

import React, { useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import temas from "@/app/guia/temas.json";
import { iconMap } from "@/constants/iconMap";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";

export default function GuiaDetalleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const seccionRefs = useRef<Record<string, number>>({});

  const tema = temas.find((t) => t.id === id); // Busca el tema en el JSON

  const navigation = useNavigation();
  useEffect(() => {
    if (tema) {
      navigation.setOptions({ title: tema.titulo });
    }
  }, [tema]);

  const scrollToSection = (titulo: string) => {
    const y = seccionRefs.current[titulo];
    if (y !== undefined && scrollRef.current) {
      scrollRef.current.scrollTo({ y, animated: true }); // Hace scroll automático a la sección
    }
  };

  const setRefPosition = (
    titulo: string,
    e: NativeSyntheticEvent<NativeScrollEvent> | any
  ) => {
    const y = e.nativeEvent.layout.y;
    seccionRefs.current[titulo] = y;
  };

  if (!tema) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Tema no encontrado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{tema.titulo}</Text>
      </View> */}

      {/* Tabs de secciones */}
      {tema.secciones.length > 1 && (
        <ScrollView
          horizontal
          style={styles.tabs}
          showsHorizontalScrollIndicator={false}
        >
          {tema.secciones.map((sec) => (
            <TouchableOpacity
              key={sec.titulo}
              onPress={() => scrollToSection(sec.titulo)}
            >
              <Text style={styles.tab}>{sec.titulo}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Contenido del tema */}
      <ScrollView ref={scrollRef} contentContainerStyle={styles.content}>
        {tema.secciones.map((sec) => (
          <View
            key={sec.titulo}
            onLayout={(e) => setRefPosition(sec.titulo, e)}
            style={styles.section}
          >
            <Text style={styles.sectionTitle}>{sec.titulo}</Text>
            {sec.contenido.map((item, i) => (
              <View key={i} style={styles.card}>
                {iconMap[item.icono] && (
                  <Image source={iconMap[item.icono]} style={styles.icon} />
                )}
                <Text style={styles.text}>{item.texto}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  backButton: { fontSize: 24, marginRight: 16 },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flexShrink: 1,
    flexWrap: "wrap",
  },
  tabs: { flexDirection: "row", paddingHorizontal: 10, marginBottom: 15 },
  tab: {
    marginRight: 12,
    fontSize: 14,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#eee",
    borderRadius: 10,
  },
  content: { paddingHorizontal: 16, paddingBottom: 40 },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 12 },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
    gap: 10,
  },
  icon: { width: 50, height: 50, marginTop: 5 },
  text: { flex: 1, fontSize: 15, lineHeight: 22 },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
});
