// import React, { useRef, useEffect } from "react";
// import {
//   View,
//   Image,
//   Text,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
//   LayoutChangeEvent,
//   SafeAreaView,
//   Platform,
//   StatusBar,
// } from "react-native";
// import { useLocalSearchParams } from "expo-router";
// import { useNavigation } from "@react-navigation/native";
// import { iconMap } from "@/constants/iconMap";
// import { imageMap } from "@/constants/imageMap";

// ///ARCHIVO DE PRUEBAS
// // Asegúrate de que la ruta sea correcta a tu JSON:
// import temas from "@/constants/temas.json";

// export default function TestTabsSinImagenes() {
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const scrollRef = useRef<ScrollView>(null);
//   const sectionPositions = useRef<Record<string, number>>({});

//   const navigation = useNavigation();
//   const tema = temas.find((t) => t.id === id);

//   useEffect(() => {
//     if (tema) {
//       navigation.setOptions({ title: tema.titulo });
//     }
//   }, [tema]);

//   // Ajusta este offset según tu diseño (altura de header, etc.)
//   const headerOffset = 60;

//   const handleSectionLayout = (titulo: string, e: LayoutChangeEvent) => {
//     sectionPositions.current[titulo] = e.nativeEvent.layout.y;
//   };

//   const scrollToSection = (titulo: string) => {
//     const y = (sectionPositions.current[titulo] || 0) - headerOffset;
//     scrollRef.current?.scrollTo({ y, animated: true });
//   };

//   // Si no existe el tema en el JSON, mostramos placeholder
//   if (!tema) {
//     return (
//       <View style={styles.noTemaContainer}>
//         <Text style={styles.title}>Tema no encontrado</Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <ScrollView
//         ref={scrollRef}
//         style={styles.scrollView}
//         contentContainerStyle={styles.contentContainer}
//       >
//         {/* Cabecera simplificada, sin imagen */}
//         <View style={styles.headerContainer}>
//           {/* Imagen de fondo absoluta */}
//           {imageMap[tema.imagenFondo] && (
//             <Image
//               source={imageMap[tema.imagenFondo]}
//               style={styles.headerImage}
//               resizeMode="cover"
//             />
//           )}
//           <View style={styles.headerOverlay}>
//             <Text style={styles.headerNumero}>{tema.id}</Text>
//             <Text style={styles.headerTitulo}>{tema.titulo}</Text>
//           </View>
//         </View>

//         {/* Tabs */}
//         {tema.secciones.length > 1 && (
//           <ScrollView
//             horizontal
//             style={styles.tabs}
//             contentContainerStyle={styles.tabsContent}
//             showsHorizontalScrollIndicator={false}
//           >
//             {tema.secciones.map((sec) => (
//               <TouchableOpacity
//                 key={sec.titulo}
//                 onPress={() => scrollToSection(sec.titulo)}
//                 style={styles.tabButton}
//               >
//                 <Text
//                   style={styles.tabText}
//                   numberOfLines={1}
//                   ellipsizeMode="tail"
//                 >
//                   {sec.titulo}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </ScrollView>
//         )}

//         {/* Secciones */}
//         {tema.secciones.map((sec) => (
//           <View
//             key={sec.titulo}
//             onLayout={(e) => handleSectionLayout(sec.titulo, e)}
//             style={styles.section}
//           >
//             <Text style={styles.sectionTitle}>{sec.titulo}</Text>
//             {sec.contenido?.map((item, i) => (
//               <View key={i} style={styles.card}>
//                 {/* Aquí solo texto, sin íconos ni imágenes */}
//                 {iconMap[item.icono] && (
//                   <Image source={iconMap[item.icono]} style={styles.icon} />
//                 )}
//                 <Text style={styles.text}>{item.texto}</Text>
//                 {item.imagen && imageMap[item.imagen] && (
//                   <Image
//                     source={imageMap[item.imagen]}
//                     style={styles.imageRight}
//                   />
//                 )}
//               </View>
//             ))}

//             {/* contenidoTabla si lo hubiese */}
//             {sec.contenidoTabla?.map((fila, idx) => (
//               <View key={idx} style={styles.card}>
//                 <Text style={styles.text}>
//                   <Text style={{ fontWeight: "600" }}>No coma:</Text>{" "}
//                   {fila.no_coma}
//                 </Text>
//                 <Text style={styles.text}>
//                   <Text style={{ fontWeight: "600" }}>Elija esto:</Text>{" "}
//                   {fila.elija_esto}
//                 </Text>
//               </View>
//             ))}
//           </View>
//         ))}
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
//     backgroundColor: "#FFF5E5",
//   },
//   scrollView: {
//     flex: 1,
//   },
//   contentContainer: {
//     paddingBottom: 100,
//   },

//   noTemaContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   overlay: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(255,255,255,0.3)", // overlay semitransparente
//   },

//   // Cabecera
//   headerContainer: {
//     width: "100%",
//     overflow: "hidden",
//     height: 200,
//     position: "relative",
//     marginBottom: 16,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   headerOverlay: {
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(255,255,255,0.3)",
//   },
//   headerNumero: {
//     fontSize: 36,
//     fontWeight: "bold",
//     color: "#F95F62",
//   },
//   headerTitulo: {
//     fontSize: 20,
//     fontWeight: "600",
//     color: "#4E342E",
//   },

//   // Tabs
//   tabs: {
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     marginBottom: 10,
//   },
//   tabsContent: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   tabButton: {
//     minWidth: 100,
//     marginRight: 12,
//     paddingVertical: 6,
//     paddingHorizontal: 14,
//     backgroundColor: "#F5E1C2",
//     borderRadius: 14,
//   },
//   tabText: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#4E342E",
//   },

//   // Secciones
//   section: {
//     marginBottom: 30,
//     paddingHorizontal: 20,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 14,
//     color: "#4E342E",
//   },
//   card: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     backgroundColor: "#FFFFFF",
//     borderRadius: 16,
//     padding: 14,
//     marginBottom: 14,
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowOffset: { width: 0, height: 1 },
//     shadowRadius: 3,
//     elevation: 2,
//     gap: 12,
//   },
//   text: {
//     flex: 1,
//     fontSize: 16,
//     lineHeight: 22,
//     color: "#4E342E",
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginTop: 20,
//     color: "#F95F62",
//   },
//   icon: {
//     width: 40,
//     height: 40,
//     marginTop: 4,
//   },
//   headerImage: {
//     borderRadius: 30,
//     position: "absolute",
//     top: 0,
//     left: 0,
//     width: "100%",
//     height: 300, // coincide con la altura del contenedor
//   },
//   imageRight: {
//     width: 60,
//     height: 60,
//     borderRadius: 12,
//     marginLeft: 8,
//   },
// });
