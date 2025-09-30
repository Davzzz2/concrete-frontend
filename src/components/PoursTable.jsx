import { Trash2, FileText } from 'lucide-react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function PoursTable({ pours, onDeletePour }) {
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

  const handleGeneratePDF = async (pour) => {
    const doc = new jsPDF({ unit: 'pt', format: 'letter' })

    // Try to add logo if available under /CPT.png (public root)
    try {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = '/CPT.png'
      await new Promise((res, rej) => { img.onload = res; img.onerror = rej })
      doc.addImage(img, 'PNG', 40, 30, 100, 40)
    } catch (e) {
      // If logo missing, skip
    }

    doc.setFontSize(18)
    doc.text('Concrete Pour Receipt', 40, 95)
    doc.setFontSize(11)
    doc.text(`Pour ID: ${pour.pour_id}`, 40, 115)
    doc.text(`Date: ${new Date(pour.date).toLocaleDateString()}`, 40, 130)

    const rows = []
    rows.push(['Area (ft²)', formatNumber(pour.area)])
    rows.push(['Price per ft²', formatCurrency(pour.price_per_sqft)])
    rows.push(['Labor', formatCurrency(pour.labor_cost)])
    rows.push(['Equipment', formatCurrency(pour.equipment_cost)])
    rows.push(['Fuel', formatCurrency(pour.fuel_cost)])
    rows.push(['Repairs', formatCurrency(pour.repairs_cost)])

    // Consumables breakdown
    if (Array.isArray(pour.consumable_items) && pour.consumable_items.length > 0) {
      rows.push(['Consumables (items):', ''])
      pour.consumable_items.forEach((ci) => {
        rows.push([`  - ${ci.name}`, formatCurrency(ci.price)])
      })
      rows.push(['Consumables Total', formatCurrency(pour.consumables_cost)])
    } else {
      rows.push(['Consumables', formatCurrency(pour.consumables_cost)])
    }

    rows.push(['Lunch', formatCurrency(pour.lunch_cost)])
    rows.push(['Misc', formatCurrency(pour.misc_cost)])

    const totalCost = calculateTotalCost(pour)
    const totalPrice = calculateTotalPrice(pour)
    const profit = totalPrice - totalCost

    autoTable(doc, {
      startY: 150,
      head: [['Item', 'Amount']],
      body: rows,
      styles: { fontSize: 11 },
      headStyles: { fillColor: [30, 41, 59] }
    })

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 20,
      body: [
        ['Total Cost', formatCurrency(totalCost)],
        ['Total Price', formatCurrency(totalPrice)],
        ['Profit', formatCurrency(profit)]
      ],
      styles: { fontSize: 12, cellStyles: { halign: 'right' } },
      theme: 'plain'
    })

    doc.save(`receipt-${pour.pour_id}.pdf`)
  }

  if (pours.length === 0) {
    return (
      <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-12 border border-gray-200 dark:border-dark-border text-center">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          No pours recorded yet. Add your first pour above!
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg border border-gray-200 dark:border-dark-border overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-dark-border">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Recorded Pours
        </h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-dark-border">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Pour ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Area (ft²)
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Price/ft²
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Labor
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Equipment
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Fuel
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Repairs
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Consumables
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Lunch
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Misc
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Total Cost
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Total Price
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Profit
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-dark-border">
            {pours.map((pour) => {
              const profit = calculateProfit(pour)
              const isProfit = profit >= 0

              return (
                <tr key={pour.id} className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium">
                    {pour.pour_id}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                    {new Date(pour.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 text-right">
                    {formatNumber(pour.area)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 text-right">
                    {formatCurrency(pour.price_per_sqft)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 text-right">
                    {formatCurrency(pour.labor_cost)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 text-right">
                    {formatCurrency(pour.equipment_cost)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 text-right">
                    {formatCurrency(pour.fuel_cost)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 text-right">
                    {formatCurrency(pour.repairs_cost)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 text-right">
                    {formatCurrency(pour.consumables_cost)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 text-right">
                    {formatCurrency(pour.lunch_cost)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 text-right">
                    {formatCurrency(pour.misc_cost)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-semibold text-right">
                    {formatCurrency(calculateTotalCost(pour))}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-semibold text-right">
                    {formatCurrency(calculateTotalPrice(pour))}
                  </td>
                  <td className={`px-4 py-3 text-sm font-semibold text-right ${isProfit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {formatCurrency(profit)}
                  </td>
                  <td className="px-4 py-3 text-center flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleGeneratePDF(pour)}
                      className="inline-flex items-center justify-center p-2 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                      aria-label="Generate PDF"
                    >
                      <FileText size={16} />
                    </button>
                    <button
                      onClick={() => onDeletePour(pour.id)}
                      className="inline-flex items-center justify-center p-2 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
                      aria-label="Delete pour"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
