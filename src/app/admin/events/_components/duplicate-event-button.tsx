'use client'
import { Button } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import React from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

interface DuplicateEventButtonProps {
    eventId: string
}

function DuplicateEventButton({ eventId }: DuplicateEventButtonProps) {
    const router = useRouter()
    const [loading, setLoading] = React.useState(false)

    const handleDuplicate = async () => {
        try {
            setLoading(true)
            const response = await axios.post(`/api/admin/events/${eventId}/duplicate`)
            toast.success("Event duplicated successfully")
            router.push(`/admin/events/edit-event/${response.data.id}`)
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to duplicate event")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button
            size="sm"
            variant="flat"
            onClick={handleDuplicate}
            isLoading={loading}
            startContent={!loading && <i className="ri-file-copy-line"></i>}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700"
        >
            Duplicate
        </Button>
    )
}

export default DuplicateEventButton

