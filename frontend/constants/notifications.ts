import * as Notifications from "expo-notifications";
import popups from "@/constants/popups.json";

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

// ✅ PROGRAMAR UNA NOTIFICACIÓN RECURRENTE CADA X SEGUNDOS (default: 3600s = 1h)
export const scheduleRepeatingPopupNotification = async () => {
  const { categoria, mensaje } = getRandomPopup();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: categoria,
      body: mensaje,
      sound: true,
    },
    trigger: {
      type: "timeInterval" as any,
      seconds: 60,
      repeats: true, // ✅ Esto la hace recurrente
      channelId: "default",
    },
  });
};
