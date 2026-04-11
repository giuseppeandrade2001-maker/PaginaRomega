import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Trash2, Plus, Edit } from 'lucide-react';

export default function ManageStaff() {
  const [staff, setStaff] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ name: '', role: '', email: '', department: 'Docente', image_url: '' });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/staff`);
      setStaff(data.data);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const handleOpenDialog = (item = null) => {
    if (item) {
      setEditId(item.id);
      setFormData({
        name: item.name || '',
        role: item.role || '',
        email: item.email || '',
        department: item.department || 'Docente',
        image_url: item.image_url || ''
      });
    } else {
      setEditId(null);
      setFormData({ name: '', role: '', email: '', department: 'Docente', image_url: '' });
    }
    setIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/staff/${editId}`, formData, { withCredentials: true });
      } else {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/staff`, formData, { withCredentials: true });
      }
      setIsOpen(false);
      setEditId(null);
      fetchStaff();
    } catch (error) {
      console.error('Error saving staff:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este miembro?')) return;
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/staff/${id}`, { withCredentials: true });
      fetchStaff();
    } catch (error) {
      console.error('Error deleting staff:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div>
          <h2 className="font-heading text-2xl font-bold text-slate-800">Directorio Institucional</h2>
          <p className="text-slate-500 mt-1 text-sm">Gestiona la información de docentes y personal administrativo.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <Button onClick={() => handleOpenDialog()} className="bg-blue-700 hover:bg-blue-800 text-white rounded-lg flex gap-2">
            <Plus className="h-4 w-4" /> Agregar Personal
          </Button>
          <DialogContent className="max-w-xl bg-white">
            <DialogHeader>
              <DialogTitle className="font-heading text-xl">{editId ? 'Editar Personal' : 'Nuevo Miembro del Equipo'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Nombre Completo</label>
                <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required data-testid="staff-name-input" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Rol o Cargo</label>
                  <Input value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} required placeholder="Ej: Profesor de Matemáticas" data-testid="staff-role-input" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Departamento</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                    value={formData.department} 
                    onChange={e => setFormData({...formData, department: e.target.value})} 
                    required
                  >
                    <option value="Directivo">Directivo</option>
                    <option value="Docente">Docente</option>
                    <option value="Administrativo">Administrativo</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Correo Institucional (Opcional)</label>
                <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} data-testid="staff-email-input" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">URL de Foto (Opcional)</label>
                <Input value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} placeholder="https://..." data-testid="staff-image-input" />
              </div>
              <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white" data-testid="staff-submit-button">{editId ? 'Guardar Cambios' : 'Agregar Personal'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-500">No hay personal registrado.</TableCell>
              </TableRow>
            ) : staff.map((item) => (
              <TableRow key={item.id} className="hover:bg-slate-50">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-8 h-8 rounded-full object-cover bg-slate-200" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                        {item.name.charAt(0)}
                      </div>
                    )}
                    {item.name}
                  </div>
                </TableCell>
                <TableCell>{item.role}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold ${
                    item.department === 'Directivo' ? 'bg-amber-100 text-amber-800' :
                    item.department === 'Administrativo' ? 'bg-emerald-100 text-emerald-800' :
                    'bg-indigo-100 text-indigo-800'
                  }`}>
                    {item.department}
                  </span>
                </TableCell>
                <TableCell className="text-slate-500 text-sm">{item.email || '-'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleOpenDialog(item)} data-testid={`edit-staff-${item.id}`}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(item.id)} data-testid={`delete-staff-${item.id}`}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
