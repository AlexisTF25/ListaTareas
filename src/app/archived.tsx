import Touchable from "@/components/touchable";
import { useTasks } from "@/context/tasks-context";
import { useTheme } from "@/context/theme-context";
import { formatDate } from "@/utils/date";
import {
    FlatList,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";

function timeLeft(iso?: string) {
  if (!iso) return "";
  const CLEAN_MS = 2 * 60 * 60 * 1000;
  const left = CLEAN_MS - (Date.now() - new Date(iso).getTime());
  if (left <= 0) return "Se eliminará pronto";
  const minutes = Math.floor(left / 60000);
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

export default function ArchivedScreen() {
  const { archivedTasks, deleteArchivedTask } = useTasks();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Text style={[styles.title, isDark && styles.titleDark]}>
        Tareas Completadas (Archivadas)
      </Text>

      <FlatList
        data={archivedTasks}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => (
          <Text style={styles.emptyListText}>No hay tareas completadas</Text>
        )}
        renderItem={({ item }) => (
          <View
            style={[styles.taskContainer, isDark && styles.taskContainerDark]}
          >
            <View style={styles.taskTextContainer}>
              <Text style={[styles.taskText, isDark && styles.taskTextDark]}>
                {item.text}
              </Text>
              <Text style={[styles.taskDate, isDark && styles.taskDateDark]}>
                {formatDate(item.createdAt)}
              </Text>
              <Text style={[styles.taskDate, isDark && styles.taskDateDark]}>
                Archivada: {timeLeft(item.archivedAt)}
              </Text>
            </View>

            <Touchable
              style={
                [
                  styles.deleteButton,
                  isDark ? styles.deleteButtonDark : undefined,
                ] as any
              }
              onPress={() => deleteArchivedTask(item.id)}
            >
              <Text style={styles.buttonText}>Eliminar</Text>
            </Touchable>
          </View>
        )}
      />
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
  title: { fontSize: 22, fontWeight: "600", marginBottom: 12 },
  taskContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    padding: 14,
    marginBottom: 10,
    borderRadius: 10,
  },
  taskTextContainer: { maxWidth: "78%" },
  taskText: { fontSize: 16 },
  taskDate: { fontSize: 12, color: "#666", marginTop: 4 },
  deleteButton: { backgroundColor: "#d32f2f", padding: 8, borderRadius: 6 },
  buttonText: { color: "#fff", fontWeight: "600" },
  emptyListText: { textAlign: "center", color: "#888", marginTop: 30 },
  /* dark */
  containerDark: { backgroundColor: "#121212" },
  titleDark: { color: "#fff" },
  taskContainerDark: { backgroundColor: "#1e1e1e" },
  taskTextDark: { color: "#fff" },
  taskDateDark: { color: "#bbb" },
  deleteButtonDark: { backgroundColor: "#b71c1c" },
});
