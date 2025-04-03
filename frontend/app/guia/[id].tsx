// Ruta: /app/guia/[id].tsx

import React, { useRef, useEffect } from "react";
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
import { useNavigation } from "@react-navigation/native";

import temas from "@/app/guia/temas.json";
import { iconMap } from "@/constants/iconMap";
import { imageMap } from "@/constants/imageMap";

export default function GuiaDetalleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const seccionRefs = useRef<Record<string, number>>({});
  const navigation = useNavigation();

  const tema = temas.find((t) => t.id === id);

  useEffect(() => {
    if (tema) {
      navigation.setOptions({ title: tema.titulo });
    }
  }, [tema]);

  const scrollToSection = (titulo: string) => {
    const y = seccionRefs.current[titulo];
    if (y !== undefined && scrollRef.current) {
      scrollRef.current.scrollTo({ y, animated: true });
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
      {/* Imagen de fondo con número y título */}
      {imageMap[tema.imagenFondo] && (
        <>
          <Image
            source={imageMap[tema.imagenFondo]}
            style={styles.headerImage}
            resizeMode="cover"
          />
          <View style={styles.headerOverlay}>
            <Text style={styles.headerNumero}>{tema.id}</Text>
            <Text style={styles.headerTitulo}>{tema.titulo}</Text>
          </View>
        </>
      )}

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

      {/* Contenido */}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerImage: {
    width: "100%",
    height: 180,
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: -1,
  },
  headerOverlay: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  headerNumero: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#222",
  },
  headerTitulo: {
    fontSize: 20,
    fontWeight: "600",
    color: "#444",
  },
  tabs: {
    flexDirection: "row",
    paddingHorizontal: 10,
    marginBottom: 15,
    marginTop: 5,
  },
  tab: {
    marginRight: 12,
    fontSize: 14,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#eee",
    borderRadius: 10,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 30,
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
  imageRight: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginLeft: 10,
  },
  text: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
});
