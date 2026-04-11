import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, Calendar as CalendarIcon, Filter, X } from 'lucide-react';
import { format, isSameDay, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar } from '../components/ui/calendar';
import { Button } from '../components/ui/button';

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);

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

  // Extraer las fechas de los eventos
  const eventDates = news
    .filter(n => n.event_date)
    .map(n => {
      // Ajuste simple para evitar desfases horarios si se guarda como YYYY-MM-DD
      const [year, month, day] = n.event_date.split('-');
      return new Date(year, month - 1, day);
    });

  // Filtrar noticias si se selecciona una fecha
  const filteredNews = selectedDate
    ? news.filter(n => {
        if (!n.event_date) return false;
        const [year, month, day] = n.event_date.split('-');
        const itemDate = new Date(year, month - 1, day);
        return isSameDay(itemDate, selectedDate);
      })
    : news;

  return (
    <div className="min-h-screen bg-slate-50 py-20 font-sans">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h1 className="font-heading text-5xl md:text-6xl font-extrabold text-slate-900 mb-6">Noticias y Actividades</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">Explora las novedades, comunicados y nuestro calendario interactivo de eventos.</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500">Cargando contenido...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Main Content: News List */}
            <div className="lg:col-span-8 space-y-8">
              {selectedDate && (
                <div className="flex items-center justify-between bg-blue-50 border border-blue-200 text-blue-800 px-6 py-4 rounded-2xl mb-8">
                  <div className="flex items-center">
                    <Filter className="h-5 w-5 mr-3 text-blue-600" />
                    <span className="font-medium text-lg">
                      Mostrando eventos para: <strong>{format(selectedDate, "dd 'de' MMMM, yyyy", { locale: es })}</strong>
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedDate(null)} className="text-blue-700 hover:text-blue-900 hover:bg-blue-100 rounded-full">
                    <X className="h-4 w-4 mr-2" /> Limpiar filtro
                  </Button>
                </div>
              )}

              {filteredNews.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                  <p className="text-xl text-slate-500">
                    {selectedDate 
                      ? "No hay eventos o noticias para la fecha seleccionada." 
                      : "No hay eventos o noticias publicadas en este momento."}
                  </p>
                </div>
              ) : filteredNews.map((item) => (
                <div key={item.id} className="group flex flex-col md:flex-row bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300">
                  {item.image_url ? (
                    <div className="relative md:w-2/5 h-64 md:h-auto overflow-hidden shrink-0">
                      <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold text-blue-800 tracking-wide uppercase shadow-sm">
                        {item.category}
                      </div>
                    </div>
                  ) : (
                    <div className="md:w-6 bg-blue-600 shrink-0" />
                  )}
                  
                  <div className="p-8 flex flex-col flex-1 justify-center">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <div className="flex items-center text-sm text-slate-500 font-sans bg-slate-100 px-3 py-1 rounded-full">
                        <Clock className="h-4 w-4 mr-2 text-slate-400" />
                        Publicado: {item.created_at ? format(new Date(item.created_at), "dd MMM yyyy", { locale: es }) : '-'}
                      </div>
                      {item.event_date && (
                        <div className="flex items-center text-sm text-blue-700 font-bold font-sans bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          Evento: {format(parseISO(item.event_date), "dd MMM yyyy", { locale: es })}
                        </div>
                      )}
                    </div>
                    <h2 className="font-heading text-2xl md:text-3xl font-bold text-slate-900 mb-4 group-hover:text-blue-700 transition-colors leading-tight">
                      {item.title}
                    </h2>
                    <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-wrap line-clamp-4">
                      {item.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Sidebar: Calendar */}
            <div className="lg:col-span-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-28">
                <div className="flex items-center mb-6">
                  <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center mr-4">
                    <CalendarIcon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-bold text-slate-900">Calendario Escolar</h3>
                    <p className="text-sm text-slate-500">Selecciona un día con evento</p>
                  </div>
                </div>
                
                <div className="flex justify-center border-t border-slate-100 pt-6">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    modifiers={{
                      booked: eventDates,
                    }}
                    modifiersClassNames={{
                      booked: "bg-indigo-100 text-indigo-900 font-bold border-2 border-indigo-200 hover:bg-indigo-200",
                    }}
                    className="rounded-xl font-sans"
                  />
                </div>
                
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <h4 className="font-heading font-semibold text-slate-900 mb-4">Próximos Eventos</h4>
                  <div className="space-y-4">
                    {news
                      .filter(n => n.event_date && new Date(n.event_date) >= new Date(new Date().setHours(0,0,0,0)))
                      .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
                      .slice(0, 3)
                      .map(ev => {
                        const [y, m, d] = ev.event_date.split('-');
                        const dateObj = new Date(y, m - 1, d);
                        return (
                          <div key={ev.id} className="flex gap-4 items-start group cursor-pointer" onClick={() => setSelectedDate(dateObj)}>
                            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-2 text-center min-w-[3.5rem] group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                              <span className="block text-xs font-bold uppercase">{format(dateObj, 'MMM', { locale: es })}</span>
                              <span className="block text-xl font-black leading-none">{format(dateObj, 'dd')}</span>
                            </div>
                            <div>
                              <p className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">{ev.title}</p>
                              <p className="text-xs text-slate-500 mt-1">{ev.category}</p>
                            </div>
                          </div>
                        )
                    })}
                    {news.filter(n => n.event_date).length === 0 && (
                      <p className="text-sm text-slate-500">No hay eventos programados próximamente.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
