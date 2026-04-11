import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Trash2, Plus, Edit, Image as ImageIcon } from 'lucide-react';

export default function ManageGallery() {
  const [images, setImages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ title: '', image_url: '', description: '' });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/gallery`);
      setImages(data.data);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    }
  };

  const handleOpenDialog = (item = null) => {
    if (item) {
      setEditId(item.id);
      setFormData({
        title: item.title || '',
        image_url: item.image_url || '',
        description: item.description || ''
      });
    } else {
      setEditId(null);
      setFormData({ title: '', image_url: '', description: '' });
    }
    setIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/gallery/${editId}`, formData, { withCredentials: true });
      } else {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/gallery`, formData, { withCredentials: true });
      }
      setIsOpen(false);
      setEditId(null);
      fetchImages();
    } catch (error) {
      console.error('Error saving image:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta imagen de la galería?')) return;
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/gallery/${id}`, { withCredentials: true });
      fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div>
          <h2 className="font-heading text-2xl font-bold text-slate-800">Galería de Vida Escolar</h2>
          <p className="text-slate-500 mt-1 text-sm">Administra las fotografías que se muestran en la sección de inicio.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <Button onClick={() => handleOpenDialog()} className="bg-blue-700 hover:bg-blue-800 text-white rounded-lg flex gap-2">
            <Plus className="h-4 w-4" /> Agregar Imagen
          </Button>
          <DialogContent className="max-w-xl bg-white">
            <DialogHeader>
              <DialogTitle className="font-heading text-xl">{editId ? 'Editar Imagen' : 'Nueva Imagen para Galería'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Título / Etiqueta</label>
                <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required placeholder="Ej: Clase de Informática" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">URL de la Imagen</label>
                <Input type="url" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} required placeholder="https://..." />
                <p className="text-xs text-slate-500 mt-1">Pega el enlace directo a la imagen (próximamente integración nativa con Object Storage).</p>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Descripción (Opcional)</label>
                <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} placeholder="Breve contexto de la foto..." />
              </div>
              <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white">{editId ? 'Guardar Cambios' : 'Agregar a Galería'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {images.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 text-center">
          <ImageIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-1">Aún no hay imágenes</h3>
          <p className="text-slate-500">Comienza a subir fotografías para mostrarlas en la página principal.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden group">
              <div className="relative h-48 bg-slate-100">
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button variant="secondary" size="icon" onClick={() => handleOpenDialog(item)} className="h-8 w-8 rounded-full">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(item.id)} className="h-8 w-8 rounded-full">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-slate-900 text-sm truncate">{item.title}</h3>
                <p className="text-slate-500 text-xs mt-1 truncate">{item.description || 'Sin descripción'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
