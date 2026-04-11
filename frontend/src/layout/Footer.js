import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, MapPin, Mail, Phone, Facebook, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white py-20">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <Link to="/" className="flex items-center gap-2 mb-6">
            <GraduationCap className="h-10 w-10 text-blue-400" />
            <span className="font-heading font-bold text-3xl">Colegio Técnico Romega</span>
          </Link>
          <p className="text-slate-400 max-w-sm leading-relaxed mb-8">
            Formando líderes del mañana con excelencia académica, valores y compromiso social.
          </p>
          <div className="flex gap-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition-all">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-pink-600 hover:border-pink-600 transition-all">
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
        
        <div>
          <h3 className="font-heading font-semibold text-xl mb-6 text-slate-100">Enlaces Rápidos</h3>
          <ul className="space-y-4">
            <li><Link to="/historia" className="text-slate-400 hover:text-blue-400 transition-colors">Historia</Link></li>
            <li><Link to="/oferta-academica" className="text-slate-400 hover:text-blue-400 transition-colors">Oferta Académica</Link></li>
            <li><Link to="/noticias" className="text-slate-400 hover:text-blue-400 transition-colors">Noticias y Actividades</Link></li>
            <li><Link to="/recursos" className="text-slate-400 hover:text-blue-400 transition-colors">Recursos</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-heading font-semibold text-xl mb-6 text-slate-100">Contacto</h3>
          <ul className="space-y-4 text-slate-400">
            <li className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-blue-400 shrink-0" />
              <span>Carrera 8 #14-61, barrio San Miguel, Girardot</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-blue-400 shrink-0" />
              <span>+57 123 456 7890</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-blue-400 shrink-0" />
              <span>contacto@colegioromega.edu.co</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-16 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} Colegio Técnico Romega. Todos los derechos reservados.
      </div>
    </footer>
  );
}
