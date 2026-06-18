import Touchable from "@/components/touchable";
import { useTasks } from "@/context/tasks-context";
import { useTheme } from "@/context/theme-context";
import { formatDate } from "@/utils/date";
import { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function HomeScreen() {
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

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");

  const combined = useMemo(
    () => [...tasks, ...archivedTasks],
    [tasks, archivedTasks],
  );

  const visibleTasks = useMemo(() => {
    const q = query.trim().toLowerCase();
    // show only active tasks for 'all' and 'pending'; completed are in archived tab
    let list = filter === "completed" ? archivedTasks : tasks;
    if (q) {
      list = list.filter((t) => t.text.toLowerCase().includes(q));
    }
    return list;
  }, [combined, tasks, archivedTasks, filter, query]);

  const confirmDeleteTask = (id: string) => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm("¿Deseas eliminar esta tarea?");
      if (confirmed) {
        deleteTask(id);
      }
      return;
    }

    Alert.alert("Eliminar tarea", "¿Deseas eliminar esta tarea?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: () => deleteTask(id) },
    ]);
  };

  const isDark = theme === "dark";

  if (loading) {
    return (
      <View style={[styles.container, isDark && styles.containerDark]}>
        <Text style={[styles.title, isDark && styles.titleDark]}>
          Cargando tareas...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, isDark && styles.titleDark]}>
          Lista de Tareas
        </Text>
        <Touchable onPress={toggleTheme} style={styles.themeToggle}>
          <Text style={styles.buttonText}>
            {theme === "light" ? "☀️ Claro" : "🌙 Oscuro"}
          </Text>
        </Touchable>
      </View>

      <TextInput
        placeholder="🔍 Buscar tarea..."
        placeholderTextColor={isDark ? "#bbb" : "#888"}
        value={query}
        onChangeText={setQuery}
        style={[styles.searchInput, isDark && styles.searchInputDark]}
      />

      <View style={styles.filterRow}>
        <Touchable onPress={() => setFilter("all")}>
          <Text
            style={[
              styles.filterText,
              filter === "all" ? styles.filterActive : undefined,
            ]}
          >
            Todas
          </Text>
        </Touchable>
        <Touchable onPress={() => setFilter("pending")}>
          <Text
            style={[
              styles.filterText,
              filter === "pending" ? styles.filterActive : undefined,
            ]}
          >
            Pendientes
          </Text>
        </Touchable>
        <Touchable onPress={() => setFilter("completed")}>
          <Text
            style={[
              styles.filterText,
              filter === "completed" ? styles.filterActive : undefined,
            ]}
          >
            Completadas
          </Text>
        </Touchable>
      </View>

      <View style={styles.statsRow}>
        <Text style={[styles.statsText, isDark && styles.statsTextDark]}>
          Total: {totalCount}
        </Text>
        <Text style={[styles.statsText, isDark && styles.statsTextDark]}>
          Pendientes: {pendingCount}
        </Text>
        <Text style={[styles.statsText, isDark && styles.statsTextDark]}>
          Completadas: {completedCount}
        </Text>
      </View>

      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.progressText}>{progress}% completado</Text>

      <FlatList
        data={visibleTasks}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => (
          <Text style={styles.emptyListText}>No hay tareas registradas</Text>
        )}
        renderItem={({ item }) => (
          <View
            style={[styles.taskContainer, isDark && styles.taskContainerDark]}
          >
            <Touchable
              style={styles.taskInfo}
              onPress={() => {
                if (item.archivedAt) return; // already archived
                completeTask(item.id);
              }}
            >
              <View style={styles.taskTextContainer}>
                <View style={styles.taskHeader}>
                  <Text
                    style={[
                      styles.taskText,
                      isDark && styles.taskTextDark,
                      item.completed && styles.completedTask,
                    ]}
                  >
                    {item.text}
                  </Text>
                  <Text
                    style={[
                      styles.priorityLabel,
                      item.priority === "Alta" && styles.priorityHigh,
                      item.priority === "Media" && styles.priorityMedium,
                      item.priority === "Baja" && styles.priorityLow,
                    ]}
                  >
                    {item.priority}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.categoryText,
                    isDark && styles.categoryTextDark,
                  ]}
                >
                  Categoría: {item.category}
                </Text>
                <Text style={[styles.taskDate, isDark && styles.taskDateDark]}>
                  {formatDate(item.createdAt)}
                </Text>
              </View>
            </Touchable>

            <Touchable
              style={styles.deleteButton}
              onPress={() => {
                if (item.archivedAt) deleteArchivedTask(item.id);
                else confirmDeleteTask(item.id);
              }}
            >
              <Text style={styles.buttonText}>X</Text>
            </Touchable>
          </View>
        )}
      />

      <Touchable style={styles.resetButton} onPress={resetTasks}>
        <Text style={styles.buttonText}>Reiniciar Lista</Text>
      </Touchable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop:
      Platform.OS === "android" ? (StatusBar.currentHeight ?? 24) : 50,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },

  statsRow: {
    marginBottom: 10,
  },

  statsText: {
    fontSize: 14,
    marginBottom: 4,
  },

  progressBarBackground: {
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 6,
  },

  progressBarFill: {
    height: "100%",
    backgroundColor: "#2196F3",
  },

  progressText: {
    fontSize: 14,
    marginBottom: 10,
  },

  taskContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    padding: 14,
    marginBottom: 10,
    borderRadius: 10,
  },

  taskInfo: {
    flex: 1,
  },

  taskTextContainer: {
    maxWidth: "80%",
  },

  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  categoryText: {
    fontSize: 12,
    color: "#555",
    marginTop: 4,
  },

  taskText: {
    fontSize: 16,
  },

  taskDate: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },

  priorityLabel: {
    fontSize: 12,
    fontWeight: "700",
  },

  priorityHigh: {
    color: "#d32f2f",
  },

  priorityMedium: {
    color: "#f9a825",
  },

  priorityLow: {
    color: "#388e3c",
  },

  completedTask: {
    textDecorationLine: "line-through",
    color: "green",
  },

  deleteButton: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 5,
  },

  resetButton: {
    backgroundColor: "orange",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },

  emptyListText: {
    textAlign: "center",
    color: "#888",
    fontSize: 16,
    marginTop: 30,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  themeToggle: { backgroundColor: "#1976D2", padding: 8, borderRadius: 8 },
  searchInput: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  filterText: { fontSize: 14, color: "#444" },
  filterActive: { fontWeight: "700", color: "#1976D2" },
  containerDark: { backgroundColor: "#121212" },
  titleDark: { color: "#fff" },
  statsTextDark: { color: "#ddd" },
  taskContainerDark: { backgroundColor: "#1e1e1e" },
  taskTextDark: { color: "#fff" },
  categoryTextDark: { color: "#bbb" },
  taskDateDark: { color: "#aaa" },
  searchInputDark: { backgroundColor: "#222", color: "#fff" },
});
