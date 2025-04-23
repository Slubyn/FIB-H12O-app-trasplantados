import * as Notifications from "expo-notifications";
import popups from "@/constants/popups.json";
import temas from "@/constants/temas.json";

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
export const scheduleMultiplePopupNotifications = async () => {
  for (let i = 1; i <= 5; i++) {
    const { categoria, mensaje } = getRandomPopup();

    const temaEncontrado = temas.find((tema) =>
      tema.titulo.toLowerCase().includes(categoria.toLowerCase().split(" ")[0])
    );

    const temaId = temaEncontrado?.id ?? "01";

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${categoria}`,
        body: mensaje,
        sound: true,
        data: { temaId: temaId },
      },
      trigger: {
        seconds: i * 60,
        channelId: "default",
        type: "timeInterval" as any,
        repeats: false,
      },
    });
  }

  console.log("✅ 5 notificaciones programadas para los próximos 5 minutos");
};
