import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { 
  Package, 
  ShoppingCart, 
  MessageSquare, 
  Mail,
  TrendingUp,
  Users
} from 'lucide-react'

const Dashboard = ({ token }) => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    inquiries: 0,
    contacts: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [token])

  const fetchStats = async () => {
    try {
      const [productsRes, ordersRes, inquiriesRes, contactsRes] = await Promise.all([
        axios.get(backendUrl + '/api/product/list', { headers: { token } }),
        axios.get(backendUrl + '/api/order/list', { headers: { token } }),
        axios.get(backendUrl + '/api/inquiry/list', { headers: { token } }),
        axios.get(backendUrl + '/api/contact/list', { headers: { token } })
      ])

      setStats({
        products: productsRes.data.products?.length || 0,
        orders: ordersRes.data.orders?.length || 0,
        inquiries: inquiriesRes.data.inquiries?.length || 0,
        contacts: contactsRes.data.contacts?.length || 0
      })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { label: 'Total Products', value: stats.products, icon: Package, color: 'bg-blue-500' },
    { label: 'Total Orders', value: stats.orders, icon: ShoppingCart, color: 'bg-green-500' },
    { label: 'Inquiries', value: stats.inquiries, icon: MessageSquare, color: 'bg-yellow-500' },
    { label: 'Contact Messages', value: stats.contacts, icon: Mail, color: 'bg-purple-500' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500">Welcome to Sun Mega Admin Panel</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold text-gray-800">
                  {loading ? '...' : card.value}
                </p>
              </div>
              <div className={`${card.color} p-3 rounded-lg`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <a 
            href="/products/add" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <Package className="w-4 h-4" />
            Add Product
          </a>
          <a 
            href="/products" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            <TrendingUp className="w-4 h-4" />
            View Products
          </a>
          <a 
            href="/inquiries" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            <MessageSquare className="w-4 h-4" />
            View Inquiries
          </a>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
