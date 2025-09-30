import { useEffect, useState } from 'react'
import axios from 'axios'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { API_URL } from '../config'

export default function ConsumablesManager({ onUpdated }) {
  const { token } = useAuth()
  const [items, setItems] = useState([])
  const [name, setName] = useState('')
  const [defaultPrice, setDefaultPrice] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/consumables`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setItems(res.data)
      onUpdated?.(res.data)
    } catch (e) {
      // noop
    }
  }

  useEffect(() => {
    fetchItems()
  }, [token])

  const addItem = async (e) => {
    e.preventDefault()
    if (!name) return
    setLoading(true)
    try {
      await axios.post(`${API_URL}/api/consumables`, { name, defaultPrice: Number(defaultPrice) || 0 }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setName('')
      setDefaultPrice('')
      await fetchItems()
    } finally {
      setLoading(false)
    }
  }

  const deleteItem = async (id) => {
    if (!confirm('Delete this consumable?')) return
    try {
      await axios.delete(`${API_URL}/api/consumables/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      await fetchItems()
    } catch (e) {
      // noop
    }
  }

  return (
    <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6 border border-gray-200 dark:border-dark-border">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Consumables</h3>

      <form onSubmit={addItem} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          required
        />
        <input
          type="number"
          placeholder="Default Price ($)"
          value={defaultPrice}
          onChange={(e) => setDefaultPrice(e.target.value)}
          step="0.01"
          min="0"
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
          Add
        </button>
      </form>

      {items.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No consumables yet. Add one above.</p>
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-dark-border">
          {items.map((it) => (
            <li key={it.id} className="flex items-center justify-between py-2">
              <div className="text-gray-900 dark:text-white">{it.name}</div>
              <div className="flex items-center gap-4">
                <div className="text-gray-700 dark:text-gray-300">${(it.defaultPrice || 0).toFixed(2)}</div>
                <button
                  onClick={() => deleteItem(it.id)}
                  className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40"
                  aria-label="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}


