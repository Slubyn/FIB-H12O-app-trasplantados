import * as Notifications from "expo-notifications";
import popups from "@/constants/popups.json";

// Extrae una notificación aleatoria del JSON
type PopupCategories = keyof typeof popups;
const categorias = Object.keys(popups) as PopupCategories[];

const getRandomPopup = () => {
  const categoriaRandom =
    categorias[Math.floor(Math.random() * categorias.length)];
  const mensajes = popups[categoriaRandom];
  const mensajeRandom = mensajes[Math.floor(Math.random() * mensajes.length)];

  return {
    categoria: categoriaRandom,
    mensaje: mensajeRandom,
  };
};

// Programa una notificación local para después de X segundos
export const scheduleRandomPopupNotification = async (
  delayInSeconds: number
) => {
  const { categoria, mensaje } = getRandomPopup();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: categoria,
      body: mensaje,
      sound: true,
    },
    trigger: {
      seconds: Math.max(delayInSeconds, 60), // mínimo 60s para Android
      channelId: "default", // necesario en Android
    },
  });
};
