export type Category = "Personal" | "Escuela" | "Trabajo";
export type Priority = "Alta" | "Media" | "Baja";

export type Task = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  archivedAt?: string;
  category: Category;
  priority: Priority;
};

export const CATEGORIES: Category[] = ["Personal", "Escuela", "Trabajo"];
export const PRIORITIES: { value: Priority; label: string }[] = [
  { value: "Alta", label: "🔴 Alta" },
  { value: "Media", label: "🟡 Media" },
  { value: "Baja", label: "🟢 Baja" },
];

export const STORAGE_KEY = "@tasks_v2";
