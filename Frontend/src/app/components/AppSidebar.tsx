import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Upload,
  Users,
  Target,
  GitCompare,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "./ui/utils";

const navItems = [
  { path: "/overview", icon: LayoutDashboard, label: "Overview" },
  { path: "/upload", icon: Upload, label: "Upload & Parse" },
  { path: "/repository", icon: Users, label: "Candidate Repository" },
  { path: "/matching", icon: Target, label: "Talent–Role Matching" },
  { path: "/comparison", icon: GitCompare, label: "Resume Comparison" },
];

interface AppSidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export function AppSidebar({ isOpen, onClose }: AppSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/auth", { replace: true });
    onClose?.();
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-800/80 bg-[#050816] text-slate-100 transition-transform duration-200",
        // desktop: always visible
        "md:static md:translate-x-0",
        // mobile: slide in/out (only affects < md)
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}
    >
      {/* subtle inner glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.3),_transparent_60%)]" />

      {/* mobile close button */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="md:hidden absolute right-3 top-3 z-50 rounded-full border border-slate-700 bg-slate-900/90 p-1.5 text-slate-300"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {/* Header */}
      <div className="relative flex items-center gap-3 border-b border-slate-800/80 px-5 py-4 pt-5 md:pt-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-400 shadow-lg shadow-purple-500/30">
          <span className="text-sm font-semibold tracking-tight">ATS</span>
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-slate-50">
            ATS Platform
          </h1>
          <p className="text-xs text-slate-400">Intelligent recruiting</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="relative flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all",
                "border border-transparent",
                isActive
                  ? "bg-gradient-to-r from-purple-600/90 to-indigo-500/90 text-white shadow-md shadow-purple-500/40 border-purple-400/70"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/70 hover:border-slate-700"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 text-slate-400 transition-transform duration-150",
                  "group-hover:scale-105 group-hover:text-slate-50"
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer with Logout */}
      <div className="relative border-t border-slate-800/80 px-5 py-3">
        <button
          onClick={handleLogout}
          className="mb-2 flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-slate-400 hover:bg-slate-800/80 hover:text-slate-100 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>

        <p className="text-[11px] text-slate-500">
          © 2025 ATS Platform by Sanjana
        </p>
      </div>
    </aside>
  );
}
