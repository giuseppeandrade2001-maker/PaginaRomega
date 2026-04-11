import React, { useState } from 'react';
import axios from 'axios';
import { UserPlus, FileCheck, ClipboardList, CalendarCheck } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';

export default function Admissions() {
  const [form, setForm] = useState({ 
    student_name: '', 
    student_grade: '', 
    parent_name: '',
    email: '', 
    phone: '', 
    comments: '' 
  });
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/admissions`, form);
      setStatus('success');
      setForm({ student_name: '', student_grade: '', parent_name: '', email: '', phone: '', comments: '' });
      setTimeout(() => setStatus(null), 8000);
    } catch (e) {
      console.error(e);
      setStatus('error');
    }
  };

  const steps = [
    { title: "Pre-inscripción en línea", icon: ClipboardList, desc: "Completa el formulario en esta página con los datos del aspirante." },
    { title: "Entrevista familiar", icon: UserPlus, desc: "El área de admisiones te contactará para agendar una cita presencial o virtual." },
    { title: "Entrega de documentos", icon: FileTextIcon, desc: "Presenta el boletín anterior, registro civil y certificados médicos." },
    { title: "Matrícula oficial", icon: CalendarCheck, desc: "Firma el contrato educativo y asegura tu cupo para el próximo año lectivo." }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Hero */}
      <div className="bg-slate-950 text-white py-24 text-center px-4 relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1546410531-b4ec756317b6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjV8MHwxfHNlYXJjaHwzfHxzdHVkZW50cyUyMGxlYXJuaW5nfGVufDB8fHx8MTc3NTkzODg5N3ww&ixlib=rb-4.1.0&q=85')] bg-cover bg-center opacity-20"></div>
         <div className="relative z-10">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-600/30 text-blue-200 font-semibold tracking-wider text-sm mb-4 border border-blue-400/50">PROCESO DE ADMISIÓN</span>
          <h1 className="font-heading text-5xl md:text-6xl font-extrabold mb-6">Únete a Nuestra Comunidad</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">Inicia tu proceso de pre-inscripción hoy y asegura un cupo en una de las mejores instituciones técnicas de la región.</p>
         </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 max-w-7xl mx-auto">
          
          {/* Requisitos y Pasos */}
          <div className="lg:col-span-5 space-y-12">
            <div>
              <h2 className="font-heading text-3xl font-bold text-slate-900 mb-6">Pasos para la Admisión</h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                Nuestro proceso está diseñado para ser sencillo, transparente y para conocer mejor a cada futura familia que integra el colegio.
              </p>
              
              <div className="space-y-6">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center border-2 border-blue-200">
                        <step.icon className="h-6 w-6 text-blue-700" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-lg text-slate-900">{step.title}</h4>
                      <p className="text-slate-600">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-indigo-50 p-8 rounded-3xl border border-indigo-100">
              <h3 className="font-heading text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileCheck className="h-6 w-6 text-indigo-600" /> Documentos Mínimos
              </h3>
              <ul className="list-disc list-inside space-y-2 text-slate-700 ml-4 marker:text-indigo-400">
                <li>Registro Civil / Tarjeta de Identidad</li>
                <li>Paz y salvo del colegio anterior</li>
                <li>Boletín de calificaciones más reciente</li>
                <li>Carnet de vacunación (Preescolar y Primaria)</li>
              </ul>
            </div>
          </div>

          {/* Formulario */}
          <div className="lg:col-span-7 bg-white p-10 rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-0"></div>
            
            <div className="relative z-10">
              <h3 className="font-heading text-2xl font-bold text-slate-900 mb-2">Formulario de Pre-inscripción</h3>
              <p className="text-slate-500 mb-8">Déjanos tus datos y nos pondremos en contacto contigo a la brevedad.</p>
              
              {status === 'success' && (
                <div className="mb-6 p-6 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-center shadow-sm">
                  <h4 className="font-bold text-lg mb-1">¡Pre-inscripción Recibida!</h4>
                  <p>Tus datos han sido guardados correctamente. Nuestro equipo de admisiones te contactará en las próximas 48 horas hábiles.</p>
                </div>
              )}
              
              {status === 'error' && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-center font-medium">
                  Ocurrió un error al enviar el formulario. Inténtalo de nuevo.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="student_name" className="block text-sm font-semibold text-slate-700 mb-2">Nombre del Aspirante</label>
                    <Input id="student_name" name="student_name" required value={form.student_name} onChange={e=>setForm({...form, student_name: e.target.value})} className="bg-slate-50 border-slate-200 h-12" placeholder="Ej: Juan Pérez" data-testid="adm-student-name" />
                  </div>
                  <div>
                    <label htmlFor="student_grade" className="block text-sm font-semibold text-slate-700 mb-2">Grado a Cursar</label>
                    <select 
                      id="student_grade"
                      name="student_grade"
                      className="flex h-12 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                      value={form.student_grade} 
                      onChange={e=>setForm({...form, student_grade: e.target.value})} 
                      required
                      data-testid="adm-student-grade"
                    >
                      <option value="">Selecciona un grado...</option>
                      <option value="Preescolar">Preescolar</option>
                      <option value="Primaria">Primaria (1° - 5°)</option>
                      <option value="Bachillerato Básico">Bachillerato Básico (6° - 9°)</option>
                      <option value="Media Técnica">Media Técnica (10° - 11°)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="parent_name" className="block text-sm font-semibold text-slate-700 mb-2">Nombre del Acudiente / Padre de Familia</label>
                  <Input id="parent_name" name="parent_name" required value={form.parent_name} onChange={e=>setForm({...form, parent_name: e.target.value})} className="bg-slate-50 border-slate-200 h-12" data-testid="adm-parent-name" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">Correo Electrónico</label>
                    <Input id="email" name="email" required type="email" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} className="bg-slate-50 border-slate-200 h-12" data-testid="adm-email" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">Teléfono / Celular</label>
                    <Input id="phone" name="phone" required type="tel" value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} className="bg-slate-50 border-slate-200 h-12" data-testid="adm-phone" />
                  </div>
                </div>

                <div>
                  <label htmlFor="comments" className="block text-sm font-semibold text-slate-700 mb-2">Comentarios o Preguntas (Opcional)</label>
                  <Textarea id="comments" name="comments" rows={4} value={form.comments} onChange={e=>setForm({...form, comments: e.target.value})} className="bg-slate-50 border-slate-200" placeholder="¿Tienes alguna duda específica sobre el proceso?" data-testid="adm-comments" />
                </div>

                <Button type="submit" disabled={status === 'sending' || status === 'success'} className="w-full h-12 text-lg bg-blue-700 hover:bg-blue-800 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all" data-testid="adm-submit">
                  {status === 'sending' ? 'Enviando...' : 'Enviar Pre-inscripción'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FileTextIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  )
}
