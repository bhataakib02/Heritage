import LoadingSkeleton from "@/components/admin/LoadingSkeleton"

export default function Loading() {
    return (
        <div>
            <div className="mb-5">
                <div className="h-10 bg-gray-200 rounded w-64 animate-pulse"></div>
            </div>
            <LoadingSkeleton rows={10} columns={6} />
        </div>
    )
}

