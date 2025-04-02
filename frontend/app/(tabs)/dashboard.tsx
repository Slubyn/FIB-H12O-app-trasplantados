import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Dimensions,
} from "react-native";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // ✅ Necesario para navegar

const screenWidth = Dimensions.get("window").width;
const cardWidth = screenWidth * 0.7 + 20;

const Dashboard: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter(); // ✅ Hook de navegación

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollX / cardWidth);
    setActiveIndex(index);
  };

  const cards = [
    { number: "01", text: "Inmunosupresión", id: "01" },
    { number: "02", text: "Automedicación", id: "02" },
    { number: "03", text: "Salud sexual", id: "03" },
    { number: "04", text: "Alimentación", id: "04" },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Hola, " Nombre_Usuario " </Text>
      <Text style={styles.subtitle}>Guía de recomendaciones</Text>

      {/* Carrusel de tarjetas */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.carousel}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
      >
        {cards.map((card, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/guia/[id]",
                params: { id: card.id },
              })
            }
          >
            <Text style={styles.cardNumber}>{card.number}</Text>
            <Text style={styles.cardText}>{card.text}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Puntos de navegación */}
      <View style={styles.dotsContainer}>
        {cards.map((_, index) => (
          <View
            key={index}
            style={index === activeIndex ? styles.dotActive : styles.dot}
          />
        ))}
      </View>

      {/* Sección de utilidades */}
      <Text style={styles.subtitle}>Utilidades</Text>

      <TouchableOpacity style={styles.button}>
        <Ionicons name="medkit" size={24} color="black" />
        <Text style={styles.buttonText}>Medicación</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <FontAwesome5 name="calendar-check" size={24} color="black" />
        <Text style={styles.buttonText}>Próximas citas</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <MaterialIcons name="favorite" size={24} color="black" />
        <Text style={styles.buttonText}>Tensión arterial / glucosa</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <MaterialIcons name="vaccines" size={24} color="black" />
        <Text style={styles.buttonText}>Campañas vacunación</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Dashboard;

//css
const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    marginTop: 30,
    fontSize: 20,
    fontWeight: "600",
  },
  carousel: {
    marginTop: 15,
    flexDirection: "row",
  },
  card: {
    width: screenWidth * 0.5,
    height: 130,
    borderRadius: 12,
    backgroundColor: "#e0e0e0",
    marginRight: 20,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  cardNumber: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cardText: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
  },
  dotsContainer: {
    flexDirection: "row",
    marginVertical: 12,
    justifyContent: "center",
  },
  dot: {
    width: 10,
    height: 10,
    backgroundColor: "#ccc",
    borderRadius: 5,
    margin: 5,
  },
  dotActive: {
    width: 10,
    height: 10,
    backgroundColor: "#000",
    borderRadius: 5,
    margin: 5,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    marginTop: 12,
  },
  buttonText: {
    marginLeft: 15,
    fontSize: 16,
    flex: 1,
    flexWrap: "wrap",
    flexShrink: 1,
    textAlign: "left",
  },
});
