import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './layout/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Academics from './pages/Academics';
import News from './pages/News';
import Resources from './pages/Resources';
import Contact from './pages/Contact';

// Admin
import AdminLayout from './pages/admin/AdminLayout';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';

import ManageNews from './pages/admin/ManageNews';
import ManageResources from './pages/admin/ManageResources';
import ContactMessages from './pages/admin/ContactMessages';

import ManageAdmissions from './pages/admin/ManageAdmissions';
import Admissions from './pages/Admissions';
import ManageStaff from './pages/admin/ManageStaff';
import Staff from './pages/Staff';

import ManageGallery from './pages/admin/ManageGallery';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/historia" element={<About />} />
            <Route path="/oferta-academica" element={<Academics />} />
            <Route path="/equipo" element={<Staff />} />
            <Route path="/noticias" element={<News />} />
            <Route path="/recursos" element={<Resources />} />
            <Route path="/contacto" element={<Contact />} />
            <Route path="/admisiones" element={<Admissions />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="noticias" element={<ManageNews />} />
            <Route path="recursos" element={<ManageResources />} />
            <Route path="galeria" element={<ManageGallery />} />
            <Route path="directorio" element={<ManageStaff />} />
            <Route path="mensajes" element={<ContactMessages />} />
            <Route path="admisiones" element={<ManageAdmissions />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
