import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  ShoppingCart, 
  MessageSquare, 
  Mail,
  X
} from 'lucide-react'

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/products/add', icon: PlusCircle, label: 'Add Product' },
    { path: '/products', icon: Package, label: 'Products' },
    { path: '/orders', icon: ShoppingCart, label: 'Orders' },
    { path: '/inquiries', icon: MessageSquare, label: 'Inquiries' },
    { path: '/contacts', icon: Mail, label: 'Contacts' },
  ]

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 z-40 sm:hidden transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSidebarOpen(false)}
      />
      
      <div className={`fixed sm:static top-0 left-0 bottom-0 bg-white border-r w-64 z-50 transform transition-transform duration-300 sm:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b sm:hidden">
          <h2 className="font-bold text-green-600">Menu</h2>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex flex-col py-4 text-sm text-gray-700">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => 
                `flex items-center gap-3 px-6 py-3 transition-colors ${
                  isActive 
                    ? 'bg-green-50 text-green-600 border-r-4 border-green-600' 
                    : 'hover:bg-gray-50'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </>
  )
}

export default Sidebar
