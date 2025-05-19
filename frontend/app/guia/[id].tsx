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
    tabsBackgroundColor?: string;
    tabsColorfondo?: string;
  }
> = {
  "01": {
    headerOverlayColor: "rgba(255,255,255,0.3)",
    headerTituloColor: "rgb(78, 52, 46)",
    sectionTitleColor: "rgb(78, 52, 46)",
    backgroundColor: "#FFF5E5",
    tabsBackgroundColor: "#FFF5E5",
    tabsColorfondo: "#F5E1C2",
    colorNumber: "rgb(78, 52, 46)",
  },
  "02": {
    headerOverlayColor: "rgba(0,0,0,0.2)",
    headerTituloColor: "rgb(255, 255, 255)",
    sectionTitleColor: "rgb(51, 51, 51)",
    backgroundColor: "rgb(245, 191, 187)",
    tabsBackgroundColor: "rgb(245, 191, 187)",
    tabsColorfondo: "rgba(236, 120, 124, 0.67)",
    colorNumber: "rgb(34, 34, 34)",
  },
  "03": {
    headerOverlayColor: "rgba(255,255,255,0.2)",
    headerTituloColor: "rgb(78, 52, 46)",
    sectionTitleColor: "rgb(78, 52, 46)",
    backgroundColor: "rgb(246, 187, 223)",
    tabsBackgroundColor: "rgb(246, 187, 223)",
    tabsColorfondo: "rgba(195, 88, 161, 0.62)",
    colorNumber: "rgb(78, 52, 46)",
  },
  "04": {
    headerOverlayColor: "rgba(0,0,0,0.15)",
    headerTituloColor: "rgb(255, 255, 255)",
    sectionTitleColor: "rgb(78, 52, 46)",
    backgroundColor: "rgb(211, 255, 210)",
    tabsBackgroundColor: "rgb(211, 255, 210)",
    tabsColorfondo: "rgba(99, 191, 108, 0.45)",
    colorNumber: "rgb(78, 52, 46)",
  },
  "05": {
    headerOverlayColor: "rgba(0,0,0,0.2)",
    headerTituloColor: "rgb(255, 255, 255)",
    sectionTitleColor: "rgb(78, 52, 46)",
    backgroundColor: "rgb(225, 245, 254)",
    tabsBackgroundColor: "rgb(225, 245, 254)",
    tabsColorfondo: "rgba(18, 121, 169, 0.4)",
    colorNumber: "rgb(51, 51, 51)",
  },
  "06": {
    headerOverlayColor: "rgba(255,255,255,0.25)",
    headerTituloColor: "rgb(78, 52, 46)",
    sectionTitleColor: "rgb(78, 52, 46)",
    backgroundColor: "rgb(254, 238, 182)",
    tabsBackgroundColor: "rgb(254, 238, 182)",
    tabsColorfondo: "rgba(170, 131, 58, 0.37)",
    colorNumber: "rgb(78, 52, 46)",
  },
  "07": {
    headerOverlayColor: "rgba(0,0,0,0.3)",
    headerTituloColor: "rgb(255, 255, 255)",
    sectionTitleColor: "rgb(78, 52, 46)",
    backgroundColor: "rgb(218, 218, 218)",
    tabsBackgroundColor: "rgb(218, 218, 218)",
    tabsColorfondo: "rgba(107, 107, 107, 0.52)",
    colorNumber: "rgb(78, 52, 46)",
  },
  "08": {
    headerOverlayColor: "rgba(255,255,255,0.3)",
    headerTituloColor: "rgb(78, 52, 46)",
    sectionTitleColor: "rgb(78, 52, 46)",
    tabsBackgroundColor: "rgb(255, 249, 172)",
    tabsColorfondo: "rgba(225, 215, 65, 0.88)",
    colorNumber: "rgb(78, 52, 46)",
  },
  "09": {
    headerOverlayColor: "rgba(255,255,255,0.3)",
    headerTituloColor: "rgb(78, 52, 46)",
    sectionTitleColor: "rgb(78, 52, 46)",
    backgroundColor: "rgb(206, 203, 178)",
    tabsBackgroundColor: "rgb(206, 203, 178)",
    tabsColorfondo: "rgba(173, 165, 111, 0.63)",
    colorNumber: "rgb(78, 52, 46)",
  },
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
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: temaEstilos.backgroundColor },
      ]}
    >
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
            {/* <Text
              style={[styles.headerNumero, { color: temaEstilos.colorNumber }]}
            >
              {String(tema.id ?? "")}
            </Text> */}
            <Text style={[styles.headerTitulo]}>
              {String(tema.titulo ?? "")}
            </Text>
          </View>
        </View>
        {/* tabs */}
        {tema.secciones.length > 1 && (
          <ScrollView
            horizontal
            style={[
              styles.tabs,
              { backgroundColor: temaEstilos.tabsBackgroundColor },
            ]}
            contentContainerStyle={styles.tabsContent}
            showsHorizontalScrollIndicator={false}
          >
            {tema.secciones.map((sec) => (
              <TouchableOpacity
                key={sec.titulo}
                onPress={() => scrollToSection(sec.titulo)}
                style={[
                  styles.tabButton,
                  { backgroundColor: temaEstilos.tabsColorfondo },
                ]}
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
                    p: {
                      fontSize: 16,
                      color: "#4E342E",
                      fontWeight: "normal",
                      marginBottom: 2,
                      lineHeight: 24,
                      justifyContent: "center",
                    },
                    b: {
                      fontWeight: "bold",
                      color: "#4E342E",
                    },
                    u: {
                      textDecorationLine: "underline",
                      color: "#4E342E",
                    },
                    strong: {
                      fontSize: 16,
                      color: "#4E342E",
                      fontWeight: "bold",
                    },
                    li: {
                      fontSize: 16,
                      color: "#4E342E",
                      fontWeight: "normal",
                      marginBottom: 5,
                    },
                    ul: {
                      fontSize: 16,
                      color: "#4E342E",
                      fontWeight: "normal",
                    },
                    span: {
                      color: "#4E342E",
                    },
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
              <View
                key={idx}
                style={[
                  styles.card,
                  { flexDirection: "row", justifyContent: "space-between" },
                ]}
              >
                <View style={{ flex: 1, marginRight: 8 }}>
                  <RenderHTML
                    contentWidth={width}
                    source={{
                      html: `<p><b>NO COMA:</b> ${fila.no_coma}</p>`,
                    }}
                    tagsStyles={{
                      p: {
                        fontSize: 16,
                        color: "#4E342E",
                        fontWeight: "normal",
                        marginBottom: 2,
                      },
                      b: {
                        fontWeight: "bold",
                        color: "#4E342E",
                      },
                      u: {
                        textDecorationLine: "underline",
                        color: "#4E342E",
                      },
                      strong: {
                        fontSize: 16,
                        color: "#4E342E",
                        fontWeight: "bold",
                      },
                      li: {
                        fontSize: 16,
                        color: "#4E342E",
                        fontWeight: "normal",
                        marginBottom: 5,
                      },
                      ul: {
                        fontSize: 16,
                        color: "#4E342E",
                        fontWeight: "normal",
                      },
                      span: {
                        color: "#4E342E",
                      },
                    }}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <RenderHTML
                    contentWidth={width}
                    source={{
                      html: `<p><b>ELIJA ESTO:</b> ${fila.elija_esto}</p>`,
                    }}
                    tagsStyles={{
                      p: {
                        fontSize: 16,
                        color: "#4E342E",
                        fontWeight: "normal",
                        marginBottom: 2,
                      },
                      b: {
                        fontWeight: "bold",
                        color: "#4E342E",
                      },
                      u: {
                        textDecorationLine: "underline",
                        color: "#4E342E",
                      },
                      strong: {
                        fontSize: 16,
                        color: "#4E342E",
                        fontWeight: "bold",
                      },
                      li: {
                        fontSize: 16,
                        color: "#4E342E",
                        fontWeight: "normal",
                        marginBottom: 5,
                      },
                      ul: {
                        fontSize: 16,
                        color: "#4E342E",
                        fontWeight: "normal",
                      },
                      span: {
                        color: "#4E342E",
                      },
                    }}
                  />
                </View>
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
    borderRadius: 15,
  },
  headerOverlay: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(197, 197, 197, 0.38)",
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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
    textAlign: "center",
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
    justifyContent: "center",
  },
  tabButton: {
    minWidth: 100,
    marginRight: 12,
    paddingVertical: 6,
    paddingHorizontal: 14,
    // backgroundColor: "red",
    borderRadius: 14,

    alignItems: "center",
  },
  tabText: {
    justifyContent: "center",
    // alignItems: "center",
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
          shadowOpacity: 0.5,
          shadowRadius: 5,
        }
      : {
          elevation: 5,
          shadowColor: "rgba(0, 0, 0, 0.95)",

          shadowOpacity: 5,
          shadowRadius: 25,
          textShadowOffset: { width: 25, height: 15 },
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
    height: 200,
  },
  imageRight: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginLeft: 8,
  },
});
