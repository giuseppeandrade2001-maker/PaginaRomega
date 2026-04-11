import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/news`);
      setNews(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-20 font-sans">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="font-heading text-5xl md:text-6xl font-extrabold text-slate-900 mb-6">Noticias y Actividades</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">Mantente al día con los eventos, comunicados y logros de nuestra comunidad estudiantil.</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500">Cargando noticias...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {news.length === 0 ? (
              <div className="col-span-2 text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <p className="text-xl text-slate-500">No hay noticias publicadas en este momento.</p>
              </div>
            ) : news.map((item) => (
              <div key={item.id} className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300">
                {item.image_url ? (
                  <div className="relative h-64 overflow-hidden">
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold text-blue-800 tracking-wide uppercase shadow-sm">
                      {item.category}
                    </div>
                  </div>
                ) : (
                  <div className="h-6 bg-blue-600 w-full" />
                )}
                
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center text-sm text-slate-500 mb-4 font-sans bg-slate-100 w-fit px-3 py-1 rounded-full">
                    <Clock className="h-4 w-4 mr-2 text-blue-600" />
                    {item.created_at ? format(new Date(item.created_at), "dd 'de' MMMM, yyyy", { locale: es }) : 'Fecha desconocida'}
                  </div>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold text-slate-900 mb-4 group-hover:text-blue-700 transition-colors leading-tight">
                    {item.title}
                  </h2>
                  <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-wrap">
                    {item.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
