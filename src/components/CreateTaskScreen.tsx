import Touchable from "@/components/touchable";
import { CATEGORIES, Category, PRIORITIES, Priority } from "@/types";
import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState } from "react";
import {
    Animated,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

type CreateTaskScreenProps = {
  theme: "light" | "dark";
  onSaveTask: (task: {
    text: string;
    category: Category;
    priority: Priority;
  }) => void;
  onScheduleReminder: () => Promise<void>;
};

export default function CreateTaskScreen({
  theme,
  onSaveTask,
  onScheduleReminder,
}: CreateTaskScreenProps) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState<Category>(CATEGORIES[0]);
  const [priority, setPriority] = useState<Priority>(PRIORITIES[1].value);
  const [isFocused, setIsFocused] = useState(false);

  const isDark = theme === "dark";
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

  const handleSave = () => {
    if (text.trim() === "") {
      // Animar el input para mostrar error
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.02,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 0.98,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    onSaveTask({ text, category, priority });
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.headerSection}>
          <Text style={styles.headerEmoji}>✨</Text>
          <Text style={[styles.title, isDark && styles.titleDark]}>
            Nueva Tarea
          </Text>
          <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
            Organiza tus tareas de manera eficiente
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.inputSection}>
            <Text style={[styles.label, isDark && styles.labelDark]}>
              📝 Descripción
            </Text>
            <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
              <TextInput
                style={[
                  styles.input,
                  isDark && styles.inputDark,
                  isFocused && styles.inputFocused,
                  isDark && isFocused && styles.inputFocusedDark,
                ]}
                placeholder="¿Qué tarea necesitas realizar?"
                placeholderTextColor={isDark ? "#888" : "#999"}
                value={text}
                onChangeText={setText}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </Animated.View>
            {text.length > 0 && (
              <Text style={styles.charCount}>{text.length} caracteres</Text>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={[styles.label, isDark && styles.labelDark]}>
              📂 Categoría
            </Text>
            <View style={styles.selectorRow}>
              {CATEGORIES.map((item) => (
                <Touchable
                  key={item}
                  style={[
                    styles.selectorButton,
                    category === item
                      ? styles.selectorButtonSelected
                      : undefined,
                    isDark ? styles.selectorButtonDark : undefined,
                    isDark && category === item
                      ? styles.selectorButtonSelectedDark
                      : undefined,
                  ]}
                  onPress={() => setCategory(item)}
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                >
                  <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
                    <Text
                      style={[
                        styles.selectorText,
                        category === item
                          ? styles.selectorTextSelected
                          : undefined,
                        isDark ? styles.selectorTextDark : undefined,
                        isDark && category === item
                          ? styles.selectorTextSelectedDark
                          : undefined,
                      ]}
                    >
                      {item}
                    </Text>
                  </Animated.View>
                </Touchable>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, isDark && styles.labelDark]}>
              ⚡ Prioridad
            </Text>
            <View style={styles.selectorRow}>
              {PRIORITIES.map((item) => {
                const isSelected = priority === item.value;
                return (
                  <Touchable
                    key={item.value}
                    style={[
                      styles.priorityButton,
                      isSelected ? styles.priorityButtonSelected : undefined,
                      item.value === "Alta" && isSelected
                        ? styles.priorityHigh
                        : undefined,
                      item.value === "Media" && isSelected
                        ? styles.priorityMedium
                        : undefined,
                      item.value === "Baja" && isSelected
                        ? styles.priorityLow
                        : undefined,
                      isDark ? styles.priorityButtonDark : undefined,
                    ]}
                    onPress={() => setPriority(item.value)}
                  >
                    <Text
                      style={[
                        styles.priorityText,
                        isSelected ? styles.priorityTextSelected : undefined,
                        isDark ? styles.priorityTextDark : undefined,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </Touchable>
                );
              })}
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Touchable
              style={[styles.addButton, isDark && styles.addButtonDark]}
              onPress={handleSave}
            >
              <LinearGradient
                colors={["#667eea", "#764ba2"]}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.buttonText}>✅ Guardar Tarea</Text>
              </LinearGradient>
            </Touchable>

            <Touchable
              style={[styles.addButton, styles.reminderButton]}
              onPress={onScheduleReminder}
            >
              <LinearGradient
                colors={["#f093fb", "#f5576c"]}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.buttonText}>⏰ Programar Recordatorio</Text>
              </LinearGradient>
            </Touchable>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:
      Platform.OS === "android" ? (StatusBar.currentHeight ?? 24) + 20 : 60,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  headerEmoji: {
    fontSize: 48,
    marginBottom: 8,
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
  card: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  inputSection: {
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginBottom: 10,
  },
  labelDark: {
    color: "#888",
  },
  input: {
    backgroundColor: "#f8f9fa",
    borderWidth: 2,
    borderColor: "#e0e0e0",
    padding: 14,
    borderRadius: 14,
    fontSize: 16,
    color: "#333",
    minHeight: 80,
  },
  inputFocused: {
    borderColor: "#667eea",
    backgroundColor: "#fff",
  },
  inputFocusedDark: {
    borderColor: "#764ba2",
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  inputDark: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: "#333",
    color: "#fff",
  },
  charCount: {
    fontSize: 12,
    color: "#999",
    marginTop: 6,
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 16,
  },
  section: {
    marginBottom: 8,
  },
  selectorRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
  },
  selectorButton: {
    flexBasis: "30%",
    minWidth: 90,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderRadius: 14,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    justifyContent: "center",
  },
  selectorButtonSelected: {
    backgroundColor: "#667eea",
    borderColor: "#667eea",
  },
  selectorButtonDark: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: "#333",
  },
  selectorButtonSelectedDark: {
    backgroundColor: "#764ba2",
    borderColor: "#764ba2",
  },
  selectorText: {
    color: "#555",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 14,
  },
  selectorTextSelected: {
    color: "#fff",
  },
  selectorTextDark: {
    color: "#aaa",
  },
  selectorTextSelectedDark: {
    color: "#fff",
  },
  priorityButton: {
    flexBasis: "30%",
    minWidth: 90,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderRadius: 14,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    justifyContent: "center",
  },
  priorityButtonSelected: {
    backgroundColor: "#667eea",
    borderColor: "#667eea",
  },
  priorityHigh: {
    backgroundColor: "#ff6b6b",
    borderColor: "#ff6b6b",
  },
  priorityMedium: {
    backgroundColor: "#ffd93d",
    borderColor: "#ffd93d",
  },
  priorityLow: {
    backgroundColor: "#6bcb77",
    borderColor: "#6bcb77",
  },
  priorityButtonDark: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderColor: "#333",
  },
  priorityText: {
    color: "#555",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 14,
  },
  priorityTextSelected: {
    color: "#fff",
  },
  priorityTextDark: {
    color: "#aaa",
  },
  buttonContainer: {
    marginTop: 16,
    flexDirection: "column",
    gap: 12,
  },
  addButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 12,
  },
  addButtonDark: {
    shadowColor: "#000",
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  reminderButton: {
    shadowColor: "#f093fb",
    marginTop: 0,
  },
});
