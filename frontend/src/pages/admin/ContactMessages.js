import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { format } from 'date-fns';
import { MailOpen, Mail } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';

export default function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/contact-messages`, { withCredentials: true });
      setMessages(data.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleRead = async (msg) => {
    setSelectedMessage(msg);
    if (msg.status === 'unread') {
      try {
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/contact-messages/${msg.id}/read`, {}, { withCredentials: true });
        fetchMessages();
      } catch (error) {
        console.error('Error updating status', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h2 className="font-heading text-2xl font-bold text-slate-800">Mensajes de Contacto</h2>
        <p className="text-slate-500 mt-1 text-sm">Bandeja de entrada de las consultas realizadas a través del sitio web.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Remitente</TableHead>
              <TableHead>Asunto</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-500">No hay mensajes en la bandeja de entrada.</TableCell>
              </TableRow>
            ) : messages.map((item) => (
              <TableRow key={item.id} className={`hover:bg-slate-50 cursor-pointer ${item.status === 'unread' ? 'bg-blue-50/50 font-medium text-slate-900' : 'text-slate-600'}`}>
                <TableCell>
                  {item.status === 'unread' ? <Mail className="h-4 w-4 text-blue-600" /> : <MailOpen className="h-4 w-4 text-slate-400" />}
                </TableCell>
                <TableCell>{item.name} <br/><span className="text-xs text-slate-400 font-normal">{item.email}</span></TableCell>
                <TableCell>{item.subject}</TableCell>
                <TableCell>{item.created_at ? format(new Date(item.created_at), 'dd/MM/yyyy HH:mm') : '-'}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => handleRead(item)} data-testid={`view-message-${item.id}`}>
                    Leer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-2xl bg-white">
          {selectedMessage && (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading text-xl">{selectedMessage.subject}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <p className="text-sm"><strong>De:</strong> {selectedMessage.name} ({selectedMessage.email})</p>
                  <p className="text-sm text-slate-500"><strong>Fecha:</strong> {format(new Date(selectedMessage.created_at), 'dd/MM/yyyy HH:mm')}</p>
                </div>
                <div className="p-4 border border-slate-200 rounded-lg whitespace-pre-wrap text-slate-700 leading-relaxed min-h-[150px]">
                  {selectedMessage.message}
                </div>
                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <Button onClick={() => setSelectedMessage(null)}>Cerrar</Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
