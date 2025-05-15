import React, { useRef, useEffect } from "react";
import {
  View,
  Image,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  LayoutChangeEvent,
  SafeAreaView,
  Platform,
  StatusBar,
  Animated,
  useWindowDimensions,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { iconMap } from "@/constants/iconMap";
import { imageMap } from "@/constants/imageMap";
import temas from "@/constants/temas.json";
import RenderHTML from "react-native-render-html";

const colores = {
  fondo: "#FFFFFF", // Blanco puro
  primario: "#FF8C5B", // Naranja salmón
  acento: "#F95F62", // Rojo coral
  texto: "#4E342E", // Marrón grisáceo
  secundario: "#F5E1C2", // Beige arena
};
const estilosPorTema: Record<
  string,
  {
    headerOverlayColor?: string;
    headerTituloColor?: string;
    sectionTitleColor?: string;
    backgroundColor?: string;
    colorNumber?: string;
  }
> = {
  "01": {
    headerOverlayColor: "rgba(255,255,255,0.3)",
    headerTituloColor: "4E342E",
    sectionTitleColor: "#4E342E",
    backgroundColor: "#eca332",
    colorNumber: "4E342E",
  },
  "02": {
    headerOverlayColor: "rgba(0,0,0,0.3)",
    headerTituloColor: "#FFFFFF",
    sectionTitleColor: "#222222",
    backgroundColor: "#E6F7FF",
    colorNumber: "#fff9f7",
  },
  // Puedes añadir aquí los estilos de los otros temas...
};

export default function TestTabsSinImagenes() {
  const { width } = useWindowDimensions();
  const { id } = useLocalSearchParams<{ id: string }>();
  const scrollRef = useRef<ScrollView>(null);
  const sectionPositions = useRef<Record<string, number>>({});

  // const navigation = useNavigation();
  const tema = temas.find((t) => t.id === id);
  const temaEstilos = estilosPorTema[tema?.id ?? ""] ?? {};

  // useEffect(() => {
  //   if (tema) {
  //     navigation.setOptions({ title: String(tema.titulo ?? "") });
  //   }
  // }, [tema]);

  const headerOffset = 55;

  const handleSectionLayout = (titulo: string, e: LayoutChangeEvent) => {
    sectionPositions.current[titulo] = e.nativeEvent.layout.y;
  };

  const scrollToSection = (titulo: string) => {
    const y = (sectionPositions.current[titulo] || 0) - headerOffset;
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
    <SafeAreaView style={styles.safeArea}>
      {/* barra informacion */}
      <StatusBar barStyle="dark-content" />
      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        stickyHeaderIndices={[1]}
      >
        <View style={styles.headerContainer}>
          {imageMap[tema.imagenFondo] && (
            <Image
              source={imageMap[tema.imagenFondo]}
              style={styles.headerImage}
              resizeMode="cover"
            />
          )}
          <View style={styles.headerOverlay}>
            <Text
              style={[styles.headerNumero, { color: temaEstilos.colorNumber }]}
            >
              {String(tema.id ?? "")}
            </Text>
            <Text
              style={[
                styles.headerTitulo,
                { color: temaEstilos.headerTituloColor },
              ]}
            >
              {String(tema.titulo ?? "")}
            </Text>
          </View>
        </View>
        {/* tabs */}
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
                  {String(sec.titulo ?? "")}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {tema.secciones.map((sec) => (
          <View
            key={sec.titulo}
            onLayout={(e) => handleSectionLayout(sec.titulo, e)}
            style={[styles.section]}
          >
            <Text
              style={[
                styles.sectionTitle,
                { color: temaEstilos.sectionTitleColor },
              ]}
            >
              {String(sec.titulo ?? "")}
            </Text>
            {sec.contenido?.map((item, i) => (
              <View key={i} style={styles.card}>
                {iconMap[item.icono] && (
                  <Image source={iconMap[item.icono]} style={styles.icon} />
                )}
                <RenderHTML
                  contentWidth={width}
                  source={{ html: `<p>${item.texto}</p>` }}
                  tagsStyles={{
                    strong: { color: "black", fontWeight: "bold" },
                    p: { fontSize: 16 },
                    li: { fontSize: 16 },
                    ul: { fontSize: 16 },
                  }}
                />
                {item.imagen && imageMap[item.imagen] && (
                  <Image
                    source={imageMap[item.imagen]}
                    style={styles.imageRight}
                  />
                )}
              </View>
            ))}
            {sec.contenidoTabla?.map((fila, idx) => (
              <View key={idx} style={styles.card}>
                <Text style={styles.text}>
                  <Text style={{ fontWeight: "600" }}>No coma:</Text>{" "}
                  {String(fila.no_coma ?? "")}
                </Text>
                <Text style={styles.text}>
                  <Text style={{ fontWeight: "600" }}>Elija esto:</Text>{" "}
                  {String(fila.elija_esto ?? "")}
                </Text>
              </View>
            ))}
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
    backgroundColor: "#FFF5E5",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 10,

    // backgroundColor: "red",
  },
  noTemaContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  headerContainer: {
    width: "100%",
    overflow: "hidden",
    height: 200,
    position: "relative",
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  headerOverlay: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(227, 227, 227, 0.29)",
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopRightRadius: 20,
  },
  headerNumero: {
    fontSize: 36,
    fontWeight: "bold",
  },
  headerTitulo: {
    textTransform: "uppercase",
    letterSpacing: 2,
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
  },
  tabs: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 10,

    backgroundColor: "#FFF5E5",
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
  section: {
    marginBottom: 12,
    paddingHorizontal: 18,
    // backgroundColor: "red",
  },
  sectionTitle: {
    paddingHorizontal: 1,
    fontSize: 20.5,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#4E342E",
  },
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    ...(Platform.OS === "ios"
      ? {
          shadowColor: "rgba(0, 0, 0, 0.81)",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 5,
        }
      : {
          elevation: 3,
        }),

    gap: 12,
  },
  text: {
    flex: 1,
    fontSize: 16,
    fontWeight: "normal",
    // fontStyle: "italic",
    lineHeight: 22,
    color: "#4E342E",
    margin: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    color: "#F95F62",
  },
  icon: {
    width: 40,
    height: 40,
    marginTop: 4,
  },
  headerImage: {
    opacity: 0.9,
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: 300,
  },
  imageRight: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginLeft: 8,
  },
});
