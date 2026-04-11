import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { GraduationCap } from 'lucide-react';

export default function Login() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  if (user) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      setUser(data);
      navigate('/admin');
    } catch (e) {
      setError(e.response?.data?.detail || 'Error de inicio de sesión');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center font-sans" 
         style={{ backgroundImage: "url('https://images.unsplash.com/photo-1760865245507-35889582c231?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODl8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGJsdWUlMjBhbmQlMjBncmV5JTIwYmFja2dyb3VuZHxlbnwwfHx8fDE3NzU5Mzg5MDF8MA&ixlib=rb-4.1.0&q=85')" }}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl p-10 border border-slate-100">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-50 p-4 rounded-full">
            <GraduationCap className="h-12 w-12 text-blue-700" />
          </div>
        </div>
        <h2 className="text-center font-heading text-3xl font-bold text-slate-900 mb-2">Portal Administrativo</h2>
        <p className="text-center text-slate-500 mb-8">Colegio Técnico Romega</p>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium mb-6">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Correo Electrónico</label>
            <Input 
              type="email" 
              required 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="h-12 px-4 bg-slate-50 border-slate-200 focus:bg-white transition-colors text-base"
              placeholder="admin@colegioromega.edu.co"
              data-testid="login-email-input"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Contraseña</label>
            <Input 
              type="password" 
              required 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="h-12 px-4 bg-slate-50 border-slate-200 focus:bg-white transition-colors text-base"
              placeholder="••••••••"
              data-testid="login-password-input"
            />
          </div>
          <Button type="submit" className="w-full h-12 text-base font-semibold bg-blue-700 hover:bg-blue-800 text-white rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all" data-testid="login-submit-button">
            Ingresar al Panel
          </Button>
        </form>
      </div>
    </div>
  );
}
