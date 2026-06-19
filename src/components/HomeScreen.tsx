import Touchable from "@/components/touchable";
import { Task } from "@/types";
import { formatDate } from "@/utils/date";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
    Alert,
    Animated,
    Dimensions,
    FlatList,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

type HomeScreenProps = {
  tasks: Task[];
  archivedTasks: Task[];
  loading: boolean;
  completedCount: number;
  totalCount: number;
  pendingCount: number;
  progress: number;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onCompleteTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onDeleteArchivedTask: (id: string) => void;
  onResetTasks: () => void;
};

export default function HomeScreen({
  tasks,
  archivedTasks,
  loading,
  completedCount,
  totalCount,
  pendingCount,
  progress,
  theme,
  onToggleTheme,
  onCompleteTask,
  onDeleteTask,
  onDeleteArchivedTask,
  onResetTasks,
}: HomeScreenProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [scaleValue] = useState(new Animated.Value(1));
  const router = useRouter();

  const isDark = theme === "dark";

  const visibleTasks = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = filter === "completed" ? archivedTasks : tasks;
    if (q) {
      list = list.filter((t) => t.text.toLowerCase().includes(q));
    }
    return list;
  }, [query, filter, tasks, archivedTasks]);

  const confirmDeleteTask = (id: string) => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm("¿Deseas eliminar esta tarea?");
      if (confirmed) {
        onDeleteTask(id);
      }
      return;
    }

    Alert.alert(
      "🗑️ Eliminar tarea",
      "¿Estás seguro de que quieres eliminar esta tarea?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => onDeleteTask(id),
        },
      ],
    );
  };

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  if (loading) {
    return (
      <LinearGradient
        colors={isDark ? ["#1a1a2e", "#16213e"] : ["#667eea", "#764ba2"]}
        style={styles.loadingContainer}
      >
        <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
          <Text style={[styles.loadingText, isDark && styles.loadingTextDark]}>
            ✨ Cargando tareas...
          </Text>
        </Animated.View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={
        isDark
          ? ["#1a1a2e", "#16213e", "#0f3460"]
          : ["#667eea", "#764ba2", "#f093fb"]
      }
      style={styles.container}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View style={styles.headerSection}>
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.greeting, isDark && styles.greetingDark]}>
              👋 ¡Hola!
            </Text>
            <Text style={[styles.title, isDark && styles.titleDark]}>
              Mis Tareas
            </Text>
            <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
              {pendingCount > 0
                ? `📌 ${pendingCount} tareas pendientes`
                : "🎉 ¡Todo completado!"}
            </Text>
          </View>
          <Touchable
            onPress={onToggleTheme}
            style={styles.themeToggle}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
              <Text style={styles.themeEmoji}>
                {theme === "light" ? "☀️" : "🌙"}
              </Text>
            </Animated.View>
          </Touchable>
        </View>

        <View style={styles.searchWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            placeholder="Buscar tarea..."
            placeholderTextColor={isDark ? "#888" : "#999"}
            value={query}
            onChangeText={setQuery}
            style={[styles.searchInput, isDark && styles.searchInputDark]}
          />
          {query.length > 0 && (
            <Touchable onPress={() => setQuery("")} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>✕</Text>
            </Touchable>
          )}
        </View>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalCount}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, styles.pendingValue]}>
              {pendingCount}
            </Text>
            <Text style={styles.statLabel}>Pendientes</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, styles.completedValue]}>
              {completedCount}
            </Text>
            <Text style={styles.statLabel}>Completadas</Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>📊 Progreso</Text>
            <Text style={styles.progressPercentage}>{progress}%</Text>
          </View>
          <View style={styles.progressBarBackground}>
            <LinearGradient
              colors={["#667eea", "#764ba2", "#f093fb"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressBarFill, { width: `${progress}%` }]}
            />
          </View>
        </View>
      </View>

      <View style={styles.filterSection}>
        <Touchable
          onPress={() => setFilter("all")}
          style={[
            styles.filterChip,
            filter === "all" ? styles.filterChipActive : undefined,
          ]}
        >
          <Text
            style={[
              styles.filterText,
              filter === "all" && styles.filterTextActive,
            ]}
          >
            📋 Todas
          </Text>
        </Touchable>
        <Touchable
          onPress={() => setFilter("pending")}
          style={[
            styles.filterChip,
            filter === "pending" ? styles.filterChipActive : undefined,
          ]}
        >
          <Text
            style={[
              styles.filterText,
              filter === "pending" && styles.filterTextActive,
            ]}
          >
            ⏳ Pendientes
          </Text>
        </Touchable>
        <Touchable
          onPress={() => setFilter("completed")}
          style={[
            styles.filterChip,
            filter === "completed" ? styles.filterChipActive : undefined,
          ]}
        >
          <Text
            style={[
              styles.filterText,
              filter === "completed" && styles.filterTextActive,
            ]}
          >
            ✅ Completadas
          </Text>
        </Touchable>
      </View>

      <Touchable
        style={styles.createTaskButton}
        onPress={() => router.push("/create")}
      >
        <LinearGradient
          colors={isDark ? ["#7c3aed", "#4338ca"] : ["#4f46e5", "#38bdf8"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.createTaskGradient}
        >
          <Text style={styles.createTaskText}>＋ Crear tarea</Text>
        </LinearGradient>
      </Touchable>

      <FlatList
        data={visibleTasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📭</Text>
            <Text style={styles.emptyListText}>No hay tareas registradas</Text>
            <Text style={styles.emptySubText}>¡Agrega una nueva tarea!</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <LinearGradient
            colors={isDark ? ["#2d2d44", "#1e1e32"] : ["#ffffff", "#f8f9ff"]}
            style={[
              styles.taskCard,
              item.archivedAt && styles.taskCardCompleted,
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Touchable
              style={styles.taskContent}
              onPress={() => {
                if (item.archivedAt) return;
                onCompleteTask(item.id);
              }}
              disabled={!!item.archivedAt}
            >
              <View style={styles.taskHeader}>
                <View style={styles.taskTitleContainer}>
                  <Text
                    style={[
                      styles.taskTitle,
                      isDark && styles.taskTitleDark,
                      item.completed && styles.taskCompleted,
                    ]}
                    numberOfLines={2}
                  >
                    {item.text}
                  </Text>
                  <View
                    style={[
                      styles.priorityBadge,
                      item.priority === "Alta" && styles.priorityHigh,
                      item.priority === "Media" && styles.priorityMedium,
                      item.priority === "Baja" && styles.priorityLow,
                    ]}
                  >
                    <Text style={styles.priorityText}>{item.priority}</Text>
                  </View>
                </View>

                <View style={styles.taskMeta}>
                  <Text
                    style={[
                      styles.categoryText,
                      isDark && styles.categoryTextDark,
                    ]}
                  >
                    📂 {item.category}
                  </Text>
                  <Text
                    style={[styles.taskDate, isDark && styles.taskDateDark]}
                  >
                    📅 {formatDate(item.createdAt)}
                  </Text>
                </View>
              </View>
            </Touchable>

            <Touchable
              style={styles.deleteButton}
              onPress={() => {
                if (item.archivedAt) onDeleteArchivedTask(item.id);
                else confirmDeleteTask(item.id);
              }}
            >
              <Text style={styles.deleteButtonText}>✕</Text>
            </Touchable>
          </LinearGradient>
        )}
      />

      <Touchable style={styles.resetButton} onPress={onResetTasks}>
        <LinearGradient
          colors={["#f093fb", "#f5576c"]}
          style={styles.resetGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.resetButtonText}>🔄 Reiniciar Lista</Text>
        </LinearGradient>
      </Touchable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:
      Platform.OS === "android" ? (StatusBar.currentHeight ?? 24) + 16 : 56,
    paddingBottom: 160,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  loadingTextDark: {
    color: "#fff",
  },
  headerSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  greeting: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 2,
  },
  greetingDark: {
    color: "rgba(255,255,255,0.6)",
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#fff",
  },
  titleDark: {
    color: "#fff",
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    marginTop: 4,
  },
  subtitleDark: {
    color: "rgba(255,255,255,0.5)",
  },
  themeToggle: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 10,
    borderRadius: 30,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  themeEmoji: {
    fontSize: 24,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 16,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: "#333",
  },
  searchInputDark: {
    backgroundColor: "rgba(255,255,255,0.05)",
    color: "#fff",
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  clearButtonText: {
    fontSize: 16,
    color: "#999",
    fontWeight: "bold",
  },
  statsCard: {
    marginHorizontal: 18,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 16,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#667eea",
  },
  pendingValue: {
    color: "#f093fb",
  },
  completedValue: {
    color: "#4ade80",
  },
  statLabel: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#e0e0e0",
  },
  progressSection: {
    marginTop: 4,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#667eea",
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 10,
  },
  filterSection: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  filterChipActive: {
    backgroundColor: "#fff",
    borderColor: "#fff",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255,255,255,0.8)",
  },
  filterTextActive: {
    color: "#667eea",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 200,
  },
  taskCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  taskCardCompleted: {
    opacity: 0.7,
  },
  taskContent: {
    flex: 1,
  },
  taskHeader: {
    flex: 1,
  },
  taskTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  taskTitleDark: {
    color: "#fff",
  },
  taskCompleted: {
    textDecorationLine: "line-through",
    opacity: 0.6,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#e0e0e0",
  },
  priorityText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
  },
  priorityHigh: {
    backgroundColor: "#ff6b6b",
  },
  priorityMedium: {
    backgroundColor: "#ffd93d",
  },
  priorityLow: {
    backgroundColor: "#6bcb77",
  },
  taskMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
  },
  categoryText: {
    fontSize: 12,
    color: "#888",
  },
  categoryTextDark: {
    color: "#aaa",
  },
  taskDate: {
    fontSize: 12,
    color: "#999",
  },
  taskDateDark: {
    color: "#888",
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#ff6b6b",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  resetButton: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  resetGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  createTaskButton: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  createTaskGradient: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  createTaskText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyListText: {
    fontSize: 18,
    fontWeight: "600",
    color: "rgba(255,255,255,0.8)",
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.5)",
  },
});
