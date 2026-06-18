import { TasksProvider } from "@/context/tasks-context";
import { ThemeProvider, useTheme } from "@/context/theme-context";
import { TabList, Tabs, TabSlot, TabTrigger } from "expo-router/ui";
import React from "react";
import { StyleSheet, Text } from "react-native";

export default function Layout() {
  return (
    <ThemeProvider>
      <TasksProvider>
        <Tabs>
          <TabSlot />
          <TabList style={styles.tabList}>
            <TabTrigger name="index" href="/">
              <TabLabel>Inicio</TabLabel>
            </TabTrigger>
            <TabTrigger name="create" href="/create">
              <TabLabel>Crear tarea</TabLabel>
            </TabTrigger>
            <TabTrigger name="archived" href="/archived">
              <TabLabel>Completadas</TabLabel>
            </TabTrigger>
          </TabList>
        </Tabs>
      </TasksProvider>
    </ThemeProvider>
  );
}

function TabLabel({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <Text style={[styles.tabText, theme === "dark" && styles.tabTextDark]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  tabList: {
    paddingVertical: 10,
  },
  tabText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
  tabTextDark: { color: "#fff" },
});
