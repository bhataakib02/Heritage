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

function EventsTableForReports({ events }: { events: EventType[] }) {
    const router = useRouter();
    return (
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
                    {events.map((event) => (
                        <TableRow key={event.id || event._id}>
                            <TableCell>{event.name}</TableCell>
                            <TableCell>{event.organizer}</TableCell>
                            <TableCell>{event.date}</TableCell>
                            <TableCell>{event.time}</TableCell>
                            <TableCell>{event.location}</TableCell>
                            <TableCell>
                                <Button
                                    size="sm"
                                    onClick={() => {
                                        router.push(`/admin/reports/${event.id || event._id}`);
                                    }}
                                    className="bg-primary text-white hover:bg-primary/90"
                                >
                                    View Report
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default EventsTableForReports;