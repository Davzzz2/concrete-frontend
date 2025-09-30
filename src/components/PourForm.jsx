import { useEffect, useState } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'
import { API_URL } from '../config'

export default function PourForm({ onAddPour }) {
  const { token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    pour_id: '',
    date: new Date().toISOString().split('T')[0],
    area: '',
    price_per_sqft: '',
    labor_cost: '',
    equipment_cost: '',
    fuel_cost: '',
    repairs_cost: '',
    consumables_cost: '',
    lunch_cost: '',
    misc_cost: ''
  })
  const [consumablesCatalog, setConsumablesCatalog] = useState([])
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
    fetchConsumables()
  }, [token])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const success = await onAddPour({
      ...formData,
      consumable_items: consumableItems.map(ci => ({ name: ci.name, price: parseFloat(ci.price) || 0 })),
      area: parseFloat(formData.area),
      price_per_sqft: parseFloat(formData.price_per_sqft),
      labor_cost: parseFloat(formData.labor_cost),
      equipment_cost: parseFloat(formData.equipment_cost),
      fuel_cost: parseFloat(formData.fuel_cost),
      repairs_cost: parseFloat(formData.repairs_cost),
      consumables_cost: consumableItems.reduce((s, i) => s + (parseFloat(i.price) || 0), 0),
      lunch_cost: parseFloat(formData.lunch_cost),
      misc_cost: parseFloat(formData.misc_cost)
    })

    if (success) {
      setFormData({
        pour_id: '',
        date: new Date().toISOString().split('T')[0],
        area: '',
        price_per_sqft: '',
        labor_cost: '',
        equipment_cost: '',
        fuel_cost: '',
        repairs_cost: '',
        consumables_cost: '',
        lunch_cost: '',
        misc_cost: ''
      })
      setConsumableItems([])
    }

    setLoading(false)
  }

  return (
    <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6 border border-gray-200 dark:border-dark-border">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <Plus size={24} />
        Add New Pour
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

        <div className="md:col-span-2 lg:col-span-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Consumables
          </label>
          <div className="space-y-3">
            {consumableItems.map((item, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <select
                  value={item.name}
                  onChange={(e) => {
                    const name = e.target.value
                    const found = consumablesCatalog.find(c => c.name === name)
                    const next = [...consumableItems]
                    next[idx] = { name, price: found ? found.defaultPrice : 0 }
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
                onClick={() => setConsumableItems([...consumableItems, { name: '', price: '' }])}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200"
              >
                Add Item
              </button>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Total: ${consumableItems.reduce((s, i) => s + (parseFloat(i.price) || 0), 0).toFixed(2)}
              </div>
            </div>
            {consumableItems.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-700 dark:text-gray-300">
                      <th className="py-2">Item</th>
                      <th className="py-2 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-dark-border">
                    {consumableItems.map((i, n) => (
                      <tr key={n}>
                        <td className="py-2 text-gray-900 dark:text-white">{i.name || '-'}</td>
                        <td className="py-2 text-right text-gray-900 dark:text-white">${(parseFloat(i.price) || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Lunch ($)
          </label>
          <input
            type="number"
            name="lunch_cost"
            value={formData.lunch_cost}
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

        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Adding...
              </>
            ) : (
              <>
                <Plus size={18} />
                Add Pour
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
