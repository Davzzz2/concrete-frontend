import { useState, useEffect } from 'react'
import { X, Save, Loader2 } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'
import { API_URL } from '../config'

export default function EditPourModal({ isOpen, onClose, pour, onSave }) {
  const { token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [consumablesCatalog, setConsumablesCatalog] = useState([])
  const [formData, setFormData] = useState({
    pour_id: '',
    date: '',
    area: '',
    price_per_sqft: '',
    labor_cost: '',
    equipment_cost: '',
    fuel_cost: '',
    repairs_cost: '',
    misc_cost: ''
  })
  const [consumableItems, setConsumableItems] = useState([])

  const fetchConsumables = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/consumables`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setConsumablesCatalog(res.data)
    } catch (e) {
      // noop
    }
  }

  useEffect(() => {
    if (isOpen && pour) {
      setFormData({
        pour_id: pour.pour_id || '',
        date: pour.date || '',
        area: pour.area || '',
        price_per_sqft: pour.price_per_sqft || '',
        labor_cost: pour.labor_cost || '',
        equipment_cost: pour.equipment_cost || '',
        fuel_cost: pour.fuel_cost || '',
        repairs_cost: pour.repairs_cost || '',
        misc_cost: pour.misc_cost || ''
      })
      setConsumableItems(pour.consumable_items || [])
      fetchConsumables()
    }
  }, [isOpen, pour, token])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const updateData = {
        ...formData,
        area: parseFloat(formData.area),
        price_per_sqft: parseFloat(formData.price_per_sqft),
        labor_cost: parseFloat(formData.labor_cost),
        equipment_cost: parseFloat(formData.equipment_cost),
        fuel_cost: parseFloat(formData.fuel_cost),
        repairs_cost: parseFloat(formData.repairs_cost),
        consumables_cost: consumableItems.reduce((s, i) => {
          const price = parseFloat(i.price) || 0;
          const quantity = parseFloat(i.quantity) || 1;
          return s + (price * quantity);
        }, 0),
        consumable_items: consumableItems.map(ci => ({ 
          name: ci.name, 
          price: parseFloat(ci.price) || 0,
          quantity: parseFloat(ci.quantity) || 1
        })),
        lunch_cost: 0,
        misc_cost: parseFloat(formData.misc_cost)
      }

      await axios.put(`${API_URL}/api/pours/${pour.id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      })

      onSave(updateData)
      onClose()
    } catch (error) {
      console.error('Error updating pour:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-card rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Edit Pour
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pour ID/Name
              </label>
              <input
                type="text"
                name="pour_id"
                value={formData.pour_id}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Area (sq ft)
              </label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price per Sqft ($)
              </label>
              <input
                type="number"
                name="price_per_sqft"
                value={formData.price_per_sqft}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Labor ($)
              </label>
              <input
                type="number"
                name="labor_cost"
                value={formData.labor_cost}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Equipment ($)
              </label>
              <input
                type="number"
                name="equipment_cost"
                value={formData.equipment_cost}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fuel ($)
              </label>
              <input
                type="number"
                name="fuel_cost"
                value={formData.fuel_cost}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Repairs ($)
              </label>
              <input
                type="number"
                name="repairs_cost"
                value={formData.repairs_cost}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Misc ($)
              </label>
              <input
                type="number"
                name="misc_cost"
                value={formData.misc_cost}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>
          </div>

          {/* Consumables Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Consumables
            </label>
            <div className="space-y-3">
              {consumableItems.map((item, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <select
                    value={item.name}
                    onChange={(e) => {
                      const name = e.target.value
                      const found = consumablesCatalog.find(c => c.name === name)
                      const next = [...consumableItems]
                      next[idx] = { name, price: found ? found.defaultPrice : 0, quantity: 1 }
                      setConsumableItems(next)
                    }}
                    className="px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select consumable</option>
                    {consumablesCatalog.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Price ($)"
                    value={item.price}
                    onChange={(e) => {
                      const next = [...consumableItems]
                      next[idx] = { ...next[idx], price: e.target.value }
                      setConsumableItems(next)
                    }}
                    step="0.01"
                    min="0"
                    className="px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => {
                      const next = [...consumableItems]
                      next[idx] = { ...next[idx], quantity: e.target.value }
                      setConsumableItems(next)
                    }}
                    step="1"
                    min="1"
                    className="px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setConsumableItems(consumableItems.filter((_, i) => i !== idx))}
                    className="px-3 py-2 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setConsumableItems([...consumableItems, { name: '', price: '', quantity: 1 }])}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200"
                >
                  Add Item
                </button>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Total: ${consumableItems.reduce((s, i) => {
                    const price = parseFloat(i.price) || 0;
                    const quantity = parseFloat(i.quantity) || 1;
                    return s + (price * quantity);
                  }, 0).toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
