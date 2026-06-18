import Touchable from "@/components/touchable";
import { useTasks } from "@/context/tasks-context";
import { useTheme } from "@/context/theme-context";
import { CATEGORIES, PRIORITIES } from "@/types";
import { scheduleExampleReminder } from "@/utils/notifications";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export default function CreateTaskScreen() {
  const router = useRouter();
  const { addTask } = useTasks();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [text, setText] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [priority, setPriority] = useState(PRIORITIES[1].value);

  const handleSave = () => {
    if (text.trim() === "") {
      return;
    }

    addTask({ text, category, priority });
    router.push("/");
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Text style={[styles.title, isDark && styles.titleDark]}>
        Nueva tarea
      </Text>

      <TextInput
        style={[styles.input, isDark && styles.inputDark]}
        placeholder="Describe tu tarea"
        placeholderTextColor={isDark ? "#bbb" : "#888"}
        value={text}
        onChangeText={setText}
      />

      <Text style={styles.label}>Categoría</Text>
      <View style={styles.selectorRow}>
        {CATEGORIES.map((item) => (
          <Touchable
            key={item}
            style={
              [
                styles.selectorButton,
                category === item ? styles.selectorButtonSelected : undefined,
                isDark ? styles.selectorButtonDark : undefined,
                isDark && category === item
                  ? styles.selectorButtonSelectedDark
                  : undefined,
              ] as any
            }
            onPress={() => setCategory(item)}
          >
            <Text
              style={[
                styles.selectorText,
                category === item ? styles.selectorTextSelected : undefined,
                isDark ? styles.selectorTextDark : undefined,
                isDark && category === item
                  ? styles.selectorTextSelectedDark
                  : undefined,
              ]}
            >
              {item}
            </Text>
          </Touchable>
        ))}
      </View>

      <Text style={styles.label}>Prioridad</Text>
      <View style={styles.selectorRow}>
        {PRIORITIES.map((item) => (
          <Touchable
            key={item.value}
            style={
              [
                styles.selectorButton,
                priority === item.value
                  ? styles.selectorButtonSelected
                  : undefined,
              ] as any
            }
            onPress={() => setPriority(item.value)}
          >
            <Text
              style={[
                styles.selectorText,
                priority === item.value
                  ? styles.selectorTextSelected
                  : undefined,
              ]}
            >
              {item.label}
            </Text>
          </Touchable>
        ))}
      </View>

      <Touchable
        style={
          [styles.addButton, isDark ? styles.addButtonDark : undefined] as any
        }
        onPress={handleSave}
      >
        <Text style={styles.buttonText}>Guardar</Text>
      </Touchable>

      <Touchable
        style={[styles.addButton, { backgroundColor: "#4CAF50", marginTop: 8 }]}
        onPress={async () => {
          try {
            await scheduleExampleReminder();
            alert("Recordatorio programado para las 20:00");
          } catch (e) {
            alert("No se pudo programar la notificación. Revisa permisos.");
          }
        }}
      >
        <Text style={styles.buttonText}>Programar recordatorio 20:00</Text>
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
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "600",
  },
  selectorRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 15,
  },
  selectorButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  selectorButtonSelected: {
    backgroundColor: "#2196F3",
    borderColor: "#1976D2",
  },
  selectorText: {
    color: "#333",
    textAlign: "center",
    fontWeight: "600",
  },
  selectorTextSelected: {
    color: "#fff",
  },
  addButton: {
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  /* Dark variants */
  containerDark: { backgroundColor: "#121212" },
  titleDark: { color: "#fff" },
  inputDark: { backgroundColor: "#222", color: "#fff", borderColor: "#333" },
  selectorButtonDark: { backgroundColor: "#1e1e1e", borderColor: "#333" },
  selectorButtonSelectedDark: {
    backgroundColor: "#1976D2",
    borderColor: "#0d47a1",
  },
  selectorTextDark: { color: "#ddd" },
  selectorTextSelectedDark: { color: "#fff" },
  addButtonDark: { backgroundColor: "#1565C0" },
});
