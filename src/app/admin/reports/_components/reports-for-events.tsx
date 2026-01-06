'use client'
import { EventType } from "@/interfaces/events";
import React from "react";
import { useRouter } from "next/navigation";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Button,
} from "@nextui-org/react";
import axios from "axios";
import toast from "react-hot-toast";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

function EventsTableForReports({ events }: { events: EventType[] }) {
    const router = useRouter();
    const [selectedEventToDelete, setSelectedEventToDelete] = React.useState<{ id: string; name: string } | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [deletingEventId, setDeletingEventId] = React.useState<string>("");

    const handleDeleteClick = (eventId: string, eventName: string) => {
        setSelectedEventToDelete({ id: eventId, name: eventName });
        setShowDeleteDialog(true);
    };

    const handleDelete = async () => {
        if (!selectedEventToDelete) return;
        
        try {
            setLoading(true);
            setDeletingEventId(selectedEventToDelete.id);
            await axios.delete(`/api/admin/events/${selectedEventToDelete.id}`);
            toast.success("Museum deleted successfully");
            router.refresh();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete museum");
        } finally {
            setLoading(false);
            setSelectedEventToDelete(null);
            setShowDeleteDialog(false);
            setDeletingEventId("");
        }
    };

    return (
        <>
            <ConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() => {
                    setShowDeleteDialog(false);
                    setSelectedEventToDelete(null);
                }}
                onConfirm={handleDelete}
                title="Delete Museum"
                message={`Are you sure you want to delete "${selectedEventToDelete?.name}"? This will also delete all associated bookings. This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
            />
            
            <div className="bg-white rounded-sm border border-gray-200 overflow-hidden shadow-sm">
                <Table aria-label="Reports events table" removeWrapper>
                    <TableHeader>
                        {["Name", "Organizer", "Date", "Time", "Location", "Actions"].map(
                            (column) => (
                                <TableColumn className="bg-gray-700 text-white font-semibold" key={column}>
                                    {column}
                                </TableColumn>
                            )
                        )}
                    </TableHeader>
                    <TableBody>
                        {events.map((event) => {
                            const eventId = String(event.id || event._id || '');
                            return (
                                <TableRow key={eventId}>
                                    <TableCell>{event.name}</TableCell>
                                    <TableCell>{event.organizer}</TableCell>
                                    <TableCell>{event.date}</TableCell>
                                    <TableCell>{event.time}</TableCell>
                                    <TableCell>{event.location}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                onClick={() => {
                                                    router.push(`/admin/reports/${eventId}`);
                                                }}
                                                className="bg-primary text-white hover:bg-primary/90"
                                            >
                                                View Report
                                            </Button>
                                            <Button
                                                size="sm"
                                                isIconOnly
                                                onClick={() => handleDeleteClick(eventId, event.name)}
                                                isLoading={loading && deletingEventId === eventId}
                                                className="bg-red-100 hover:bg-red-200 text-red-700"
                                                aria-label="Delete museum"
                                            >
                                                {deletingEventId !== eventId && (
                                                    <i className="ri-delete-bin-line"></i>
                                                )}
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}

export default EventsTableForReports;