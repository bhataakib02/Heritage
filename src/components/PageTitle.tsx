'use client'
import { Button } from '@nextui-org/react';
import React from 'react';
import { useRouter } from 'next/navigation';
import RefreshButton from './RefreshButton';

interface PageTitleProps {
    title: string;
    showRefresh?: boolean;
}

function PageTitle({ title, showRefresh = false }: PageTitleProps) {
    const router = useRouter();
    return (
        <div className="flex gap-5 items-center">
            <Button 
                isIconOnly 
                onClick={() => router.back()}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700"
                aria-label="Go back"
            >
                <i className="ri-arrow-left-line"></i>
            </Button>
            <h1 className="text-2xl font-semibold text-gray-600">{title}</h1>
            {showRefresh && <RefreshButton />}
        </div>
    )
}

export default PageTitle