import React from 'react';
import { BookOpen, Laptop, Microscope, Briefcase } from 'lucide-react';

export default function Academics() {
  const programs = [
    {
      title: "Educación Básica Secundaria",
      desc: "Brindamos una formación sólida en áreas fundamentales, fomentando el análisis, la comprensión lectora, y las habilidades matemáticas básicas que preparan al estudiante para los desafíos de la educación media.",
      icon: BookOpen,
      color: "text-blue-600",
      bg: "bg-blue-100"
    },
    {
      title: "Media Técnica Comercial",
      desc: "Programa especializado que dota a los estudiantes de herramientas contables, administrativas y financieras, preparándolos para el entorno laboral o la educación superior en ciencias económicas.",
      icon: Briefcase,
      color: "text-indigo-600",
      bg: "bg-indigo-100"
    },
    {
      title: "Media Técnica en Sistemas",
      desc: "Enfoque en el desarrollo de software, mantenimiento de hardware y redes, entregando competencias tecnológicas altamente demandadas en el mercado laboral contemporáneo.",
      icon: Laptop,
      color: "text-sky-600",
      bg: "bg-sky-100"
    },
    {
      title: "Laboratorios y Prácticas",
      desc: "Instalaciones modernas equipadas para realizar prácticas de física, química y tecnología, garantizando que el aprendizaje sea interactivo y experimental.",
      icon: Microscope,
      color: "text-emerald-600",
      bg: "bg-emerald-100"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-slate-950 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
           <img src="https://images.unsplash.com/photo-1758270704524-596810e891b5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODl8MHwxfHNlYXJjaHwzfHxzdHVkZW50cyUyMHN0dWR5aW5nJTIwaW4lMjBjbGFzc3Jvb218ZW58MHx8fHwxNzc1OTM4ODk3fDA&ixlib=rb-4.1.0&q=85" alt="Background" className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="font-heading text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">Oferta Académica</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Formación integral, técnica y humana diseñada para construir los pilares del éxito profesional.
          </p>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="py-24 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          <div className="md:col-span-8 bg-slate-50 p-10 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-shadow">
            <div className="h-14 w-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <BookOpen className="h-7 w-7 text-blue-700" />
            </div>
            <h2 className="font-heading text-3xl font-bold text-slate-900 mb-4">Un Enfoque Educativo Único</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              En el Colegio Técnico Romega, no solo nos enfocamos en el currículo tradicional, sino que integramos competencias técnicas que permiten a los estudiantes obtener certificaciones laborales mientras culminan su bachillerato. Creemos en el principio de "Aprender Haciendo", asegurando que la teoría siempre se respalde con aplicación práctica.
            </p>
          </div>
          
          <div className="md:col-span-4 bg-slate-900 text-white p-10 rounded-3xl shadow-xl flex flex-col justify-center">
            <h3 className="font-heading text-2xl font-bold mb-4">Beneficios</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                <span className="text-slate-300">Certificación técnica</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                <span className="text-slate-300">Prácticas empresariales</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                <span className="text-slate-300">Orientación vocacional</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                <span className="text-slate-300">Acompañamiento psicológico</span>
              </li>
            </ul>
          </div>

          {programs.map((p, idx) => (
            <div key={idx} className="md:col-span-6 bg-white border border-slate-200 p-8 rounded-3xl hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group">
              <div className={`h-16 w-16 ${p.bg} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                <p.icon className={`h-8 w-8 ${p.color}`} />
              </div>
              <h3 className="font-heading text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-700 transition-colors">{p.title}</h3>
              <p className="text-slate-600 leading-relaxed">{p.desc}</p>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
