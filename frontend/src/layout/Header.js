import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../components/ui/button';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { name: 'Inicio', path: '/' },
    { name: 'Historia', path: '/historia' },
    { name: 'Oferta Académica', path: '/oferta-academica' },
    { name: 'Noticias', path: '/noticias' },
    { name: 'Recursos', path: '/recursos' },
    { name: 'Contacto', path: '/contacto' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 border-b border-slate-200/50">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <GraduationCap className="h-8 w-8 text-blue-700 group-hover:text-blue-800 transition-colors" />
          <span className="font-heading font-bold text-xl sm:text-2xl text-slate-900 group-hover:text-blue-800 transition-colors">
            Colegio Romega
          </span>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-sans font-medium transition-colors hover:text-blue-700 ${
                location.pathname === link.path ? 'text-blue-700' : 'text-slate-600'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Button asChild className="bg-blue-700 hover:bg-blue-800 text-white rounded-full px-6">
            <Link to="/admin/login">Portal Admin</Link>
          </Button>
        </nav>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2 text-slate-600" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 p-4 flex flex-col gap-4">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="text-slate-600 font-medium py-2 border-b border-slate-100 last:border-0 hover:text-blue-700"
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
