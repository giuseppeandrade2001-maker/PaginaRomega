import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { format } from 'date-fns';
import { Trash2, Plus, ExternalLink } from 'lucide-react';

export default function ManageResources() {
  const [resources, setResources] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', file_url: '', category: 'estudiantes' });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/resources`);
      setResources(data.data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/resources`, formData, { withCredentials: true });
      setIsOpen(false);
      setFormData({ title: '', description: '', file_url: '', category: 'estudiantes' });
      fetchResources();
    } catch (error) {
      console.error('Error creating resource:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este recurso?')) return;
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/resources/${id}`, { withCredentials: true });
      fetchResources();
    } catch (error) {
      console.error('Error deleting resource:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div>
          <h2 className="font-heading text-2xl font-bold text-slate-800">Gestión de Recursos</h2>
          <p className="text-slate-500 mt-1 text-sm">Administra archivos, guías y documentos para estudiantes y docentes.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-700 hover:bg-blue-800 text-white rounded-lg flex gap-2">
              <Plus className="h-4 w-4" /> Agregar Recurso
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl bg-white">
            <DialogHeader>
              <DialogTitle className="font-heading text-xl">Crear Nuevo Recurso</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Título</label>
                <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required data-testid="resource-title-input" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Categoría (estudiantes / docentes)</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value})} 
                  required
                  data-testid="resource-category-select"
                >
                  <option value="estudiantes">Estudiantes</option>
                  <option value="docentes">Docentes</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Enlace del Archivo (URL de Google Drive, PDF, etc)</label>
                <Input type="url" value={formData.file_url} onChange={e => setFormData({...formData, file_url: e.target.value})} required data-testid="resource-url-input" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Descripción (Opcional)</label>
                <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} data-testid="resource-desc-input" />
              </div>
              <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white" data-testid="resource-submit-button">Guardar Recurso</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[300px]">Título</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Enlace</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resources.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-slate-500">No hay recursos agregados.</TableCell>
              </TableRow>
            ) : resources.map((item) => (
              <TableRow key={item.id} className="hover:bg-slate-50">
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell className="capitalize">{item.category}</TableCell>
                <TableCell>
                  <a href={item.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1 text-sm">
                    Ver Archivo <ExternalLink className="h-3 w-3" />
                  </a>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(item.id)} data-testid={`delete-resource-${item.id}`}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
