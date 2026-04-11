import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, GraduationCap, Building, Briefcase } from 'lucide-react';

export default function Staff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/staff`);
      setStaff(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const GroupStaff = ({ department, icon: Icon, title, description, colorClass }) => {
    const members = staff.filter(s => s.department === department);
    
    if (members.length === 0) return null;

    return (
      <div className="mb-20">
        <div className="flex items-center gap-4 mb-8">
          <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${colorClass.bg}`}>
            <Icon className={`h-7 w-7 ${colorClass.text}`} />
          </div>
          <div>
            <h2 className="font-heading text-3xl font-bold text-slate-900">{title}</h2>
            <p className="text-slate-600">{description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <div key={member.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col items-center text-center">
              {member.image_url ? (
                <img src={member.image_url} alt={member.name} className="w-24 h-24 rounded-full object-cover mb-4 ring-4 ring-slate-50 group-hover:ring-blue-100 transition-colors" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-3xl font-bold text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                  {member.name.charAt(0)}
                </div>
              )}
              <h3 className="font-heading text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-700 transition-colors">{member.name}</h3>
              <p className="text-blue-600 font-medium mb-4">{member.role}</p>
              
              {member.email && (
                <a href={`mailto:${member.email}`} className="mt-auto flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-blue-600 bg-slate-50 px-4 py-2 rounded-full transition-colors w-full">
                  <Mail className="h-4 w-4" />
                  {member.email}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 py-20 font-sans">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-20">
          <h1 className="font-heading text-5xl md:text-6xl font-extrabold text-slate-900 mb-6">Nuestro Equipo</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">Conoce al talentoso grupo de profesionales, educadores y personal administrativo que hace posible la excelencia en el Colegio Técnico Romega.</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500">Cargando directorio...</div>
        ) : staff.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-xl text-slate-500">Aún no hay personal registrado en el directorio.</p>
          </div>
        ) : (
          <>
            <GroupStaff 
              department="Directivo" 
              title="Cuerpo Directivo" 
              description="Líderes comprometidos con la visión institucional." 
              icon={Building} 
              colorClass={{ bg: 'bg-amber-100', text: 'text-amber-700' }} 
            />
            <GroupStaff 
              department="Docente" 
              title="Docentes" 
              description="Nuestros educadores formadores de excelencia." 
              icon={GraduationCap} 
              colorClass={{ bg: 'bg-indigo-100', text: 'text-indigo-700' }} 
            />
            <GroupStaff 
              department="Administrativo" 
              title="Personal Administrativo" 
              description="El equipo detrás del funcionamiento diario del colegio." 
              icon={Briefcase} 
              colorClass={{ bg: 'bg-emerald-100', text: 'text-emerald-700' }} 
            />
          </>
        )}
      </div>
    </div>
  );
}
