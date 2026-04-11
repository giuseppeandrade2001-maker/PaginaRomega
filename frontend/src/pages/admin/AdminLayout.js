import React, { useEffect } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Newspaper, Files, Mail, LogOut } from 'lucide-react';
import axios from 'axios';

export default function AdminLayout() {
  const { user, loading, setUser } = useAuth();
  const location = useLocation();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  if (!user) return <Navigate to="/admin/login" replace />;

  const handleLogout = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/logout`, {}, { withCredentials: true });
      setUser(null);
    } catch (e) {
      console.error(e);
    }
  };

  const navs = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Noticias', path: '/admin/noticias', icon: Newspaper },
    { name: 'Recursos', path: '/admin/recursos', icon: Files },
    { name: 'Mensajes', path: '/admin/mensajes', icon: Mail },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col shadow-xl z-10">
        <div className="p-6">
          <Link to="/" className="text-white font-heading font-bold text-xl flex items-center gap-2 group hover:text-blue-400 transition-colors">
            CTR Admin
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navs.map((nav) => {
            const Icon = nav.icon;
            const isActive = location.pathname === nav.path;
            return (
              <Link
                key={nav.path}
                to={nav.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                {nav.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 shadow-sm">
          <h1 className="font-heading font-bold text-slate-800 text-xl">Panel de Administración</h1>
        </header>
        <div className="flex-1 overflow-auto p-8 bg-slate-50">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
