import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { FileText, Download } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/resources`);
        setResources(data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  const students = resources.filter(r => r.category === 'estudiantes');
  const teachers = resources.filter(r => r.category === 'docentes');

  const ResourceCard = ({ resource }) => (
    <div className="flex items-start gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
      <div className="h-16 w-16 bg-indigo-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-indigo-600 transition-colors">
        <FileText className="h-8 w-8 text-indigo-600 group-hover:text-white" />
      </div>
      <div className="flex-1">
        <h3 className="font-heading text-xl font-bold text-slate-900 mb-2">{resource.title}</h3>
        {resource.description && <p className="text-slate-600 text-sm mb-4 leading-relaxed">{resource.description}</p>}
        <Button asChild variant="outline" size="sm" className="text-blue-700 border-blue-200 hover:bg-blue-50">
          <a href={resource.file_url} target="_blank" rel="noopener noreferrer">
            <Download className="h-4 w-4 mr-2" /> Descargar / Abrir
          </a>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-20 font-sans">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <h1 className="font-heading text-5xl md:text-6xl font-extrabold text-slate-900 mb-6">Recursos y Documentos</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">Encuentra los documentos institucionales, guías académicas, formatos y circulares oficiales del colegio.</p>
        </div>

        <Tabs defaultValue="estudiantes" className="w-full">
          <div className="flex justify-center mb-12">
            <TabsList className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
              <TabsTrigger value="estudiantes" className="text-lg px-8 py-3 rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all">Para Estudiantes</TabsTrigger>
              <TabsTrigger value="docentes" className="text-lg px-8 py-3 rounded-xl data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all">Para Docentes</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="estudiantes">
            {loading ? <div className="text-center py-10">Cargando...</div> : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {students.length > 0 ? students.map(r => <ResourceCard key={r.id} resource={r} />) : (
                  <p className="col-span-2 text-center text-slate-500 py-10">No hay recursos para estudiantes actualmente.</p>
                )}
              </div>
            )}
          </TabsContent>
          <TabsContent value="docentes">
            {loading ? <div className="text-center py-10">Cargando...</div> : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {teachers.length > 0 ? teachers.map(r => <ResourceCard key={r.id} resource={r} />) : (
                  <p className="col-span-2 text-center text-slate-500 py-10">No hay recursos para docentes actualmente.</p>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
