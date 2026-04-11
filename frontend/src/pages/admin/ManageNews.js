import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { format } from 'date-fns';
import { Trash2, Plus, Edit } from 'lucide-react';

export default function ManageNews() {
  const [news, setNews] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', image_url: '', category: 'General' });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/news`);
      setNews(data.data);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const handleOpenDialog = (item = null) => {
    if (item) {
      setEditId(item.id);
      setFormData({
        title: item.title || '',
        content: item.content || '',
        image_url: item.image_url || '',
        category: item.category || 'General'
      });
    } else {
      setEditId(null);
      setFormData({ title: '', content: '', image_url: '', category: 'General' });
    }
    setIsOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/news/${editId}`, formData, { withCredentials: true });
      } else {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/news`, formData, { withCredentials: true });
      }
      setIsOpen(false);
      setFormData({ title: '', content: '', image_url: '', category: 'General' });
      setEditId(null);
      fetchNews();
    } catch (error) {
      console.error('Error saving news:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta noticia?')) return;
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/news/${id}`, { withCredentials: true });
      fetchNews();
    } catch (error) {
      console.error('Error deleting news:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div>
          <h2 className="font-heading text-2xl font-bold text-slate-800">Gestión de Noticias</h2>
          <p className="text-slate-500 mt-1 text-sm">Administra las publicaciones de la página principal.</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <Button onClick={() => handleOpenDialog()} className="bg-blue-700 hover:bg-blue-800 text-white rounded-lg flex gap-2">
            <Plus className="h-4 w-4" /> Agregar Noticia
          </Button>
          <DialogContent className="max-w-2xl bg-white">
            <DialogHeader>
              <DialogTitle className="font-heading text-xl">{editId ? 'Editar Noticia' : 'Crear Nueva Noticia'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Título</label>
                <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required data-testid="news-title-input" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Categoría</label>
                <Input value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required data-testid="news-category-input" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">URL de Imagen (Opcional)</label>
                <Input value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} data-testid="news-image-input" placeholder="https://images.unsplash.com/..." />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Contenido</label>
                <Textarea value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} required rows={6} data-testid="news-content-input" />
              </div>
              <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white" data-testid="news-submit-button">{editId ? 'Guardar Cambios' : 'Publicar Noticia'}</Button>
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
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {news.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-slate-500">No hay noticias publicadas.</TableCell>
              </TableRow>
            ) : news.map((item) => (
              <TableRow key={item.id} className="hover:bg-slate-50">
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.created_at ? format(new Date(item.created_at), 'dd/MM/yyyy') : '-'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleOpenDialog(item)} data-testid={`edit-news-${item.id}`}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(item.id)} data-testid={`delete-news-${item.id}`}>
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
