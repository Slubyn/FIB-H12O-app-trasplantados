import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity, //efecto visual de click, hace elementos "presionables"
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

// import { scheduleRepeatingPopupNotification } from "@/constants/notifications";

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
  { number: "01", text: "Inmunosupresión", id: "01" },
  { number: "02", text: "Automedicación", id: "02" },
  { number: "03", text: "Salud sexual", id: "03" },
  { number: "04", text: "Alimentación", id: "04" },
  { number: "05", text: "Higiene y estética", id: "05" },
  { number: "06", text: "Exposición al sol", id: "06" },
  { number: "07", text: "Alcohol y tabaco", id: "07" },
  { number: "08", text: "Vacunas y viajes", id: "08" },
  { number: "09", text: "Medidas preventivas", id: "09" },
];

const Dashboard: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const scrollX = useRef(new Animated.Value(0)).current;

  // useEffect(() => {
  //   scheduleRepeatingPopupNotification(61); // lanza una notificación en 5 segundos al entrar
  // }, []);

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

      {/* <ImageBackground
        source={require("@/assets/images/fondo-iconos-rin.png")} // reemplaza por tu fondo
        style={styles.background}
        resizeMode="stretch" //como se adapta la imagen al contenedor
        imageStyle={{ opacity: 0.08 }}
      > */}
        {/* Header por si acaso*/}
        {/* <View style={styles.header}>
          <Image source={require("@/assets/images/avatar.png")} style={styles.avatar} />
          <Text style={styles.greeting}>¡Hola, Rebeca!</Text>
          <Ionicons name="notifications-outline" size={24} color="#FF8C5B" />
        </View> */}

        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Hola, Rebeca</Text>
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
                    style={styles.card} // no más marginRight aquí
                    onPress={() =>
                      router.push({
                        pathname: "/guia/[id]",
                        params: { id: item.id },
                      })
                    }
                  >
                    <Text style={styles.cardNumber}>{item.number}</Text>
                    <Text style={styles.cardText}>{item.text}</Text>
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
              icon={
                <Ionicons name="medkit" size={24} color={colores.primario} />
              }
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
        
          {/* Calendario ejemplo/}
          {/* </View>
            <View style={styles.calendarPreview}>
            <Text style={styles.eventText}>📅 Próxima cita: 12 mayo a las 10:00</Text>
          </View> */}
          </View>
        </ScrollView>
      {/* </ImageBackground> */}
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
  calendarPreview: {
    backgroundColor: '#FFF5E5', // tono cálido del fondo
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    alignItems: 'center',
  },
  topBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 280,
    backgroundColor: colores.primario, // el color salmón
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: "hidden",
    zIndex: -1, // para que quede detrás del contenido
    
    
  },  
  headerImage: {
    width: "100%",
    height: "100%",
    opacity: 0.3, 
    position: "absolute",
    top: 0,
    left: 0,
  },  
  eventText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4E342E', // marrón grisáceo (color del texto principal)
    textAlign: 'center',
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
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
    color: "#4E342E",
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
  /*button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  buttonText: {
    marginLeft: 14,
    fontSize: 16,
    color: "#4E342E",
    fontWeight: "500",
  },
    header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '600',
    color: colores.texto,
    flex: 1,
    marginLeft: 12,
  }, */
});
