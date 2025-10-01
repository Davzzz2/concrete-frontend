import { Trash2, FileText, Edit2 } from 'lucide-react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function PoursTable({ pours, onDeletePour, onEditPour }) {
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

    // Tailwind-inspired palette to match site
    const colors = {
      headerBg: [15, 23, 42],       // dark.bg
      headerText: [255, 255, 255],
      cardBg: [30, 41, 59],         // dark.card
      border: [51, 65, 85],         // dark.border
      tableHead: [30, 41, 59],
      text: [15, 23, 42],
      muted: [100, 116, 139],
      rowAlt: [248, 250, 252],
      accent: [37, 99, 235]         // blue-600
    }

    // Header bar
    const pageW = doc.internal.pageSize.getWidth()
    doc.setFillColor(...colors.headerBg)
    doc.rect(0, 0, pageW, 90, 'F')

    // Logo + brand
    let headerX = 40
    let headerY = 25
    let hasLogo = false
    try {
      const resp = await fetch(`${import.meta.env.BASE_URL}CPT.png`)
      if (resp.ok) {
        const blob = await resp.blob()
        const reader = new FileReader()
        const dataUrl = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result)
          reader.readAsDataURL(blob)
        })
        doc.addImage(dataUrl, 'PNG', headerX, headerY, 120, 45)
        hasLogo = true
      }
    } catch (_) {}

    doc.setTextColor(...colors.headerText)
    doc.setFontSize(18)
    if (!hasLogo) {
      doc.text('Concrete Pour Tracker', headerX, 55)
    }
    doc.setFontSize(10)
    const rightX = pageW - 40
    const meta = [
      `Date: ${new Date(pour.date).toLocaleDateString()}`,
      `Pour ID: ${pour.pour_id}`
    ]
    meta.reverse().forEach((line, i) => {
      const y = 65 - i * 14
      const tw = doc.getTextWidth(line)
      doc.text(line, rightX - tw, y)
    })

    // Section title
    doc.setFontSize(14)
    doc.setTextColor(...colors.text)
    doc.text('Details', 40, 120)

    // Items table
    const rows = []
    rows.push(['Area (ft²)', formatNumber(pour.area)])
    rows.push(['Price per ft²', formatCurrency(pour.price_per_sqft)])
    rows.push(['Labor', formatCurrency(pour.labor_cost)])
    rows.push(['Equipment', formatCurrency(pour.equipment_cost)])
    rows.push(['Fuel', formatCurrency(pour.fuel_cost)])
    rows.push(['Repairs', formatCurrency(pour.repairs_cost)])

    if (Array.isArray(pour.consumable_items) && pour.consumable_items.length > 0) {
      rows.push(['Consumables', ''])
      pour.consumable_items.forEach((ci) => {
        const quantity = ci.quantity || 1;
        const total = (ci.price || 0) * quantity;
        rows.push([`  · ${ci.name} (${quantity} × $${(ci.price || 0).toFixed(2)})`, formatCurrency(total)])
      })
      rows.push(['Consumables Total', formatCurrency(pour.consumables_cost)])
    } else {
      rows.push(['Consumables', formatCurrency(pour.consumables_cost)])
    }

    // Note: lunch removed from table and PDF
    rows.push(['Misc', formatCurrency(pour.misc_cost)])

    const totalCost = calculateTotalCost(pour)
    const totalPrice = calculateTotalPrice(pour)
    const profit = totalPrice - totalCost

    autoTable(doc, {
      startY: 130,
      head: [['Item', 'Amount']],
      body: rows,
      styles: { fontSize: 11, cellPadding: 6, lineColor: colors.border, lineWidth: 0.3 },
      headStyles: { fillColor: colors.tableHead, textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: colors.rowAlt },
      columnStyles: {
        0: { cellWidth: 320 },
        1: { halign: 'right' }
      }
    })

    // Summary card matching site style
    const y = doc.lastAutoTable.finalY + 24
    const cardW = pageW - 80
    const cardH = 110
    doc.setDrawColor(...colors.border)
    doc.setFillColor(255, 255, 255)
    doc.roundedRect(40, y, cardW, cardH, 10, 10, 'FD')
    
    // Title with accent underline
    doc.setTextColor(...colors.text)
    doc.setFontSize(13)
    doc.text('Summary', 56, y + 26)
    doc.setDrawColor(...colors.accent)
    doc.setLineWidth(2)
    doc.line(56, y + 30, 120, y + 30)

    autoTable(doc, {
      startY: y + 36,
      body: [
        ['Total Cost', formatCurrency(totalCost)],
        ['Total Price', formatCurrency(totalPrice)],
        ['Profit', formatCurrency(profit)]
      ],
      theme: 'plain',
      styles: { fontSize: 12, cellPadding: 5 },
      columnStyles: {
        0: { cellWidth: 140 },
        1: { halign: 'right', cellWidth: 160 }
      }
    })

    // Footer muted
    doc.setFontSize(9)
    doc.setTextColor(...colors.muted)
    doc.text('Generated by Concrete Pour Tracker', 40, doc.internal.pageSize.getHeight() - 30)

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
        <table className="w-full min-w-[1200px]">
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
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onEditPour && onEditPour(pour)}
                        className="inline-flex items-center justify-center p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
                        aria-label="Edit pour"
                        title="Edit pour"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleGeneratePDF(pour)}
                        className="inline-flex items-center justify-center p-2 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                        aria-label="Generate PDF"
                        title="Generate PDF"
                      >
                        <FileText size={16} />
                      </button>
                      <button
                        onClick={() => onDeletePour(pour.id)}
                        className="inline-flex items-center justify-center p-2 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
                        aria-label="Delete pour"
                        title="Delete pour"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
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
