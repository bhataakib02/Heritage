'use client'
import { Button } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import React from 'react'

function RefreshButton() {
    const router = useRouter()
    const [isRefreshing, setIsRefreshing] = React.useState(false)

    const handleRefresh = () => {
        setIsRefreshing(true)
        router.refresh()
        setTimeout(() => {
            setIsRefreshing(false)
        }, 500)
    }

    return (
        <Button
            isIconOnly
            onClick={handleRefresh}
            isLoading={isRefreshing}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700"
            aria-label="Refresh"
        >
            {!isRefreshing && <i className="ri-refresh-line text-lg"></i>}
        </Button>
    )
}

export default RefreshButton

