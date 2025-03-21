import { getMessaging, onMessage } from "firebase/messaging";
import { app } from "./notificationPermission";

const messaging = getMessaging(app);

onMessage(messaging, payload => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  if (Notification.permission === "granted") {
    new Notification(notificationTitle, notificationOptions);
  }
});
