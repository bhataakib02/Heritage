'use client'
import React from 'react'
import { Select, SelectItem, Input, Button } from '@nextui-org/react'

interface FilterOption {
    key: string
    label: string
    type: 'select' | 'text' | 'date'
    options?: { value: string; label: string }[]
}

interface TableFiltersProps {
    filters: FilterOption[]
    values: Record<string, any>
    onChange: (key: string, value: any) => void
    onClear: () => void
}

function TableFilters({ filters, values, onChange, onClear }: TableFiltersProps) {
    return (
        <div className="bg-white p-4 rounded-sm border border-gray-200 mb-5">
            <div className="flex flex-wrap gap-4 items-end">
                {filters.map((filter) => (
                    <div key={filter.key} className="flex-1 min-w-[200px]">
                        <label className="text-sm text-gray-600 mb-1 block">{filter.label}</label>
                        {filter.type === 'select' && filter.options ? (
                            <Select
                                size="sm"
                                placeholder={`Select ${filter.label}`}
                                selectedKeys={values[filter.key] ? [values[filter.key]] : []}
                                onSelectionChange={(keys) => {
                                    const value = Array.from(keys)[0] as string
                                    onChange(filter.key, value || '')
                                }}
                            >
                                {filter.options.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </Select>
                        ) : filter.type === 'date' ? (
                            <Input
                                type="date"
                                size="sm"
                                value={values[filter.key] || ''}
                                onChange={(e) => onChange(filter.key, e.target.value)}
                            />
                        ) : (
                            <Input
                                size="sm"
                                placeholder={`Enter ${filter.label}`}
                                value={values[filter.key] || ''}
                                onChange={(e) => onChange(filter.key, e.target.value)}
                            />
                        )}
                    </div>
                ))}
                <Button
                    size="sm"
                    variant="flat"
                    onClick={onClear}
                >
                    Clear Filters
                </Button>
            </div>
        </div>
    )
}

export default TableFilters

