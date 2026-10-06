import {
  BookOpen,
  Car,
  Dumbbell,
  Home,
  ShoppingBasket,
  Smartphone,
  Sparkles,
  Shirt,
  type LucideIcon,
} from "lucide-react";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  electronics: Smartphone,
  fashion: Shirt,
  home: Home,
  beauty: Sparkles,
  sports: Dumbbell,
  grocery: ShoppingBasket,
  automotive: Car,
  books: BookOpen,
};
