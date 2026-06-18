import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      const req = await Notifications.requestPermissionsAsync();
      return req.status === "granted";
    }
    return true;
  } catch (e) {
    console.warn("Notification permission error", e);
    return false;
  }
}

export async function scheduleLocalNotification(
  title: string,
  body: string,
  date: Date,
) {
  const ok = await requestNotificationPermission();
  if (!ok) throw new Error("Permission not granted");

  // Expo supports scheduling with a Date trigger on managed workflow
  const seconds = Math.max(1, Math.floor((date.getTime() - Date.now()) / 1000));

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
    },
    trigger: { seconds } as any,
  });

  return id;
}

export function nextDateAtHour(hour24: number, minute = 0) {
  const now = new Date();
  const target = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hour24,
    minute,
    0,
  );
  if (target.getTime() <= now.getTime()) {
    // schedule for tomorrow
    target.setDate(target.getDate() + 1);
  }
  return target;
}

export async function scheduleExampleReminder() {
  const date = nextDateAtHour(20, 0); // 20:00
  return scheduleLocalNotification(
    "Recordatorio: Entregar proyecto",
    "React Native — 8:00 PM",
    date,
  );
}
