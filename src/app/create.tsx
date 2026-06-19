import CreateTaskScreen from "@/components/CreateTaskScreen";
import { useTasks } from "@/context/tasks-context";
import { useTheme } from "@/context/theme-context";
import { scheduleExampleReminder } from "@/utils/notifications";
import { useRouter } from "expo-router";

export default function Page() {
  const router = useRouter();
  const { addTask } = useTasks();
  const { theme } = useTheme();

  const handleSaveTask = (task: {
    text: string;
    category: string;
    priority: string;
  }) => {
    addTask(task as any);
    router.push("/");
  };

  const handleScheduleReminder = async () => {
    try {
      await scheduleExampleReminder();
      alert("Recordatorio programado para las 20:00");
    } catch (e) {
      alert("No se pudo programar la notificación. Revisa permisos.");
    }
  };

  return (
    <CreateTaskScreen
      theme={theme}
      onSaveTask={handleSaveTask}
      onScheduleReminder={handleScheduleReminder}
    />
  );
}
