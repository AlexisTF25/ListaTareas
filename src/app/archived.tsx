import ArchivedScreen from "@/components/ArchivedScreen";
import { useTasks } from "@/context/tasks-context";
import { useTheme } from "@/context/theme-context";

export default function Page() {
  const { archivedTasks, deleteArchivedTask } = useTasks();
  const { theme } = useTheme();

  return (
    <ArchivedScreen
      archivedTasks={archivedTasks}
      deleteArchivedTask={deleteArchivedTask}
      theme={theme}
    />
  );
}
