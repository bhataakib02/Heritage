'use client'
import React, { useState, useEffect } from 'react'
import { Input } from '@nextui-org/react'

interface SearchBarProps {
    placeholder?: string
    onSearch: (searchTerm: string) => void
    debounceMs?: number
}

function SearchBar({ placeholder = "Search...", onSearch, debounceMs = 300 }: SearchBarProps) {
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(searchTerm)
        }, debounceMs)

        return () => clearTimeout(timer)
    }, [searchTerm, onSearch, debounceMs])

    return (
        <Input
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            startContent={<i className="ri-search-line text-gray-400"></i>}
            className="max-w-xs"
            size="sm"
        />
    )
}

export default SearchBar

