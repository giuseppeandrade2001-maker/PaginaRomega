import React, { useState } from 'react';
import axios from 'axios';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/contact`, form);
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus(null), 5000);
    } catch (e) {
      console.error(e);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-slate-950 text-white py-24 text-center px-4 relative">
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1760865245507-35889582c231?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODl8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGJsdWUlMjBhbmQlMjBncmV5JTIwYmFja2dyb3VuZHxlbnwwfHx8fDE3NzU5Mzg5MDF8MA&ixlib=rb-4.1.0&q=85')] bg-cover bg-center opacity-10"></div>
         <div className="relative z-10">
          <h1 className="font-heading text-5xl md:text-6xl font-extrabold mb-6">Contacto</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">Comunícate con nosotros para resolver tus dudas, sugerencias o procesos de admisión.</p>
         </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 max-w-7xl mx-auto">
          
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h2 className="font-heading text-3xl font-bold text-slate-900 mb-6">Información de Contacto</h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                Nuestras puertas están siempre abiertas. Visítanos en nuestra sede física o contáctanos a través de nuestros canales digitales.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 p-4 rounded-xl text-blue-700 mt-1">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-lg text-slate-900">Ubicación</h4>
                  <p className="text-slate-600">Carrera 8 #14-61, barrio San Miguel<br/>Girardot, Cundinamarca</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 p-4 rounded-xl text-blue-700 mt-1">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-lg text-slate-900">Teléfono</h4>
                  <p className="text-slate-600">+57 123 456 7890</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 p-4 rounded-xl text-blue-700 mt-1">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-lg text-slate-900">Correo Electrónico</h4>
                  <p className="text-slate-600">contacto@colegioromega.edu.co</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 p-4 rounded-xl text-blue-700 mt-1">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-lg text-slate-900">Horario de Atención</h4>
                  <p className="text-slate-600">Lunes a Viernes<br/>7:00 AM - 4:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-50 p-10 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="font-heading text-2xl font-bold text-slate-900 mb-8">Envíanos un Mensaje</h3>
            
            {status === 'success' && (
              <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-center font-medium">
                ¡Mensaje enviado con éxito! Te responderemos pronto.
              </div>
            )}
            
            {status === 'error' && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-center font-medium">
                Ocurrió un error al enviar el mensaje. Inténtalo de nuevo.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">Nombre Completo</label>
                  <Input id="name" name="name" required value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="bg-white border-slate-300 h-12" data-testid="contact-name" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">Correo Electrónico</label>
                  <Input id="email" name="email" required type="email" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} className="bg-white border-slate-300 h-12" data-testid="contact-email" />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-slate-700 mb-2">Asunto</label>
                <Input id="subject" name="subject" required value={form.subject} onChange={e=>setForm({...form, subject: e.target.value})} className="bg-white border-slate-300 h-12" data-testid="contact-subject" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">Mensaje</label>
                <Textarea id="message" name="message" required rows={6} value={form.message} onChange={e=>setForm({...form, message: e.target.value})} className="bg-white border-slate-300" data-testid="contact-message" />
              </div>
              <Button type="submit" disabled={status === 'sending'} className="w-full h-12 text-lg bg-blue-700 hover:bg-blue-800 text-white shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all" data-testid="contact-submit">
                {status === 'sending' ? 'Enviando...' : 'Enviar Mensaje'}
              </Button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Map */}
      <div className="w-full h-[400px] bg-slate-200">
        <iframe 
          title="Mapa de Ubicación"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15923.515286523933!2d-74.8058296!3d4.3013346!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f28d8442e3b0b%3A0xc33190fc6a4fc476!2sSan%20Miguel%2C%20Girardot%2C%20Cundinamarca!5e0!3m2!1ses!2sco!4v1700000000000!5m2!1ses!2sco" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
}
