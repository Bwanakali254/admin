import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Login from './components/Login'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import AddProduct from './pages/AddProduct'
import Products from './pages/Products'
import Orders from './pages/Orders'
import Inquiries from './pages/Inquiries'
import Contacts from './pages/Contacts'

export const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

const AdminRoutes = ({ token, setToken }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar setToken={setToken} setSidebarOpen={setSidebarOpen} />
      <hr />
      <div className="flex w-full">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 p-4 sm:p-6 text-gray-600 text-base">
          <Routes>
            <Route path="/" element={<Dashboard token={token} />} />
            <Route path="/products/add" element={<AddProduct token={token} />} />
            <Route path="/products" element={<Products token={token} />} />
            <Route path="/orders" element={<Orders token={token} />} />
            <Route path="/inquiries" element={<Inquiries token={token} />} />
            <Route path="/contacts" element={<Contacts token={token} />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

const AppContent = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [isAuthorized, setIsAuthorized] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    localStorage.setItem('token', token)
    
    if (token) {
      try {
        const decoded = jwtDecode(token)
        
        if (decoded.role === 'admin' || decoded.role === 'super_admin') {
          setIsAuthorized(true)
        } else {
          setToken('')
          localStorage.removeItem('token')
          localStorage.removeItem('adminRole')
          toast.error('Access denied. Admin privileges required.')
          setIsAuthorized(false)
        }
      } catch (error) {
        console.error('Invalid token', error)
        setToken('')
        localStorage.removeItem('token')
        localStorage.removeItem('adminRole')
        setIsAuthorized(false)
      }
    } else {
      setIsAuthorized(false)
    }
  }, [token])

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      {!token || !isAuthorized ? (
        <Login setToken={setToken} />
      ) : (
        <AdminRoutes token={token} setToken={setToken} />
      )}
    </>
  )
}

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
