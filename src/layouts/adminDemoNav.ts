import type { IconType } from "react-icons";
import {
  FaBook,
  FaBoxOpen,
  FaChartLine,
  FaCog,
  FaExclamationTriangle,
  FaFileAlt,
  FaPlug,
  FaRobot,
  FaStore,
  FaTachometerAlt,
  FaUserCircle,
  FaUsers,
  FaUsersCog,
} from "react-icons/fa";

export type AdminNavMode = "demo" | "stub";

export interface AdminNavItem {
  to: string;
  label: string;
  icon: IconType;
  mode: AdminNavMode;
  /** Used by stub routes — panel heading */
  stubTitle?: string;
  /** Optional nav badge (e.g. demo alerts count) */
  badge?: number;
}

export const ADMIN_DEMO_BASE = "/app";

export const adminDemoNavItems: AdminNavItem[] = [
  {
    to: `${ADMIN_DEMO_BASE}/overview`,
    label: "Overview",
    icon: FaTachometerAlt,
    mode: "demo",
  },
  {
    to: `${ADMIN_DEMO_BASE}/accounts`,
    label: "Linked Accounts",
    icon: FaUserCircle,
    mode: "stub",
    stubTitle: "Linked Accounts",
  },
  {
    to: `${ADMIN_DEMO_BASE}/inventory`,
    label: "Inventory Pipeline",
    icon: FaBoxOpen,
    mode: "demo",
  },
  {
    to: `${ADMIN_DEMO_BASE}/extension-sim`,
    label: "Extension Simulator",
    icon: FaPlug,
    mode: "demo",
  },
  {
    to: `${ADMIN_DEMO_BASE}/operations`,
    label: "Operations Board",
    icon: FaStore,
    mode: "demo",
  },
  {
    to: `${ADMIN_DEMO_BASE}/clients`,
    label: "Clients",
    icon: FaUsers,
    mode: "stub",
    stubTitle: "Clients",
  },
  {
    to: `${ADMIN_DEMO_BASE}/settings`,
    label: "Settings",
    icon: FaCog,
    mode: "stub",
    stubTitle: "Settings",
  },
  {
    to: `${ADMIN_DEMO_BASE}/alerts`,
    label: "Alerts",
    icon: FaExclamationTriangle,
    mode: "stub",
    stubTitle: "Alerts",
    badge: 3,
  },
  {
    to: `${ADMIN_DEMO_BASE}/resources`,
    label: "Resources",
    icon: FaBook,
    mode: "stub",
    stubTitle: "Resources",
  },
  {
    to: `${ADMIN_DEMO_BASE}/ai`,
    label: "AI Assistant",
    icon: FaRobot,
    mode: "stub",
    stubTitle: "AI Assistant",
  },
  {
    to: `${ADMIN_DEMO_BASE}/finance`,
    label: "Finance Summary",
    icon: FaChartLine,
    mode: "demo",
  },
  {
    to: `${ADMIN_DEMO_BASE}/team`,
    label: "Team Activity",
    icon: FaUsersCog,
    mode: "demo",
  },
  {
    to: `${ADMIN_DEMO_BASE}/case-study`,
    label: "Case Study",
    icon: FaFileAlt,
    mode: "demo",
  },
];

export const adminDemoStubItems = adminDemoNavItems.filter(
  (item) => item.mode === "stub" && item.stubTitle,
);
