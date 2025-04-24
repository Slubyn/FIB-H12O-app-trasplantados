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
  Alert, //alertas
} from "react-native";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { BotonUtilidades } from "@/components/BotonUtilidades";
import * as Notifications from "expo-notifications";
import { TimeIntervalNotificationTrigger } from "expo-notifications";
// import { scheduleRepeatingPopupNotification } from "@/constants/notifications";

const ancho_pantalla = Dimensions.get("window").width;
const ancho_tarjeta = ancho_pantalla * 0.5; // ocupará el % del total

const colores = {
  fondo: "#FFF5E5", // Crema claro
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
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        backgroundColor: colores.fondo,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          padding: 20,
          marginTop: 16,
          paddingBottom: Platform.OS === "ios" ? 10 : 40,
        }}
      >
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
          contentContainerStyle={{
            paddingLeft: 2,
            paddingTop: 10,
            paddingBottom: 10,
            marginTop: 20,
          }}
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

        <Text style={styles.subtitle}>Utilidades</Text>
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

          {/* <BotonUtilidades
            title="Probar notificación en 60s"
            icon={<MaterialIcons name="alarm" size={24} color="#FF8C5B" />}
            onPress={async () => {
              await Notifications.scheduleNotificationAsync({
                content: {
                  title: "⏰ Notificación",
                  body: "Esta aparecerá en 60 segundos",
                  sound: true,
                },
                trigger: {
                  type: "timeInterval" as any, // 👈 forzamos compatibilidad
                  seconds: 60,
                  repeats: false,
                },
              });

              console.log(" Notificación programada para 60s");
            }}
          /> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;

//APARTADO CSS

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4E342E", // Marrón grisáceo
  },
  subtitle: {
    marginTop: 28,
    fontSize: 20,
    fontWeight: "600",
    color: "#4E342E",
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
  },*/
});

//import { List } from "react-native-paper";
/* Botones utilidades 

<View style={{ marginTop: 10 }}>
<List.Item
  title="Medicación"
  left={() => <Ionicons name="medkit" size={24} color={colores.primario} />}
  onPress={() => {}}
  titleStyle={{ color: colores.texto, fontWeight: "600" }}
  style={styles.paperItem}
/>
<List.Item
  title="Próximas citas"
  left={() => <FontAwesome5 name="calendar-check" size={22} color={colores.primario} />}
  onPress={() => {}}
  titleStyle={{ color: colores.texto, fontWeight: "600" }}
  style={styles.paperItem}
/>
<List.Item
  title="Tensión arterial / glucosa"
  left={() => <MaterialIcons name="favorite" size={24} color={colores.primario} />}
  onPress={() => {}}
  titleStyle={{ color: colores.texto, fontWeight: "600" }}
  style={styles.paperItem}
/>
<List.Item
  title="Campañas vacunación"
  left={() => <MaterialIcons name="vaccines" size={24} color={colores.primario} />}
  onPress={() => {}}
  titleStyle={{ color: colores.texto, fontWeight: "600" }}
  style={styles.paperItem}
/>
</View> */
