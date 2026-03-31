import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { CheckCircle, Mail, MessageSquare, Eye } from 'lucide-react'

const Contacts = ({ token }) => {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContacts()
  }, [token])

  const fetchContacts = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/contact/list', {
        headers: { token }
      })
      if (response.data.success) {
        setContacts(response.data.contacts || [])
      }
    } catch (error) {
      console.error('Failed to fetch contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id) => {
    try {
      await axios.post(
        backendUrl + '/api/contact/status',
        { id, status: 'read' },
        { headers: { token } }
      )
      fetchContacts()
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const statusColors = {
    new: 'bg-red-100 text-red-800',
    read: 'bg-blue-100 text-blue-800',
    replied: 'bg-green-100 text-green-800'
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">Contact Messages</h2>
        <p className="text-gray-500 text-sm">Manage customer contact form submissions</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading messages...</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {contacts.map((contact) => (
            <div 
              key={contact._id} 
              className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${
                contact.status === 'new' ? 'border-red-500' : 'border-green-500'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-800">{contact.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[contact.status]}`}>
                      {contact.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Mail className="w-4 h-4" />
                    {contact.email}
                  </div>
                  
                  <div className="text-sm text-gray-800 font-medium mb-2">
                    Subject: {contact.subject}
                  </div>
                  
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {contact.message}
                  </p>
                  
                  <div className="text-xs text-gray-500 mt-3">
                    {new Date(contact.date).toLocaleString()}
                  </div>
                </div>
                
                {contact.status === 'new' && (
                  <button
                    onClick={() => markAsRead(contact._id)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark as Read
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {contacts.length === 0 && (
            <div className="text-center py-12 text-gray-500 bg-white rounded-xl">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              No contact messages found
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Contacts
