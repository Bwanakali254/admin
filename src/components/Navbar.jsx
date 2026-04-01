import React from 'react'
import logo from '../assets/logo.svg'
import { Menu, LogOut } from 'lucide-react'

const Navbar = ({ setToken, setSidebarOpen }) => {
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('adminRole')
    setToken('')
  }

  return (
    <div className="flex items-center py-2 px-[4%] justify-between bg-white">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setSidebarOpen(true)}
          className="sm:hidden p-2 hover:bg-gray-100 rounded-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <img src={logo} alt="Sun Mega" className="w-8 h-8" />
          <h1 className="font-bold text-lg text-green-600">Sun Mega Admin</h1>
        </div>
      </div>
      
      <button
        onClick={logout}
        className="bg-gray-100 text-gray-800 px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-gray-200 transition flex items-center gap-2"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </div>
  )
}

export default Navbar
