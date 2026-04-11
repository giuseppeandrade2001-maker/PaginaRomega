import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Newspaper, Files, Mail, UserCheck } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({ news: 0, resources: 0, messages: 0, admissions: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [newsRes, resRes, msgRes, admRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/news`),
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/resources`),
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/contact-messages`, { withCredentials: true }),
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admissions`, { withCredentials: true })
      ]);
      setStats({
        news: newsRes.data.data.length,
        resources: resRes.data.data.length,
        messages: msgRes.data.data.length,
        admissions: admRes.data.data.length
      });
    } catch (e) {
      console.error(e);
    }
  };

  const cards = [
    { title: 'Noticias', count: stats.news, icon: Newspaper, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Recursos', count: stats.resources, icon: Files, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { title: 'Mensajes', count: stats.messages, icon: Mail, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: 'Admisiones', count: stats.admissions, icon: UserCheck, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  return (
    <div className="space-y-8">
      <h2 className="font-heading text-3xl font-bold text-slate-800">Bienvenido al Dashboard</h2>
      <p className="text-slate-600 max-w-2xl text-lg">Aquí puedes gestionar todo el contenido de la plataforma web del Colegio Técnico Romega, subir recursos académicos, publicar noticias y revisar los mensajes de contacto.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-6 hover:shadow-md transition-shadow">
              <div className={`p-4 rounded-xl ${c.bg}`}>
                <Icon className={`h-8 w-8 ${c.color}`} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{c.title}</p>
                <p className="font-heading text-4xl font-bold text-slate-900 mt-2">{c.count}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
