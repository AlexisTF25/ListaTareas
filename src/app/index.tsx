import HomeScreen from "@/components/HomeScreen";
import { useTasks } from "@/context/tasks-context";
import { useTheme } from "@/context/theme-context";

export default function Page() {
  const {
    tasks,
    archivedTasks,
    loading,
    completedCount,
    totalCount,
    pendingCount,
    progress,
    completeTask,
    deleteTask,
    resetTasks,
    deleteArchivedTask,
  } = useTasks();
  const { theme, toggleTheme } = useTheme();

  return (
    <HomeScreen
      tasks={tasks}
      archivedTasks={archivedTasks}
      loading={loading}
      completedCount={completedCount}
      totalCount={totalCount}
      pendingCount={pendingCount}
      progress={progress}
      theme={theme}
      onToggleTheme={toggleTheme}
      onCompleteTask={completeTask}
      onDeleteTask={deleteTask}
      onDeleteArchivedTask={deleteArchivedTask}
      onResetTasks={resetTasks}
    />
  );
}
