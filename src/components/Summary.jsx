import { DollarSign, TrendingUp, MapPin, Calculator } from 'lucide-react'

export default function Summary({ pours }) {
  const calculateTotalCost = (pour) => {
    return (
      pour.labor_cost +
      pour.equipment_cost +
      pour.fuel_cost +
      pour.repairs_cost +
      pour.consumables_cost +
      pour.lunch_cost +
      pour.misc_cost
    )
  }

  const calculateTotalPrice = (pour) => {
    return pour.area * pour.price_per_sqft
  }

  const calculateProfit = (pour) => {
    return calculateTotalPrice(pour) - calculateTotalCost(pour)
  }

  const totalPours = pours.length
  const totalArea = pours.reduce((sum, pour) => sum + pour.area, 0)
  const totalCost = pours.reduce((sum, pour) => sum + calculateTotalCost(pour), 0)
  const totalPrice = pours.reduce((sum, pour) => sum + calculateTotalPrice(pour), 0)
  const totalProfit = pours.reduce((sum, pour) => sum + calculateProfit(pour), 0)
  const avgCostPerSqft = totalArea > 0 ? totalCost / totalArea : 0

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value)
  }

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  const stats = [
    {
      label: 'Total Pours',
      value: totalPours,
      icon: MapPin,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      label: 'Total Area (ft²)',
      value: formatNumber(totalArea),
      icon: Calculator,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    },
    {
      label: 'Total Cost',
      value: formatCurrency(totalCost),
      icon: DollarSign,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20'
    },
    {
      label: 'Total Price',
      value: formatCurrency(totalPrice),
      icon: DollarSign,
      color: 'text-cyan-600 dark:text-cyan-400',
      bgColor: 'bg-cyan-100 dark:bg-cyan-900/20'
    },
    {
      label: 'Total Profit',
      value: formatCurrency(totalProfit),
      icon: TrendingUp,
      color: totalProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
      bgColor: totalProfit >= 0 ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
    },
    {
      label: 'Avg Cost/ft²',
      value: formatCurrency(avgCostPerSqft),
      icon: Calculator,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/20'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div
            key={index}
            className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6 border border-gray-200 dark:border-dark-border hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {stat.label}
                </p>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <Icon className={stat.color} size={24} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
