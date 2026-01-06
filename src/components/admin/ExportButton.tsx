'use client'
import React from 'react'
import { Button } from '@nextui-org/react'

interface ExportButtonProps {
    data: any[]
    filename?: string
    headers?: string[]
    fields?: string[]
}

function ExportButton({ data, filename = 'export', headers, fields }: ExportButtonProps) {
    const exportToCSV = () => {
        if (data.length === 0) {
            alert('No data to export')
            return
        }

        // Get headers
        const csvHeaders = headers || Object.keys(data[0])
        
        // Get fields to export
        const fieldsToExport = fields || Object.keys(data[0])
        
        // Create CSV content
        const csvContent = [
            csvHeaders.join(','),
            ...data.map(row => 
                fieldsToExport.map(field => {
                    const value = row[field]
                    // Handle nested objects and arrays
                    if (value === null || value === undefined) return ''
                    if (typeof value === 'object') return JSON.stringify(value)
                    // Escape commas and quotes
                    return `"${String(value).replace(/"/g, '""')}"`
                }).join(',')
            )
        ].join('\n')

        // Create blob and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <Button
            size="sm"
            variant="flat"
            onClick={exportToCSV}
            startContent={<i className="ri-download-line"></i>}
        >
            Export CSV
        </Button>
    )
}

export default ExportButton

