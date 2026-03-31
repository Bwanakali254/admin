import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { Eye, CheckCircle, Mail, Phone, MessageSquare } from 'lucide-react'

const Inquiries = ({ token }) => {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInquiries()
  }, [token])

  const fetchInquiries = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/inquiry/list', {
        headers: { token }
      })
      if (response.data.success) {
        setInquiries(response.data.inquiries || [])
      }
    } catch (error) {
      console.error('Failed to fetch inquiries:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id) => {
    try {
      await axios.post(
        backendUrl + '/api/inquiry/status',
        { id, status: 'read' },
        { headers: { token } }
      )
      fetchInquiries()
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const statusColors = {
    new: 'bg-red-100 text-red-800',
    read: 'bg-blue-100 text-blue-800',
    replied: 'bg-green-100 text-green-800'
  }

  const contactIcons = {
    phone: Phone,
    email: Mail,
    whatsapp: MessageSquare
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">Pricing Inquiries</h2>
        <p className="text-gray-500 text-sm">Manage customer pricing requests</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading inquiries...</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {inquiries.map((inquiry) => {
            const ContactIcon = contactIcons[inquiry.contactMethod] || Mail
            
            return (
              <div 
                key={inquiry._id} 
                className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${
                  inquiry.status === 'new' ? 'border-red-500' : 'border-green-500'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-800">
                        {inquiry.firstName} {inquiry.lastName}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[inquiry.status]}`}>
                        {inquiry.status}
                      </span>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {inquiry.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {inquiry.phone}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Location:</span>
                        {inquiry.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Product Interest:</span>
                        {inquiry.productInterest}
                      </div>
                    </div>
                    
                    {inquiry.message && (
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg mt-2">
                        {inquiry.message}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                      {inquiry.contactMethod && (
                        <span className="flex items-center gap-1">
                          <ContactIcon className="w-3 h-3" />
                          Preferred: {inquiry.contactMethod}
                        </span>
                      )}
                      <span>{new Date(inquiry.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  {inquiry.status === 'new' && (
                    <button
                      onClick={() => markAsRead(inquiry._id)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark as Read
                    </button>
                  )}
                </div>
              </div>
            )
          })}
          
          {inquiries.length === 0 && (
            <div className="text-center py-12 text-gray-500 bg-white rounded-xl">
              No inquiries found
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Inquiries
