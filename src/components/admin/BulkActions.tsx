'use client'
import React from 'react'
import { Button } from '@nextui-org/react'
import ConfirmDialog from './ConfirmDialog'

interface BulkActionsProps {
    selectedCount: number
    onDelete: () => void
    onClearSelection: () => void
}

function BulkActions({ selectedCount, onDelete, onClearSelection }: BulkActionsProps) {
    const [showConfirmDialog, setShowConfirmDialog] = React.useState(false)

    if (selectedCount === 0) return null

    return (
        <>
            <ConfirmDialog
                isOpen={showConfirmDialog}
                onClose={() => setShowConfirmDialog(false)}
                onConfirm={onDelete}
                title="Delete Selected Items"
                message={`Are you sure you want to delete ${selectedCount} item(s)? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
            />
            <div className="bg-blue-50 border border-blue-200 rounded-sm p-4 mb-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="font-medium text-blue-900">
                        {selectedCount} item(s) selected
                    </span>
                </div>
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="flat"
                        onClick={onClearSelection}
                    >
                        Clear Selection
                    </Button>
                    <Button
                        size="sm"
                        color="danger"
                        onClick={() => setShowConfirmDialog(true)}
                    >
                        Delete Selected
                    </Button>
                </div>
            </div>
        </>
    )
}

export default BulkActions

