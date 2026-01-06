"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import SearchBar from "@/components/admin/SearchBar";
import ExportButton from "@/components/admin/ExportButton";
import Pagination from "@/components/admin/Pagination";
import TableFilters from "@/components/admin/TableFilters";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import EditUserModal from "./edit-user-modal";

interface User {
    id?: string;
    _id?: string;
    userName: string;
    email: string;
    isAdmin: boolean;
    bookingCount: number;
    totalSpent: number;
    created_at?: string;
    createdAt?: string;
}

function UsersTableWithFeatures({ users }: { users: User[] }) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        role: "",
        status: "",
    });
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
    const [selectedUserToDelete, setSelectedUserToDelete] = useState<User | null>(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [userToEdit, setUserToEdit] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const itemsPerPage = 20;

    // Filter and search
    const filteredUsers = useMemo(() => {
        let filtered = users;
        
        // Apply search
        if (searchTerm) {
            filtered = filtered.filter(user =>
                user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        // Apply filters
        if (filters.role) {
            filtered = filtered.filter(user => 
                filters.role === 'admin' ? user.isAdmin : !user.isAdmin
            );
        }
        
        return filtered;
    }, [users, searchTerm, filters]);

    // Sort
    const sortedUsers = useMemo(() => {
        if (!sortConfig) return filteredUsers;
        
        return [...filteredUsers].sort((a, b) => {
            const aValue = (a as any)[sortConfig.key];
            const bValue = (b as any)[sortConfig.key];
            
            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredUsers, sortConfig]);

    // Paginate
    const paginatedUsers = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return sortedUsers.slice(start, start + itemsPerPage);
    }, [sortedUsers, currentPage]);

    const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

    const handleSort = (key: string) => {
        setSortConfig(prev => {
            if (prev?.key === key) {
                return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
            }
            return { key, direction: 'asc' };
        });
    };

    const handleFilterChange = (key: string, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setFilters({ role: "", status: "" });
        setSearchTerm("");
        setCurrentPage(1);
    };

    const handleEditClick = (user: User) => {
        setUserToEdit(user);
        setShowEditModal(true);
    };

    const handleDeleteClick = (user: User) => {
        setSelectedUserToDelete(user);
        setShowDeleteDialog(true);
    };

    const handleDelete = async () => {
        if (!selectedUserToDelete) return;
        
        try {
            setLoading(true);
            const userId = selectedUserToDelete.id || selectedUserToDelete._id;
            await axios.delete(`/api/admin/users/${userId}`);
            toast.success("User deleted successfully");
            router.refresh();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete user");
        } finally {
            setLoading(false);
            setSelectedUserToDelete(null);
            setShowDeleteDialog(false);
        }
    };

    const handleEditSuccess = () => {
        router.refresh();
    };

    const filterOptions = [
        {
            key: "role",
            label: "Role",
            type: "select" as const,
            options: [
                { value: "", label: "All Roles" },
                { value: "admin", label: "Admin" },
                { value: "user", label: "User" },
            ],
        },
    ];

    return (
        <>
            <ConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() => {
                    setShowDeleteDialog(false);
                    setSelectedUserToDelete(null);
                }}
                onConfirm={handleDelete}
                title="Delete User"
                message={`Are you sure you want to delete user "${selectedUserToDelete?.userName}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
            />

            <EditUserModal
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setUserToEdit(null);
                }}
                user={userToEdit}
                onSuccess={handleEditSuccess}
            />

            <div className="mb-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex-1">
                    <SearchBar
                        placeholder="Search users by name or email..."
                        onSearch={setSearchTerm}
                    />
                </div>
                <ExportButton
                    data={sortedUsers}
                    filename="users"
                    headers={["User Name", "Email", "Role", "Bookings", "Total Spent", "Joined"]}
                    fields={["userName", "email", "isAdmin", "bookingCount", "totalSpent", "created_at"]}
                />
            </div>

            <TableFilters
                filters={filterOptions}
                values={filters}
                onChange={handleFilterChange}
                onClear={clearFilters}
            />

            <div className="bg-white rounded-sm border border-gray-200 overflow-hidden shadow-sm">
                <table className="w-full">
                    <thead className="bg-gray-700 text-white">
                        <tr>
                            <th 
                                className="px-4 py-3 text-left text-sm font-semibold cursor-pointer hover:bg-gray-600"
                                onClick={() => handleSort("userName")}
                            >
                                <div className="flex items-center gap-2">
                                    User Name
                                    {sortConfig?.key === "userName" && (
                                        <i className={`ri-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'}-line`}></i>
                                    )}
                                </div>
                            </th>
                            <th 
                                className="px-4 py-3 text-left text-sm font-semibold cursor-pointer hover:bg-gray-600"
                                onClick={() => handleSort("email")}
                            >
                                <div className="flex items-center gap-2">
                                    Email
                                    {sortConfig?.key === "email" && (
                                        <i className={`ri-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'}-line`}></i>
                                    )}
                                </div>
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Role</th>
                            <th 
                                className="px-4 py-3 text-left text-sm font-semibold cursor-pointer hover:bg-gray-600"
                                onClick={() => handleSort("bookingCount")}
                            >
                                <div className="flex items-center gap-2">
                                    Bookings
                                    {sortConfig?.key === "bookingCount" && (
                                        <i className={`ri-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'}-line`}></i>
                                    )}
                                </div>
                            </th>
                            <th 
                                className="px-4 py-3 text-left text-sm font-semibold cursor-pointer hover:bg-gray-600"
                                onClick={() => handleSort("totalSpent")}
                            >
                                <div className="flex items-center gap-2">
                                    Total Spent
                                    {sortConfig?.key === "totalSpent" && (
                                        <i className={`ri-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'}-line`}></i>
                                    )}
                                </div>
                            </th>
                            <th 
                                className="px-4 py-3 text-left text-sm font-semibold cursor-pointer hover:bg-gray-600"
                                onClick={() => handleSort("created_at")}
                            >
                                <div className="flex items-center gap-2">
                                    Joined
                                    {sortConfig?.key === "created_at" && (
                                        <i className={`ri-arrow-${sortConfig.direction === 'asc' ? 'up' : 'down'}-line`}></i>
                                    )}
                                </div>
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedUsers.map((user: any) => (
                            <tr key={user.id || user._id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm">{user.userName}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                                <td className="px-4 py-3 text-sm">
                                    {user.isAdmin ? (
                                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">Admin</span>
                                    ) : (
                                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">User</span>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-sm">{user.bookingCount || 0}</td>
                                <td className="px-4 py-3 text-sm">₹{user.totalSpent || 0}</td>
                                <td className="px-4 py-3 text-sm text-gray-500">
                                    {dayjs(user.created_at || user.createdAt).format("DD/MM/YYYY")}
                                </td>
                                <td className="px-4 py-3 text-sm">
                                    <div className="flex items-center gap-3">
                                        <Link
                                            href={`/admin/users/${user.id || user._id}`}
                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                                        >
                                            View Details
                                        </Link>
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            onClick={() => handleEditClick(user)}
                                            className="bg-blue-100 hover:bg-blue-200 text-blue-700"
                                            aria-label="Edit user"
                                        >
                                            <i className="ri-pencil-line"></i>
                                        </Button>
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            onClick={() => handleDeleteClick(user)}
                                            isLoading={loading && (selectedUserToDelete?.id === user.id || selectedUserToDelete?._id === user._id)}
                                            className="bg-red-100 hover:bg-red-200 text-red-700"
                                            aria-label="Delete user"
                                        >
                                            {!(loading && (selectedUserToDelete?.id === user.id || selectedUserToDelete?._id === user._id)) && (
                                                <i className="ri-delete-bin-line"></i>
                                            )}
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {sortedUsers.length === 0 && (
                <div className="text-center py-10 text-gray-500 bg-white rounded-sm border border-gray-200 mt-5">
                    <p className="text-lg">
                        {searchTerm || filters.role ? "No users found matching your criteria." : "No users found."}
                    </p>
                </div>
            )}

            {sortedUsers.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalItems={sortedUsers.length}
                    itemsPerPage={itemsPerPage}
                />
            )}
        </>
    );
}

export default UsersTableWithFeatures;

