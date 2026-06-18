import { STORAGE_KEY, Task } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

type TasksContextType = {
  tasks: Task[];
  archivedTasks: Task[];
  loading: boolean;
  addTask: (task: Omit<Task, "id" | "completed" | "createdAt">) => void;
  completeTask: (id: string) => void;
  deleteTask: (id: string) => void;
  deleteArchivedTask: (id: string) => void;
  resetTasks: () => void;
  totalCount: number;
  pendingCount: number;
  completedCount: number;
  progress: number;
};

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [archivedTasks, setArchivedTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTasks() {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            // migrate old array format: move completed tasks to archived
            const arr = parsed as Task[];
            const active = arr.filter((t) => !t.completed);
            const archived = arr
              .filter((t) => t.completed)
              .map((t) => ({
                ...t,
                archivedAt: t.archivedAt || new Date().toISOString(),
              }));
            setTasks(active);
            setArchivedTasks(archived);
          } else if (parsed && typeof parsed === "object") {
            setTasks(parsed.tasks || []);
            setArchivedTasks(parsed.archivedTasks || []);
          }
        }
      } catch (error) {
        console.warn("No se pudieron cargar las tareas", error);
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
  }, []);

  useEffect(() => {
    async function saveTasks() {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ tasks, archivedTasks }),
        );
      } catch (error) {
        console.warn("No se pudieron guardar las tareas", error);
      }
    }

    saveTasks();
  }, [tasks, archivedTasks]);

  // Auto-remove archived tasks older than 2 hours
  useEffect(() => {
    const CLEAN_MS = 2 * 60 * 60 * 1000; // 2 hours

    function cleanArchived() {
      setArchivedTasks((current) =>
        current.filter((t) => {
          if (!t.archivedAt) return true;
          return Date.now() - new Date(t.archivedAt).getTime() < CLEAN_MS;
        }),
      );
    }

    cleanArchived();
    const id = setInterval(cleanArchived, 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const addTask = (task: Omit<Task, "id" | "completed" | "createdAt">) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTasks((currentTasks) => [...currentTasks, newTask]);
  };

  const completeTask = (id: string) => {
    setTasks((currentTasks) => {
      const found = currentTasks.find((t) => t.id === id);
      if (!found) return currentTasks;
      setArchivedTasks((prev) => [
        ...prev,
        {
          ...found,
          completed: true,
          archivedAt: new Date().toISOString(),
        } as Task,
      ]);
      return currentTasks.filter((t) => t.id !== id);
    });
  };

  const deleteTask = (id: string) => {
    setTasks((currentTasks) => currentTasks.filter((item) => item.id !== id));
  };

  const deleteArchivedTask = (id: string) => {
    setArchivedTasks((current) => current.filter((t) => t.id !== id));
  };

  const resetTasks = () => {
    setTasks([]);
    setArchivedTasks([]);
  };

  const completedCount = archivedTasks.length; // archived = completed
  const totalCount = tasks.length + archivedTasks.length;
  const pendingCount = tasks.filter((item) => !item.completed).length;
  const progress =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <TasksContext.Provider
      value={{
        tasks,
        archivedTasks,
        loading,
        addTask,
        completeTask,
        deleteTask,
        deleteArchivedTask,
        resetTasks,
        totalCount,
        pendingCount,
        completedCount,
        progress,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasks must be used within TasksProvider");
  }
  return context;
}
