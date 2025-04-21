import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const TarjetaBonita = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.card} activeOpacity={0.8}>
        <Text style={styles.titulo}>This is heading</Text>
        <Text style={styles.descripcion}>
          Card description with lots of great facts and interesting details.
        </Text>
        <View style={styles.goCorner}>
          <Text style={styles.goArrow}>→</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default TarjetaBonita;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // centra verticalmente
    alignItems: "center",     // centra horizontalmente
    backgroundColor: "#FFF5E5", // opcional: color de fondo igual al de la app
  },
  card: {
    position: "relative",
    maxWidth: 300,
    backgroundColor: "#f2f8f9",
    borderRadius: 8,
    padding: 24,
    margin: 12,
    overflow: "hidden",
    elevation: 4,
  },
  titulo: {
    fontSize: 17,
    fontWeight: "600",
    color: "#333",
  },
  descripcion: {
    fontSize: 14,
    marginTop: 8,
    color: "#666",
  },
  goCorner: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#00838d",
    borderBottomLeftRadius: 32,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  goArrow: {
    color: "#fff",
    fontSize: 16,
  },
});
