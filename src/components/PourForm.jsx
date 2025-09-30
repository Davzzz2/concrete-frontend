import { useState } from 'react'
import { Plus, Loader2 } from 'lucide-react'

export default function PourForm({ onAddPour }) {
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
      area: parseFloat(formData.area),
      price_per_sqft: parseFloat(formData.price_per_sqft),
      labor_cost: parseFloat(formData.labor_cost),
      equipment_cost: parseFloat(formData.equipment_cost),
      fuel_cost: parseFloat(formData.fuel_cost),
      repairs_cost: parseFloat(formData.repairs_cost),
      consumables_cost: parseFloat(formData.consumables_cost),
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

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Consumables ($)
          </label>
          <input
            type="number"
            name="consumables_cost"
            value={formData.consumables_cost}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          />
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
