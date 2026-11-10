import {
  BookOpen,
  Car,
  Dumbbell,
  Home,
  ShoppingBasket,
  Smartphone,
  Sparkles,
  Shirt,
  type AppIcon,
} from "@/lib/icons";

export const CATEGORY_ICONS: Record<string, AppIcon> = {
  electronics: Smartphone,
  fashion: Shirt,
  home: Home,
  beauty: Sparkles,
  sports: Dumbbell,
  grocery: ShoppingBasket,
  automotive: Car,
  books: BookOpen,
};
