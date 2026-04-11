import React from 'react';
import { Target, Flag, Shield, History } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 py-20 font-sans">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="font-heading text-5xl md:text-6xl font-extrabold text-slate-900 mb-6">Nuestra Historia</h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">Conoce el origen, los principios y el compromiso del Colegio Técnico Romega con la excelencia educativa y el desarrollo social.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-16 mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
          
          <div className="flex items-start gap-6 mb-12 relative z-10">
            <div className="h-16 w-16 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center shrink-0">
              <History className="h-8 w-8" />
            </div>
            <div>
              <h2 className="font-heading text-3xl font-bold text-slate-900 mb-4">Reseña Histórica</h2>
              <p className="text-slate-600 leading-loose text-lg text-justify">
                El Colegio Técnico Romega, fundado con el firme propósito de brindar educación de calidad en la región, se ha consolidado como un referente académico en el barrio San Miguel, Girardot. Desde sus inicios, nuestra institución ha enfocado sus esfuerzos en formar jóvenes íntegros, brindándoles no solo conocimientos teóricos sólidos sino también herramientas técnicas y habilidades prácticas para enfrentar los desafíos del mundo moderno.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
            <div className="flex flex-col">
              <div className="flex items-center gap-4 mb-4">
                <Target className="h-8 w-8 text-indigo-600" />
                <h3 className="font-heading text-2xl font-bold text-slate-900">Misión</h3>
              </div>
              <p className="text-slate-600 leading-relaxed text-lg bg-indigo-50/50 p-6 rounded-xl border border-indigo-100 flex-1">
                Proporcionar una educación integral de alta calidad, fundamentada en valores éticos, morales y técnicos, desarrollando en nuestros estudiantes el pensamiento crítico, la creatividad y la capacidad para liderar procesos de transformación social y tecnológica.
              </p>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-4 mb-4">
                <Flag className="h-8 w-8 text-emerald-600" />
                <h3 className="font-heading text-2xl font-bold text-slate-900">Visión</h3>
              </div>
              <p className="text-slate-600 leading-relaxed text-lg bg-emerald-50/50 p-6 rounded-xl border border-emerald-100 flex-1">
                Ser reconocidos a nivel regional y nacional como la institución educativa líder en formación técnica e innovación, destacada por la excelencia de sus egresados, su compromiso con el medio ambiente y su constante evolución pedagógica para el año 2030.
              </p>
            </div>
          </div>
        </div>

        {/* Valores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:-translate-y-2 transition-transform">
            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-6" />
            <h4 className="font-heading text-xl font-bold text-slate-900 mb-3">Excelencia</h4>
            <p className="text-slate-600">Buscamos siempre el más alto nivel en nuestros procesos académicos y formativos.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:-translate-y-2 transition-transform">
            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-6" />
            <h4 className="font-heading text-xl font-bold text-slate-900 mb-3">Responsabilidad</h4>
            <p className="text-slate-600">Fomentamos el compromiso individual y colectivo con la sociedad y el entorno.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:-translate-y-2 transition-transform">
            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-6" />
            <h4 className="font-heading text-xl font-bold text-slate-900 mb-3">Respeto</h4>
            <p className="text-slate-600">Valoramos la diversidad y promovemos un ambiente de convivencia armónica.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
