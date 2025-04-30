import * as Notifications from "expo-notifications";
import popups from "@/constants/popups.json";
import temas from "@/constants/temas.json";

type PopupCategories = keyof typeof popups;
const categorias = Object.keys(popups) as PopupCategories[];

// Horas específicas (repetidas cada día)
const horarios_notificaciones = [
  { hora: 13, minutos: 53 },
  { hora: 13, minutos: 55 },
];

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

export const scheduleMultiplePopupNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    for (const horario of horarios_notificaciones) {
      const { categoria, mensaje } = getRandomPopup();

      const temaEncontrado = temas.find((tema) =>
        tema.titulo
          .toLowerCase()
          .includes(categoria.toLowerCase().split(" ")[0])
      );

      const temaId = temaEncontrado?.id ?? "01";

      await Notifications.scheduleNotificationAsync({
        content: {
          title: categoria,
          body: mensaje,
          sound: true,
          data: { temaId },
        },
        trigger: {
          type: "calendar",
          hour: horario.hora,
          minute: horario.minutos,
          repeats: true,
          channelId: "default",
        } as Notifications.CalendarTriggerInput,
      });
    }
  } catch (e) {
    console.error("❌ Error al programar la notificación:", e);
  }
};
