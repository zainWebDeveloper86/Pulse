import {
  Home,
  Search,
  Heart,
  SquarePen,
  Users,
  User,
  UserPlus,
  FileText,
  MessageCircle,
  ThumbsUp,
} from "lucide-react";

export const sidebarLinks = [
  { icon: Home, route: "/", label: "Home" },
  { icon: Search, route: "/search", label: "Search" },
  { icon: Heart, route: "/activity", label: "Activity" },
  { icon: SquarePen, route: "/create", label: "Create" },
  { icon: Users, route: "/communities", label: "Communities" },
  { icon: User, route: "/profile", label: "Profile" },
];

export const profileTabs = [
  { value: "pulses", label: "Pulses", icon: FileText },
  { value: "replies", label: "Replies", icon: MessageCircle },
  { value: "liked", label: "Liked", icon: ThumbsUp },
];

export const communityTabs = [
  { value: "pulses", label: "Pulses", icon: FileText },
  { value: "members", label: "Members", icon: Users },
  { value: "requests", label: "Requests", icon: UserPlus },
];
