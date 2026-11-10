"use client";

/**
 * Single source of truth for app icons.
 * Uses @stashicon/icons where an equivalent exists and falls back to
 * lucide-react otherwise. Import icons from here, never from the packages.
 */
import type { ComponentType } from "react";

export type AppIcon = ComponentType<{
  className?: string;
  size?: number | string;
}>;

export {
  DangerTriangle as AlertTriangle,
  ArrowRightUp,
  DoubleAltArrowRight,
  Forward2,
  ForwardArrowsAction,
  RoundArrowLeft,
  VerifiedCheck as BadgeCheck,
  Book as BookOpen,
  Buildings as Building2,
  CalendarDate as CalendarDays,
  Calendar as CalendarIcon,
  Camera,
  AltArrowDown as ChevronDown,
  AltArrowLeft as ChevronLeft,
  AltArrowRight as ChevronRight,
  AltArrowRight as ChevronRightIcon,
  AltArrowUp as ChevronUp,
  ClockCircle as Clock,
  ClockCircle as Clock3,
  Copy,
  Cpu,
  Card as CreditCard,
  Dumbbell,
  Eye,
  EyeClosed as EyeOff,
  FileText,
  Flag2 as Flag,
  HeartAngle as Heart,
  QuestionCircle as HelpCircle,
  Home2 as Home,
  GalleryAdd as ImagePlus,
  Widget2 as LayoutGrid,
  Login as LogIn,
  Logout as LogOut,
  Letter as Mail,
  MapPoint as MapPin,
  Moon,
  MenuDots as MoreHorizontal,
  Box as Package,
  Pen as Pencil,
  Phone,
  Reply,
  Restart as RotateCcw,
  Magnifer as Search,
  Shield,
  TShirt as Shirt,
  Bag5 as ShoppingBag,
  Cart2 as ShoppingBasket,
  SliderHorizontal as SlidersHorizontal,
  Smartphone,
  StarsWeather as Sparkles,
  StarLike as Star,
  Shop as Store,
  Sun,
  TrashBinMinimalistic as Trash2,
  Delivery as Truck,
  UserRounded as UserRound,
  ChefHat as UtensilsCrossed,
  Bolt as Zap,
} from "@stashicon/icons";

export {
  Car,
  Check,
  CheckIcon,
  ImageOff,
  Loader2,
  Minus,
  Plus,
  SearchX,
  X,
  XIcon,
} from "lucide-react";
