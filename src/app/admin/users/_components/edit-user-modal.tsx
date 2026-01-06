'use client'
import React, { useEffect } from 'react'
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Select,
    SelectItem,
} from '@nextui-org/react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface User {
    id?: string
    _id?: string
    userName: string
    email: string
    isAdmin: boolean
    isActive?: boolean
}

interface EditUserModalProps {
    isOpen: boolean
    onClose: () => void
    user: User | null
    onSuccess: () => void
}

function EditUserModal({ isOpen, onClose, user, onSuccess }: EditUserModalProps) {
    const router = useRouter()
    const [loading, setLoading] = React.useState(false)
    const [formData, setFormData] = React.useState({
        userName: '',
        email: '',
        isAdmin: false,
        isActive: true,
    })

    useEffect(() => {
        if (user) {
            setFormData({
                userName: user.userName || '',
                email: user.email || '',
                isAdmin: user.isAdmin || false,
                isActive: user.isActive !== undefined ? user.isActive : true,
            })
        }
    }, [user])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        try {
            setLoading(true)
            const userId = user.id || user._id
            await axios.put(`/api/admin/users/${userId}`, formData)
            toast.success('User updated successfully')
            onSuccess()
            onClose()
            router.refresh()
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update user')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="md">
            <form onSubmit={handleSubmit}>
                <ModalContent>
                    <ModalHeader>Edit User</ModalHeader>
                    <ModalBody>
                        <Input
                            label="User Name"
                            value={formData.userName}
                            onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                            isRequired
                            isDisabled={loading}
                        />
                        <Input
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            isRequired
                            isDisabled={loading}
                        />
                        <Select
                            label="Role"
                            selectedKeys={formData.isAdmin ? ['admin'] : ['user']}
                            onSelectionChange={(keys) => {
                                const value = Array.from(keys)[0] as string
                                setFormData({ ...formData, isAdmin: value === 'admin' })
                            }}
                            isDisabled={loading}
                        >
                            <SelectItem key="user" value="user">User</SelectItem>
                            <SelectItem key="admin" value="admin">Admin</SelectItem>
                        </Select>
                        <Select
                            label="Status"
                            selectedKeys={formData.isActive ? ['active'] : ['inactive']}
                            onSelectionChange={(keys) => {
                                const value = Array.from(keys)[0] as string
                                setFormData({ ...formData, isActive: value === 'active' })
                            }}
                            isDisabled={loading}
                        >
                            <SelectItem key="active" value="active">Active</SelectItem>
                            <SelectItem key="inactive" value="inactive">Inactive</SelectItem>
                        </Select>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="flat" onClick={onClose} isDisabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" color="primary" isLoading={loading}>
                            Update User
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </form>
        </Modal>
    )
}

export default EditUserModal

