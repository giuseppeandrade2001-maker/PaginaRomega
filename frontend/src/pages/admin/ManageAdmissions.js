import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CheckCircle, Clock, XCircle, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';

export default function ManageAdmissions() {
  const [admissions, setAdmissions] = useState([]);
  const [selectedAdmission, setSelectedAdmission] = useState(null);

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const fetchAdmissions = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admissions`, { withCredentials: true });
      setAdmissions(data.data);
    } catch (error) {
      console.error('Error fetching admissions:', error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/admissions/${id}/status`, { status: newStatus }, { withCredentials: true });
      fetchAdmissions();
      if (selectedAdmission && selectedAdmission.id === id) {
        setSelectedAdmission({ ...selectedAdmission, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating status', error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800"><Clock className="w-3 h-3 mr-1"/> Pendiente</span>;
      case 'reviewed': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800"><Search className="w-3 h-3 mr-1"/> En Revisión</span>;
      case 'accepted': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800"><CheckCircle className="w-3 h-3 mr-1"/> Aceptado</span>;
      case 'rejected': return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1"/> Rechazado</span>;
      default: return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h2 className="font-heading text-2xl font-bold text-slate-800">Solicitudes de Admisión</h2>
        <p className="text-slate-500 mt-1 text-sm">Gestiona las pre-inscripciones realizadas por los aspirantes en la web.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Aspirante</TableHead>
              <TableHead>Grado</TableHead>
              <TableHead>Acudiente</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-slate-500">No hay solicitudes de admisión recientes.</TableCell>
              </TableRow>
            ) : admissions.map((item) => (
              <TableRow key={item.id} className={`hover:bg-slate-50 cursor-pointer ${item.status === 'pending' ? 'bg-amber-50/20' : ''}`}>
                <TableCell className="font-medium">{item.student_name}</TableCell>
                <TableCell>{item.student_grade}</TableCell>
                <TableCell>{item.parent_name}</TableCell>
                <TableCell>{item.created_at ? format(new Date(item.created_at), 'dd/MM/yyyy') : '-'}</TableCell>
                <TableCell>{getStatusBadge(item.status)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => setSelectedAdmission(item)}>
                    Ver Detalles
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedAdmission} onOpenChange={() => setSelectedAdmission(null)}>
        <DialogContent className="max-w-2xl bg-white">
          {selectedAdmission && (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading text-xl flex items-center gap-3">
                  Detalles de Admisión
                  {getStatusBadge(selectedAdmission.status)}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6 mt-4">
                
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Aspirante</p>
                    <p className="font-medium text-slate-900">{selectedAdmission.student_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Grado a Cursar</p>
                    <p className="font-medium text-slate-900">{selectedAdmission.student_grade}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Fecha de Solicitud</p>
                    <p className="font-medium text-slate-900">{format(new Date(selectedAdmission.created_at), "dd 'de' MMMM, yyyy", { locale: es })}</p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <h4 className="font-bold text-slate-800 mb-3">Datos del Acudiente</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Nombre</p>
                      <p className="font-medium text-slate-900">{selectedAdmission.parent_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Teléfono</p>
                      <p className="font-medium text-slate-900">{selectedAdmission.phone}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-slate-500 mb-1">Correo Electrónico</p>
                      <p className="font-medium text-slate-900">{selectedAdmission.email}</p>
                    </div>
                  </div>
                </div>

                {selectedAdmission.comments && (
                  <div className="border-t border-slate-100 pt-4">
                    <h4 className="font-bold text-slate-800 mb-2">Comentarios</h4>
                    <p className="text-slate-700 bg-slate-50 p-4 rounded-lg whitespace-pre-wrap">
                      {selectedAdmission.comments}
                    </p>
                  </div>
                )}

                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-6">
                  <h4 className="font-bold text-blue-900 mb-3 text-sm uppercase tracking-wider">Cambiar Estado</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant={selectedAdmission.status === 'pending' ? 'default' : 'outline'} className={selectedAdmission.status === 'pending' ? 'bg-amber-600 hover:bg-amber-700 text-white' : ''} onClick={() => handleStatusChange(selectedAdmission.id, 'pending')}>Pendiente</Button>
                    <Button size="sm" variant={selectedAdmission.status === 'reviewed' ? 'default' : 'outline'} className={selectedAdmission.status === 'reviewed' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''} onClick={() => handleStatusChange(selectedAdmission.id, 'reviewed')}>En Revisión</Button>
                    <Button size="sm" variant={selectedAdmission.status === 'accepted' ? 'default' : 'outline'} className={selectedAdmission.status === 'accepted' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''} onClick={() => handleStatusChange(selectedAdmission.id, 'accepted')}>Aceptado</Button>
                    <Button size="sm" variant={selectedAdmission.status === 'rejected' ? 'default' : 'outline'} className={selectedAdmission.status === 'rejected' ? 'bg-red-600 hover:bg-red-700 text-white' : ''} onClick={() => handleStatusChange(selectedAdmission.id, 'rejected')}>Rechazado</Button>
                  </div>
                </div>
                
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
