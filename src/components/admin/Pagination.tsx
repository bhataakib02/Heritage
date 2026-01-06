'use client'
import React from 'react'
import { Button } from '@nextui-org/react'

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    totalItems: number
    itemsPerPage: number
}

function Pagination({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }: PaginationProps) {
    const startItem = (currentPage - 1) * itemsPerPage + 1
    const endItem = Math.min(currentPage * itemsPerPage, totalItems)

    if (totalPages <= 1) return null

    return (
        <div className="flex items-center justify-between mt-5 bg-white p-4 rounded-sm border border-gray-200">
            <div className="text-sm text-gray-600">
                Showing {startItem} to {endItem} of {totalItems} results
            </div>
            <div className="flex gap-2">
                <Button
                    size="sm"
                    variant="flat"
                    onClick={() => onPageChange(currentPage - 1)}
                    isDisabled={currentPage === 1}
                >
                    Previous
                </Button>
                <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum
                        if (totalPages <= 5) {
                            pageNum = i + 1
                        } else if (currentPage <= 3) {
                            pageNum = i + 1
                        } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i
                        } else {
                            pageNum = currentPage - 2 + i
                        }
                        return (
                            <Button
                                key={pageNum}
                                size="sm"
                                variant={currentPage === pageNum ? "solid" : "flat"}
                                onClick={() => onPageChange(pageNum)}
                                className={currentPage === pageNum ? "bg-primary text-white" : ""}
                            >
                                {pageNum}
                            </Button>
                        )
                    })}
                </div>
                <Button
                    size="sm"
                    variant="flat"
                    onClick={() => onPageChange(currentPage + 1)}
                    isDisabled={currentPage === totalPages}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}

export default Pagination

