"use client";
import { EventType } from "@/interfaces/events";
import React, { useState, useMemo } from "react";
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
import SearchBar from "@/components/admin/SearchBar";
import ExportButton from "@/components/admin/ExportButton";
import Pagination from "@/components/admin/Pagination";
import DuplicateEventButton from "./duplicate-event-button";
import BulkActions from "@/components/admin/BulkActions";

function EventsTableWithFeatures({ events }: { events: EventType[] }) {
    const router = useRouter();
    const [selectedIdToDelete, setSelectedIdToDelete] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
    const [eventToDelete, setEventToDelete] = React.useState<{ id: string; name: string } | null>(null);
    const [selectedEvents, setSelectedEvents] = React.useState<Set<string>>(new Set());
    const [bulkDeleteLoading, setBulkDeleteLoading] = React.useState(false);
    const [showBulkConfirmDialog, setShowBulkConfirmDialog] = React.useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
    const itemsPerPage = 20;

    // Filter and search
    const filteredEvents = useMemo(() => {
        let filtered = events;
        
        // Apply search
        if (searchTerm) {
            filtered = filtered.filter(event =>
                event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.location.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        return filtered;
    }, [events, searchTerm]);

    // Sort
    const sortedEvents = useMemo(() => {
        if (!sortConfig) return filteredEvents;
        
        return [...filteredEvents].sort((a, b) => {
            const aValue = (a as any)[sortConfig.key];
            const bValue = (b as any)[sortConfig.key];
            
            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredEvents, sortConfig]);

    // Paginate
    const paginatedEvents = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return sortedEvents.slice(start, start + itemsPerPage);
    }, [sortedEvents, currentPage]);

    const totalPages = Math.ceil(sortedEvents.length / itemsPerPage);

    const handleSort = (key: string) => {
        setSortConfig(prev => {
            if (prev?.key === key) {
                return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
            }
            return { key, direction: 'asc' };
        });
    };

    const handleDeleteClick = (id: string, name: string) => {
        setEventToDelete({ id, name });
        setShowConfirmDialog(true);
    };

    const onDelete = async () => {
        if (!eventToDelete) return;
        try {
            setLoading(true);
            setSelectedIdToDelete(eventToDelete.id);
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

    const handleBulkDelete = async () => {
        try {
            setBulkDeleteLoading(true);
            await Promise.all(
                Array.from(selectedEvents).map(id => axios.delete(`/api/admin/events/${id}`))
            );
            toast.success(`${selectedEvents.size} event(s) deleted successfully`);
            setSelectedEvents(new Set());
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Failed to delete events");
        } finally {
            setBulkDeleteLoading(false);
            setShowBulkConfirmDialog(false);
        }
    };

    const handleSelectAll = () => {
        if (selectedEvents.size === paginatedEvents.length) {
            setSelectedEvents(new Set());
        } else {
            setSelectedEvents(new Set(paginatedEvents.map(e => e.id || e._id).filter(Boolean) as string[]));
        }
    };

    const handleSelectEvent = (eventId: string) => {
        const newSelected = new Set(selectedEvents);
        if (newSelected.has(eventId)) {
            newSelected.delete(eventId);
        } else {
            newSelected.add(eventId);
        }
        setSelectedEvents(newSelected);
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
            
            <ConfirmDialog
                isOpen={showBulkConfirmDialog}
                onClose={() => setShowBulkConfirmDialog(false)}
                onConfirm={handleBulkDelete}
                title="Delete Selected Events"
                message={`Are you sure you want to delete ${selectedEvents.size} event(s)? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
            />

            <BulkActions
                selectedCount={selectedEvents.size}
                onDelete={() => setShowBulkConfirmDialog(true)}
                onClearSelection={() => setSelectedEvents(new Set())}
            />
            
            <div className="mb-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex-1">
                    <SearchBar
                        placeholder="Search events by name, organizer, or location..."
                        onSearch={setSearchTerm}
                    />
                </div>
                <ExportButton
                    data={sortedEvents}
                    filename="events"
                    headers={["Name", "Organizer", "Date", "Time", "Location"]}
                    fields={["name", "organizer", "date", "time", "location"]}
                />
            </div>

            <div className="bg-white rounded-sm border border-gray-200 overflow-hidden shadow-sm">
                <Table aria-label="Events table" removeWrapper>
                    <TableHeader>
                        <TableColumn className="bg-gray-700 text-white font-semibold w-12">
                            <input
                                type="checkbox"
                                checked={selectedEvents.size === paginatedEvents.length && paginatedEvents.length > 0}
                                onChange={handleSelectAll}
                                className="cursor-pointer"
                            />
                        </TableColumn>
                        <TableColumn className="bg-gray-700 text-white font-semibold">
                            <div 
                                className="flex items-center gap-2 cursor-pointer hover:opacity-80"
                                onClick={() => handleSort("name")}
                            >
                                Name
                                {sortConfig?.key === "name" && (
                                    <i className={`ri-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'}-line`}></i>
                                )}
                            </div>
                        </TableColumn>
                        <TableColumn className="bg-gray-700 text-white font-semibold">
                            <div 
                                className="flex items-center gap-2 cursor-pointer hover:opacity-80"
                                onClick={() => handleSort("organizer")}
                            >
                                Organizer
                                {sortConfig?.key === "organizer" && (
                                    <i className={`ri-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'}-line`}></i>
                                )}
                            </div>
                        </TableColumn>
                        <TableColumn className="bg-gray-700 text-white font-semibold">
                            <div 
                                className="flex items-center gap-2 cursor-pointer hover:opacity-80"
                                onClick={() => handleSort("date")}
                            >
                                Date
                                {sortConfig?.key === "date" && (
                                    <i className={`ri-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'}-line`}></i>
                                )}
                            </div>
                        </TableColumn>
                        <TableColumn className="bg-gray-700 text-white font-semibold">
                            <div 
                                className="flex items-center gap-2 cursor-pointer hover:opacity-80"
                                onClick={() => handleSort("time")}
                            >
                                Time
                                {sortConfig?.key === "time" && (
                                    <i className={`ri-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'}-line`}></i>
                                )}
                            </div>
                        </TableColumn>
                        <TableColumn className="bg-gray-700 text-white font-semibold">
                            <div 
                                className="flex items-center gap-2 cursor-pointer hover:opacity-80"
                                onClick={() => handleSort("location")}
                            >
                                Location
                                {sortConfig?.key === "location" && (
                                    <i className={`ri-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'}-line`}></i>
                                )}
                            </div>
                        </TableColumn>
                        <TableColumn className="bg-gray-700 text-white font-semibold">Actions</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {paginatedEvents.map((event) => {
                            const eventId = String(event.id || event._id || '');
                            if (!eventId) return null;
                            return (
                                <TableRow key={eventId}>
                                    <TableCell>
                                        <input
                                            type="checkbox"
                                            checked={selectedEvents.has(eventId)}
                                            onChange={() => handleSelectEvent(eventId)}
                                            className="cursor-pointer"
                                        />
                                    </TableCell>
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
                                            <DuplicateEventButton eventId={eventId} />
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

            {sortedEvents.length === 0 && (
                <div className="text-center py-10 bg-white rounded-sm border border-gray-200 mt-5">
                    <p className="text-gray-500 text-lg">
                        {searchTerm ? "No events found matching your search." : "No events found."}
                    </p>
                </div>
            )}

            {sortedEvents.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalItems={sortedEvents.length}
                    itemsPerPage={itemsPerPage}
                />
            )}
        </>
    );
}

export default EventsTableWithFeatures;

