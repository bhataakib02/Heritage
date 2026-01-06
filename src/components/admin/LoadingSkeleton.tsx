'use client'
import React from 'react'

interface LoadingSkeletonProps {
    rows?: number
    columns?: number
}

function LoadingSkeleton({ rows = 5, columns = 6 }: LoadingSkeletonProps) {
    return (
        <div className="bg-white rounded-sm border border-gray-200 overflow-hidden">
            <div className="animate-pulse">
                <div className="bg-gray-700 h-12"></div>
                {Array.from({ length: rows }).map((_, i) => (
                    <div key={i} className="border-b border-gray-200 p-4">
                        <div className="flex gap-4">
                            {Array.from({ length: columns }).map((_, j) => (
                                <div key={j} className="flex-1">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default LoadingSkeleton

