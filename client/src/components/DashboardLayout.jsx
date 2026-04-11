import { Menu, X, Home, BarChart3, Database, Brain, Map as MapIcon } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'wouter';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();

  const navItems = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/map', label: 'Flood Map', icon: MapIcon },
    { href: '/analytics', label: 'Risk Analytics', icon: BarChart3 },
    { href: '/dataset', label: 'Dataset', icon: Database },
    { href: '/prediction', label: 'Prediction', icon: Brain },
  ];

  const isActive = (href) => location === href;

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold text-sidebar-foreground">FloodAI</h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 hover:bg-sidebar-accent rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 block ${
                    active
                      ? 'bg-sidebar-accent text-sidebar-primary font-semibold'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-sidebar-border">
            <div className="text-xs text-sidebar-foreground/60 space-y-1">
              <p className="font-semibold">Developers</p>
              <p>Preetinder Singh</p>
              <p>Depesh Sharma</p>
              <p>Diljot Singh</p>
              <p className="pt-2 text-xs">GNDEC Ludhiana</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between shadow-sm">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-semibold text-foreground hidden sm:block">
            Explainable AI Flood Risk Intelligence System
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground">India Flood Risk</p>
              <p className="text-xs text-muted-foreground">Real-time Analysis</p>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="min-h-full">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
