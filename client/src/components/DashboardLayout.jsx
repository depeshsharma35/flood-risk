import { Menu, X, Home, BarChart3, Database, Brain, Map as MapIcon } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import StormEffect, { SidebarTrees } from './StormEffect';

export default function DashboardLayout({ children, stormIntense = false }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();

  const navItems = [
    { href: '/',           label: 'Dashboard',     icon: Home     },
    { href: '/map',        label: 'Flood Map',      icon: MapIcon  },
    { href: '/analytics',  label: 'Risk Analytics', icon: BarChart3},
    { href: '/dataset',    label: 'Dataset',        icon: Database },
    { href: '/prediction', label: 'Prediction',     icon: Brain    },
  ];

  const isActive = (href) => location === href;

  return (
    <div style={{ position: 'relative' }} className="flex h-screen overflow-hidden"
         data-theme="storm">

      {/* ── Permanent storm background ─────────────────────────────────── */}
      <StormEffect intense={stormIntense} />

      {/* ── Sidebar ───────────────────────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          background: 'linear-gradient(180deg, #060d1e 0%, #0a1628 60%, #06111f 100%)',
          borderRight: '1px solid rgba(6,182,212,0.18)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Sidebar tree silhouettes */}
        <SidebarTrees />

        <div className="flex flex-col h-full" style={{ position: 'relative', zIndex: 1 }}>
          {/* Logo / Header */}
          <div className="flex items-center justify-between p-6"
               style={{ borderBottom: '1px solid rgba(6,182,212,0.18)' }}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                   style={{ background: 'linear-gradient(135deg,#0891b2,#06b6d4)' }}>
                <Brain className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-bold" style={{ color: '#e2f8ff' }}>FloodAI</h1>
            </div>
            <button onClick={() => setSidebarOpen(false)}
                    className="lg:hidden p-1 rounded transition-colors"
                    style={{ color: '#94cfe8' }}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon  = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 block"
                  style={active ? {
                    background:  'linear-gradient(90deg,rgba(6,182,212,.22),rgba(6,182,212,.08))',
                    color:       '#38d9f5',
                    fontWeight:  600,
                    borderLeft:  '3px solid #06b6d4',
                  } : {
                    color: '#8ecde8',
                    borderLeft: '3px solid transparent',
                  }}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-6" style={{ borderTop: '1px solid rgba(6,182,212,0.14)' }}>
            <div className="space-y-1" style={{ fontSize: '0.72rem', color: '#6ab0cc' }}>
              <p className="font-semibold" style={{ color: '#9dd6ed' }}>Developers</p>
              <p>Preetinder Singh</p>
              <p>Depesh Sharma</p>
              <p>Diljot Singh</p>
              <p className="pt-2" style={{ color: '#5a96b2' }}>GNDEC Ludhiana</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main content area ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{ position: 'relative', zIndex: 5 }}>
        {/* Top bar */}
        <header style={{
          background:   'rgba(6,10,24,0.82)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(6,182,212,0.20)',
          padding:      '1rem 1.5rem',
          display:      'flex',
          alignItems:   'center',
          justifyContent: 'space-between',
        }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 rounded-lg transition-colors"
                  style={{ color: '#8ecde8' }}>
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-semibold hidden sm:block"
              style={{ color: '#d4f3ff' }}>
            Explainable AI Flood Risk Intelligence System
          </h2>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium" style={{ color: '#d0eefa' }}>India Flood Risk</p>
              <p className="text-xs" style={{ color: '#6ab0cc' }}>Real-time Analysis</p>
            </div>
          </div>
        </header>

        {/* Scrollable content — cards sit above storm via z-index */}
        <main className="flex-1 overflow-auto" style={{ position: 'relative', zIndex: 10 }}>
          <div className="min-h-full">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden"
             style={{ background: 'rgba(0,0,0,0.6)' }}
             onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
