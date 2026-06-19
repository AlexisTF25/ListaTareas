import Touchable from "@/components/touchable";
import { Task } from "@/types";
import { formatDate } from "@/utils/date";
import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    FlatList,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

type ArchivedScreenProps = {
  archivedTasks: Task[];
  deleteArchivedTask: (id: string) => void;
  theme: "light" | "dark";
};

function timeLeft(iso?: string) {
  if (!iso) return "";
  const CLEAN_MS = 2 * 60 * 60 * 1000;
  const left = CLEAN_MS - (Date.now() - new Date(iso).getTime());
  if (left <= 0) return "⏰ Se eliminará pronto";
  const minutes = Math.floor(left / 60000);
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `⏳ ${hours}h ${mins}m`;
}

function getTimeLeftPercentage(iso?: string) {
  if (!iso) return 0;
  const CLEAN_MS = 2 * 60 * 60 * 1000;
  const elapsed = Date.now() - new Date(iso).getTime();
  const percentage = Math.min((elapsed / CLEAN_MS) * 100, 100);
  return percentage;
}

export default function ArchivedScreen({
  archivedTasks,
  deleteArchivedTask,
  theme,
}: ArchivedScreenProps) {
  const isDark = theme === "dark";
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const scaleValue = useRef(new Animated.Value(1)).current;

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

  const handleDelete = (id: string) => {
    setSelectedId(id);
    // Animación de eliminación
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      deleteArchivedTask(id);
      setSelectedId(null);
      scaleValue.setValue(1);
    });
  };

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
        <Text style={styles.headerEmoji}>📦</Text>
        <Text style={[styles.title, isDark && styles.titleDark]}>
          Tareas Completadas
        </Text>
        <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
          {archivedTasks.length > 0
            ? `📊 ${archivedTasks.length} tareas archivadas`
            : "🎉 No hay tareas archivadas"}
        </Text>
      </View>

      {archivedTasks.length > 0 && (
        <View style={styles.infoCard}>
          <Text style={[styles.infoText, isDark && styles.infoTextDark]}>
            ⏱️ Las tareas se eliminarán automáticamente después de 2 horas
          </Text>
        </View>
      )}

      <FlatList
        data={archivedTasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🎯</Text>
            <Text style={styles.emptyListText}>No hay tareas completadas</Text>
            <Text style={styles.emptySubText}>
              ¡Completa algunas tareas para verlas aquí!
            </Text>
          </View>
        )}
        renderItem={({ item }) => {
          const timeLeftPercent = getTimeLeftPercentage(item.archivedAt);
          const isExpiring = timeLeftPercent > 70;

          return (
            <Animated.View
              style={[
                styles.taskCardWrapper,
                selectedId === item.id && {
                  transform: [{ scale: scaleValue }],
                },
              ]}
            >
              <LinearGradient
                colors={
                  isDark ? ["#2d2d44", "#1e1e32"] : ["#ffffff", "#f8f9ff"]
                }
                style={[styles.taskCard, isExpiring && styles.taskCardExpiring]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.taskContent}>
                  <View style={styles.taskHeader}>
                    <Text
                      style={[
                        styles.taskText,
                        isDark && styles.taskTextDark,
                        isExpiring && styles.taskTextExpiring,
                      ]}
                      numberOfLines={2}
                    >
                      {item.text}
                    </Text>
                    <View style={styles.taskBadges}>
                      <View style={[styles.badge, styles.categoryBadge]}>
                        <Text style={styles.badgeText}>📂 {item.category}</Text>
                      </View>
                      <View style={[styles.badge, styles.completedBadge]}>
                        <Text style={styles.badgeText}>✅ Completada</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.taskFooter}>
                    <View style={styles.taskDates}>
                      <Text
                        style={[styles.taskDate, isDark && styles.taskDateDark]}
                      >
                        📅 Creada: {formatDate(item.createdAt)}
                      </Text>
                      {item.archivedAt && (
                        <Text
                          style={[
                            styles.taskDate,
                            isDark && styles.taskDateDark,
                            isExpiring && styles.taskDateExpiring,
                          ]}
                        >
                          {timeLeft(item.archivedAt)}
                        </Text>
                      )}
                    </View>

                    <View style={styles.progressContainer}>
                      <View style={styles.timeProgressBackground}>
                        <View
                          style={[
                            styles.timeProgressFill,
                            { width: `${timeLeftPercent}%` },
                            isExpiring && styles.timeProgressExpiring,
                          ]}
                        />
                      </View>
                      <Text
                        style={[
                          styles.timeProgressText,
                          isExpiring && styles.timeProgressTextExpiring,
                        ]}
                      >
                        {Math.round(100 - timeLeftPercent)}% tiempo restante
                      </Text>
                    </View>
                  </View>
                </View>

                <Touchable
                  style={[
                    styles.deleteButton,
                    isExpiring ? styles.deleteButtonExpiring : undefined,
                    isDark ? styles.deleteButtonDark : undefined,
                  ]}
                  onPress={() => handleDelete(item.id)}
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                >
                  <Text style={styles.deleteButtonText}>🗑️</Text>
                </Touchable>
              </LinearGradient>
            </Animated.View>
          );
        }}
      />

      {archivedTasks.length > 0 && (
        <Touchable
          style={styles.clearAllButton}
          onPress={() => {
            // Limpiar todas las tareas archivadas
            archivedTasks.forEach((task) => deleteArchivedTask(task.id));
          }}
        >
          <LinearGradient
            colors={["#f093fb", "#f5576c"]}
            style={styles.clearAllGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.clearAllText}>🗑️ Limpiar Todo</Text>
          </LinearGradient>
        </Touchable>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:
      Platform.OS === "android" ? (StatusBar.currentHeight ?? 24) + 20 : 60,
  },
  headerSection: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    alignItems: "center",
  },
  headerEmoji: {
    fontSize: 48,
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  titleDark: {
    color: "#fff",
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    marginTop: 4,
  },
  subtitleDark: {
    color: "rgba(255,255,255,0.5)",
  },
  infoCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  infoText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 13,
    textAlign: "center",
    fontWeight: "500",
  },
  infoTextDark: {
    color: "rgba(255,255,255,0.8)",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  taskCardWrapper: {
    marginBottom: 12,
  },
  taskCard: {
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 18,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  taskCardExpiring: {
    borderWidth: 2,
    borderColor: "#ff6b6b",
  },
  taskContent: {
    flex: 1,
  },
  taskHeader: {
    flex: 1,
    marginBottom: 10,
  },
  taskText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  taskTextDark: {
    color: "#fff",
  },
  taskTextExpiring: {
    color: "#ff6b6b",
  },
  taskBadges: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 8,
    marginBottom: 10,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.08)",
  },
  categoryBadge: {
    backgroundColor: "rgba(102, 126, 234, 0.15)",
  },
  completedBadge: {
    backgroundColor: "rgba(74, 222, 128, 0.15)",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#555",
  },
  taskFooter: {
    marginTop: 8,
  },
  taskDates: {
    flexDirection: "column",
    justifyContent: "flex-start",
    marginBottom: 10,
    gap: 6,
  },
  taskDate: {
    fontSize: 12,
    color: "#888",
  },
  taskDateDark: {
    color: "#aaa",
  },
  taskDateExpiring: {
    color: "#ff6b6b",
    fontWeight: "bold",
  },
  progressContainer: {
    gap: 4,
  },
  timeProgressBackground: {
    height: 4,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 4,
    overflow: "hidden",
  },
  timeProgressFill: {
    height: "100%",
    backgroundColor: "#667eea",
    borderRadius: 4,
  },
  timeProgressExpiring: {
    backgroundColor: "#ff6b6b",
  },
  timeProgressText: {
    fontSize: 10,
    color: "#999",
    textAlign: "right",
  },
  timeProgressTextExpiring: {
    color: "#ff6b6b",
    fontWeight: "bold",
  },
  deleteButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#ff6b6b",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: 12,
    shadowColor: "#ff6b6b",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  deleteButtonExpiring: {
    backgroundColor: "#ff4444",
    shadowColor: "#ff4444",
  },
  deleteButtonDark: {
    backgroundColor: "#b71c1c",
  },
  deleteButtonText: {
    fontSize: 20,
  },
  clearAllButton: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  clearAllGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  clearAllText: {
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
