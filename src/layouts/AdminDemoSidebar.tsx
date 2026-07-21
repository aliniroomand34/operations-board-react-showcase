import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import {
  adminDemoNavItems,
  type AdminNavItem,
  type AdminNavMode,
} from "@/layouts/adminDemoNav";

const SIDEBAR_COLLAPSED_KEY = "admin-demo-sidebar-collapsed";

function navBadgeClass(mode: AdminNavMode) {
  return mode === "demo"
    ? "border-[var(--border-info)]/50 bg-[var(--bg-info)]/35 text-[var(--fg-info)]"
    : "border-[var(--border-muted)]/50 bg-black/55 text-[var(--gray-800)]";
}

function NavModeBadge({ mode }: { mode: AdminNavMode }) {
  return (
    <span
      className={`admin-nav-mode-badge shrink-0 ${navBadgeClass(mode)}`}
      aria-label={mode === "demo" ? "Interactive demo" : "Stub route"}
    >
      {mode === "demo" ? "Demo" : "Stub"}
    </span>
  );
}

function SidebarLink({
  item,
  collapsed,
  onNavigate,
}: {
  item: AdminNavItem;
  collapsed: boolean;
  onNavigate: () => void;
}) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      title={item.label}
      onClick={onNavigate}
      className={({ isActive }) =>
        [
          "admin-sidebar-link",
          collapsed ? "admin-sidebar-link--collapsed" : "",
          isActive ? "admin-sidebar-link--active" : "",
        ].join(" ")
      }
    >
      <span className="relative shrink-0">
        <Icon size={20} aria-hidden="true" />
        {item.badge != null && item.badge > 0 ? (
          <span className="admin-sidebar-alert-badge">{item.badge}</span>
        ) : null}
      </span>
      {!collapsed ? (
        <>
          <span className="min-w-0 flex-1 truncate">{item.label}</span>
          <NavModeBadge mode={item.mode} />
        </>
      ) : null}
    </NavLink>
  );
}

export default function AdminDemoSidebar() {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true";
  });

  useEffect(() => {
    window.localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(collapsed));
  }, [collapsed]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <button
        type="button"
        className="admin-mobile-menu-btn"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={mobileOpen}
      >
        <FaBars size={20} aria-hidden="true" />
      </button>

      {mobileOpen ? (
        <button
          type="button"
          className="admin-sidebar-backdrop"
          aria-label="Close navigation menu"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <aside
        className={[
          "admin-sidebar",
          mobileOpen ? "admin-sidebar--open" : "",
          collapsed ? "admin-sidebar--collapsed" : "",
        ].join(" ")}
        aria-label="Admin demo navigation"
      >
        <div className="admin-sidebar-head">
          {!collapsed ? (
            <div className="min-w-0">
              <p className="admin-sidebar-welcome">Ops Console Demo</p>
              <p className="admin-sidebar-welcome-sub">Portfolio operator shell</p>
            </div>
          ) : null}
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="admin-sidebar-collapse-btn hidden md:inline-flex"
              onClick={() => setCollapsed((value) => !value)}
              aria-expanded={!collapsed}
              aria-label={collapsed ? "Expand sidebar labels" : "Collapse sidebar labels"}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <FaAngleDoubleRight size={16} aria-hidden="true" />
              ) : (
                <FaAngleDoubleLeft size={16} aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              className="admin-sidebar-close-btn md:hidden"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation menu"
            >
              <FaTimes size={18} aria-hidden="true" />
            </button>
          </div>
        </div>

        <nav className="admin-sidebar-nav">
          {adminDemoNavItems.map((item) => (
            <SidebarLink
              key={item.to}
              item={item}
              collapsed={collapsed}
              onNavigate={() => setMobileOpen(false)}
            />
          ))}
        </nav>
      </aside>
    </>
  );
}
