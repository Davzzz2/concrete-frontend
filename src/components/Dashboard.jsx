import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import axios from 'axios'
import { Moon, Sun, LogOut, Plus, Trash2, Loader2 } from 'lucide-react'
import PourForm from './PourForm'
import PoursTable from './PoursTable'
import Summary from './Summary'
import { API_URL } from '../config'

export default function Dashboard() {
  const [pours, setPours] = useState([])
  const [loading, setLoading] = useState(true)
  const { token, username, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()

  const fetchPours = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/pours`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setPours(response.data)
    } catch (error) {
      console.error('Error fetching pours:', error)
      if (error.response?.status === 401 || error.response?.status === 403) {
        logout()
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPours()
  }, [token])

  const handleAddPour = async (pourData) => {
    try {
      const response = await axios.post(`${API_URL}/api/pours`, pourData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setPours([response.data, ...pours])
      return true
    } catch (error) {
      console.error('Error adding pour:', error)
      return false
    }
  }

  const handleDeletePour = async (id) => {
    if (!confirm('Are you sure you want to delete this pour?')) return

    try {
      await axios.delete(`${API_URL}/api/pours/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setPours(pours.filter(p => p.id !== id))
    } catch (error) {
      console.error('Error deleting pour:', error)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <nav className="bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Concrete Pour Tracker
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Welcome, {username}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-600" size={40} />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Add Pour Form */}
            <PourForm onAddPour={handleAddPour} />

            {/* Summary */}
            <Summary pours={pours} />

            {/* Pours Table */}
            <PoursTable pours={pours} onDeletePour={handleDeletePour} />
          </div>
        )}
      </div>
    </div>
  )
}
