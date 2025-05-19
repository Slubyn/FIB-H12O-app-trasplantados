import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity, //efecto  de click, hace elementos "presionables"
  Dimensions, //devuelve el tamaño de la pantalla de algo
  SafeAreaView, //para compatibilidad, evita que algunas cosas se evan ocultas
  Platform, //para aplicar estilos o comportamiento especifico para cada plataforma
  StatusBar, //para ajustar margenes o estilos
  ScrollView,
  Animated, //animated flatlist
  FlatList, //para hacer scroll horizontal
  ImageBackground, //para poner una imagen de fondo
  Alert, //alertas
  Image, //para mostrar imágenes
} from "react-native";

import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { BotonUtilidades } from "@/components/BotonUtilidades";
import { useSafeAreaInsets } from "react-native-safe-area-context"; //para evitar que el contenido se superponga a la barra de estado

const ancho_pantalla = Dimensions.get("window").width;
const ancho_tarjeta = ancho_pantalla * 0.5; // ocupará el % del total

const colores = {
  fondo: "#FFFFFF", // Blanco puro
  primario: "#FF8C5B", // Naranja salmón
  acento: "#F95F62", // Rojo coral
  texto: "#4E342E", // Marrón grisáceo
  secundario: "#F5E1C2", // Beige arena
};

const cards = [
  {
    number: "01",
    text: "Inmunosupresión",
    id: "01",
    imagen: require("@/assets/images/guia-fondo/Tema1.png"),
  },
  {
    number: "02",
    text: "Automedicación",
    id: "02",
    imagen: require("@/assets/images/guia-fondo/Tema2.png"),
  },
  {
    number: "03",
    text: "Salud sexual",
    id: "03",
    imagen: require("@/assets/images/guia-fondo/Tema3.png"),
  },
  {
    number: "04",
    text: "Alimentación",
    id: "04",
    imagen: require("@/assets/images/guia-fondo/Tema4.png"),
  },
  {
    number: "05",
    text: "Higiene y estética",
    id: "05",
    imagen: require("@/assets/images/guia-fondo/Tema5.png"),
  },
  {
    number: "06",
    text: "Exposición al sol",
    id: "06",
    imagen: require("@/assets/images/guia-fondo/Tema6.png"),
  },
  {
    number: "07",
    text: "Alcohol y tabaco",
    id: "07",
    imagen: require("@/assets/images/guia-fondo/Tema7.png"),
  },
  {
    number: "08",
    text: "Vacunas y viajes",
    id: "08",
    imagen: require("@/assets/images/guia-fondo/Tema8.png"),
  },
  {
    number: "09",
    text: "Medidas preventivas",
    id: "09",
    imagen: require("@/assets/images/guia-fondo/Tema9.png"),
  },
];

const Dashboard: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleScroll = (event: any) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollX / (ancho_tarjeta + 1));
    setActiveIndex(index);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBackground}>
        <Image
          source={require("@/assets/images/fondo-iconos-rin.png")} // ruta de tu imagen
          style={styles.headerImage}
          resizeMode="cover"
        />
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Bienvenido 😊</Text>
        <Text style={styles.subtitle}>Guía de recomendaciones</Text>

        {/* Carrusel */}
        <Animated.FlatList
          data={cards}
          horizontal
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          snapToInterval={ancho_tarjeta + 12} // 12 = separación entre tarjetas
          decelerationRate="fast"
          contentContainerStyle={styles.carouselContainer}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />} // separación entre tarjetas
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(
              event.nativeEvent.contentOffset.x / (ancho_tarjeta + 12)
            );
            setActiveIndex(index);
          }}
          renderItem={({ item, index }) => {
            const inputRange = [
              (index - 1) * (ancho_tarjeta + 12),
              index * (ancho_tarjeta + 12),
              (index + 1) * (ancho_tarjeta + 12),
            ];

            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [0.9, 1, 0.9],
              extrapolate: "clamp",
            });

            return (
              <Animated.View style={{ transform: [{ scale }] }}>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/guia/[id]",
                      params: { id: item.id },
                    })
                  }
                >
                  <ImageBackground
                    source={item.imagen}
                    style={styles.card}
                    imageStyle={{ borderRadius: 16 }} // redondear imagen
                  >
                    <View style={styles.cardOverlay}>
                      <Text style={styles.cardText}>{item.text}</Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              </Animated.View>
            );
          }}
        />

        {/* Dots */}
        <View style={styles.dotsContainer}>
          {cards.map((_, index) => (
            <View
              key={index}
              style={index === activeIndex ? styles.dotActive : styles.dot}
            />
          ))}
        </View>

        <Text style={styles.subtitleUtilidades}>Utilidades</Text>
        {/* Botones utilidades */}
        <View style={{ gap: 15, marginTop: 20 }}>
          <BotonUtilidades
            title="Medicación"
            icon={<Ionicons name="medkit" size={24} color={colores.primario} />}
            onPress={() => {}}
          />

          <BotonUtilidades
            title="Próximas citas"
            icon={
              <FontAwesome5
                name="calendar-check"
                size={22}
                color={colores.primario}
              />
            }
            onPress={() => {}}
          />

          <BotonUtilidades
            title="Tensión arterial / glucosa"
            icon={
              <MaterialIcons
                name="favorite"
                size={24}
                color={colores.primario}
              />
            }
            onPress={() => {}}
          />

          <BotonUtilidades
            title="Campañas vacunación"
            icon={
              <MaterialIcons
                name="vaccines"
                size={24}
                color={colores.primario}
              />
            }
            onPress={() => {}}
          />
        </View>
      </ScrollView>
      {/* Logo empresa abajo a la derecha */}
      <Image
        source={require("@/assets/images/guia-fondo/logo_12-de-octubre.png")}
        style={styles.logo}
      />
      <Image
        source={require("@/assets/images/guia-fondo/logofundacion.png")}
        style={styles.logo2}
      />
    </SafeAreaView>
  );
};

export default Dashboard;

//APARTADO CSS

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: colores.fondo,
    position: "relative",
  },
  background: {
    flex: 1,
  },
  container: {
    padding: 20,
    marginTop: 16,
    paddingBottom: Platform.OS === "ios" ? 10 : 40,
  },
  logo: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 125,
    height: 60,
    resizeMode: "contain",
    opacity: 0.85,
    zIndex: 10,
  },
  logo2: {
    position: "absolute",
    bottom: 20,
    left: 28,
    width: 80,
    height: 60,
    resizeMode: "contain",
    opacity: 0.85,
    zIndex: 10,
  },

  topBackground: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: Platform.OS === "android" ? 295 : 300,
    backgroundColor: colores.primario, // el color salmón
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 220,
    overflow: "hidden",
    transform: [
      { scaleX: 1.05 }, // desplaza el fondo hacia arriba
    ],
  },
  cardOverlay: {
    backgroundColor: "rgba(231, 233, 232, 0.43)",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },

  headerImage: {
    width: "100%",
    height: "100%",
    opacity: 0.3,
    position: "absolute",
    top: 0,
    left: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colores.fondo,
  },
  subtitle: {
    marginTop: 28,
    fontSize: 20,
    fontWeight: "600",
    color: colores.fondo,
  },
  subtitleUtilidades: {
    marginTop: 28,
    fontSize: 20,
    fontWeight: "600",
    color: colores.texto,
  },
  carouselContainer: {
    paddingTop: 16,
    paddingBottom: 10,
    paddingLeft: 2,
    marginTop: 16,
  },
  card: {
    width: ancho_tarjeta,
    height: 140,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },

  cardNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#F95F62",
    marginBottom: 6,
  },
  cardText: {
    fontSize: 21,
    textAlign: "center",
    fontWeight: "500",
    color: "#4E342E",
    // shadowColor: "rgba(135, 141, 139, 0.89)",
    // shadowOpacity: 0.5,
    // shadowOffset: { width: 3.5, height: 2 },
    // shadowRadius: 0.8,
    // elevation: 1,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 2,
  },
  dot: {
    width: 10,
    height: 10,
    backgroundColor: "#F5E1C2",
    borderRadius: 5,
    margin: 5,
  },
  dotActive: {
    width: 10,
    height: 10,
    backgroundColor: "#F95F62",
    borderRadius: 5,
    margin: 5,
  },
});
