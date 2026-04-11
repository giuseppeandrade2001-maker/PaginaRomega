import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, BookOpen, GraduationCap, Library, Clock, Image as ImageIcon } from 'lucide-react';
import { Button } from '../../components/ui/button';

export default function Home() {
  const [recentNews, setRecentNews] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/news`);
        setRecentNews(data.data.slice(0, 3));
      } catch (error) {
        console.error(error);
      }
    };
    
    const fetchGallery = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/gallery`);
        setGalleryImages(data.data.slice(0, 8)); // Mostrar hasta 8 imágenes
      } catch (error) {
        console.error(error);
      }
    };
    
    fetchNews();
    fetchGallery();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] flex items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1702737832079-ed5864397f92?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjV8MHwxfHNlYXJjaHwyfHxoaWdoJTIwc2Nob29sJTIwY2FtcHVzfGVufDB8fHx8MTc3NTkzODg5N3ww&ixlib=rb-4.1.0&q=85" 
          alt="Colegio Campus" 
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent z-10"></div>
        <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="max-w-2xl animate-accordion-down">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-600/30 text-blue-200 font-semibold tracking-wider text-sm mb-4 border border-blue-400/50">
              EXCELENCIA EDUCATIVA
            </span>
            <h1 className="font-heading text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              Formando Líderes para el <span className="text-blue-400">Futuro</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed font-sans">
              El Colegio Técnico Romega es una institución comprometida con el desarrollo integral, la innovación académica y la construcción de valores para la sociedad.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white border-0">
                <Link to="/oferta-academica">Nuestra Oferta <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-slate-300 text-slate-800 bg-white hover:bg-slate-100">
                <Link to="/contacto">Contáctanos</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link to="/historia" className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 -translate-y-2 hover:-translate-y-4">
              <div className="h-14 w-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                <GraduationCap className="h-7 w-7 text-blue-700 group-hover:text-white" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-slate-900 mb-3">Nuestra Historia</h3>
              <p className="text-slate-600 leading-relaxed font-sans">Conoce nuestra misión, visión y la trayectoria que nos ha convertido en un referente educativo en Girardot.</p>
            </Link>
            <Link to="/oferta-academica" className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 -translate-y-2 hover:-translate-y-4">
              <div className="h-14 w-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors">
                <BookOpen className="h-7 w-7 text-indigo-700 group-hover:text-white" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-slate-900 mb-3">Oferta Académica</h3>
              <p className="text-slate-600 leading-relaxed font-sans">Descubre los programas de formación, enfoque técnico y niveles educativos que ofrecemos para nuestros estudiantes.</p>
            </Link>
            <Link to="/recursos" className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 -translate-y-2 hover:-translate-y-4">
              <div className="h-14 w-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors">
                <Library className="h-7 w-7 text-emerald-700 group-hover:text-white" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-slate-900 mb-3">Recursos</h3>
              <p className="text-slate-600 leading-relaxed font-sans">Acceso rápido a guías, circulares, horarios y documentos importantes para toda la comunidad educativa.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {galleryImages.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-6">
              <ImageIcon className="w-8 h-8" />
            </div>
            <h2 className="font-heading text-4xl font-bold text-slate-900 mb-4">Vida Escolar</h2>
            <p className="text-lg text-slate-600 font-sans max-w-2xl mx-auto mb-12">Un vistazo a nuestras actividades, instalaciones y el entorno que compartimos día a día en el Colegio Técnico Romega.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {galleryImages.map((img) => (
                <div key={img.id} className="relative h-64 overflow-hidden rounded-2xl shadow-sm group">
                  <img 
                    src={img.image_url} 
                    alt={img.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/60 transition-colors duration-300 flex items-center justify-center">
                    <p className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-bold px-4 text-center">
                      {img.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent News Section */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div className="max-w-2xl">
              <h2 className="font-heading text-4xl font-bold text-slate-900 mb-4">Últimas Noticias</h2>
              <p className="text-lg text-slate-600 font-sans">Mantente informado sobre las novedades, eventos y actividades destacadas de nuestra institución.</p>
            </div>
            <Link to="/noticias" className="hidden md:flex items-center text-blue-700 font-semibold hover:text-blue-900 transition-colors">
              Ver todas <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentNews.length > 0 ? recentNews.map((news) => (
              <div key={news.id} className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-xl transition-all">
                <div className="relative h-56 bg-slate-200 overflow-hidden">
                  {news.image_url ? (
                    <img src={news.image_url} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-slate-200 text-slate-400">
                      <NewspaperIcon />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-blue-800 tracking-wide uppercase shadow-sm">
                    {news.category}
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center text-sm text-slate-500 mb-4 font-sans">
                    <Clock className="h-4 w-4 mr-2" />
                    {news.created_at ? new Date(news.created_at).toLocaleDateString() : ''}
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-700 transition-colors line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="text-slate-600 line-clamp-3 font-sans mb-6">
                    {news.content}
                  </p>
                </div>
              </div>
            )) : (
              <div className="col-span-3 text-center py-12 text-slate-500 bg-white rounded-2xl border border-slate-100 shadow-sm">
                Aún no hay noticias publicadas.
              </div>
            )}
          </div>
          <div className="mt-10 text-center md:hidden">
            <Button asChild variant="outline" className="w-full">
              <Link to="/noticias">Ver todas las noticias</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function NewspaperIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>
  )
}
