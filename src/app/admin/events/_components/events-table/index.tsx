"use client";
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

function EventsTable({ events }: { events: EventType[] }) {
    const router = useRouter();
    const [selectedIdToDelete, setSelectedIdToDelete] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
    const [eventToDelete, setEventToDelete] = React.useState<{ id: string; name: string } | null>(null);

    const handleDeleteClick = (id: string, name: string) => {
        setEventToDelete({ id, name });
        setShowConfirmDialog(true);
    };

    const onDelete = async () => {
        if (!eventToDelete) return;
        try {
            setLoading(true);
            await axios.delete(`/api/admin/events/${eventToDelete.id}`);
            toast.success("Event Deleted Successfully");
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Failed to delete event");
        } finally {
            setSelectedIdToDelete("");
            setLoading(false);
            setEventToDelete(null);
            setShowConfirmDialog(false);
        }
    };

    return (
        <>
            <ConfirmDialog
                isOpen={showConfirmDialog}
                onClose={() => {
                    setShowConfirmDialog(false);
                    setEventToDelete(null);
                }}
                onConfirm={onDelete}
                title="Delete Event"
                message={`Are you sure you want to delete "${eventToDelete?.name}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
            />
            <div className="bg-white rounded-sm border border-gray-200 overflow-hidden shadow-sm">
                <Table aria-label="Events table" removeWrapper>
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
                    {events
                        .filter((event) => event.id || event._id)
                        .map((event) => {
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
                                            isIconOnly
                                            size="sm"
                                            onClick={() =>
                                                router.push(`/admin/events/edit-event/${eventId}`)
                                            }
                                            className="bg-blue-100 hover:bg-blue-200 text-blue-700"
                                            aria-label="Edit event"
                                        >
                                            <i className="ri-pencil-line"></i>
                                        </Button>
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            onClick={() => handleDeleteClick(eventId, event.name)}
                                            isLoading={loading && selectedIdToDelete === eventId}
                                            className="bg-red-100 hover:bg-red-200 text-red-700"
                                            aria-label="Delete event"
                                        >
                                            {selectedIdToDelete !== eventId && (
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

export default EventsTable;