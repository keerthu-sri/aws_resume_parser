import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import { Menu } from "lucide-react";

import { AppSidebar } from "./components/AppSidebar";
import { Overview } from "./pages/Overview";
import { Upload } from "./pages/Upload";
import { Repository } from "./pages/Repository";
import { Matching } from "./pages/Matching";
import { Comparison } from "./pages/Comparison";
import { LoginPage } from "./pages/LoginPage";

function AppShell() {
  const location = useLocation();
  const isAuth = location.pathname === "/auth";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dark flex h-screen bg-[#020617] text-slate-100">
      {!isAuth && (
        <>
          <AppSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          {/* overlay on mobile */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-20 bg-black/60 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </>
      )}

      <main className="relative flex-1 overflow-y-auto bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900">
        {/* mobile top bar with menu when logged in */}
        {!isAuth && (
          <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between border-b border-slate-800 bg-[#020617]/95 px-4 py-3 md:hidden">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-full border border-slate-700 bg-slate-900/70 p-2 text-slate-100"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              ATS Platform
            </span>
          </header>
        )}

        <div className={!isAuth ? "pt-14 md:pt-0" : ""}>
          <Routes>
            {/* LOGIN */}
            <Route path="/auth" element={<LoginPage />} />

            {/* APP PAGES */}
            {!isAuth && (
              <>
                <Route path="/overview" element={<Overview />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/repository" element={<Repository />} />
                <Route path="/matching" element={<Matching />} />
                <Route path="/comparison" element={<Comparison />} />
              </>
            )}

            {/* ROOT -> login */}
            <Route path="/" element={<Navigate to="/auth" replace />} />

            {/* unknown -> login */}
            <Route path="*" element={<Navigate to="/auth" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
