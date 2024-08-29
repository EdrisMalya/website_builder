'use client'
import React from 'react'
import { useModal } from '@/providers/model-provider'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

type Props = {
    title: string
    subheading: string
    children: React.ReactNode
    defaultOpen?: boolean
}

const CustomModel = ({ title, subheading, children, defaultOpen }: Props) => {
    const { isOpen, setClose } = useModal()
    return (
        <Dialog open={isOpen || defaultOpen} onOpenChange={setClose}>
            <DialogContent
                title={'Test'}
                className={
                    'overflow-y-scroll dark:border-gray-900 md:max-w-[700px] md:max-h-[700px] md:h-fit h-screen bg-card'
                }>
                <DialogHeader className={'pt-8 text-left'}>
                    <DialogTitle className={'text-2xl font-bold'}>
                        {title}
                    </DialogTitle>
                    <DialogDescription>{subheading}</DialogDescription>
                    {children}
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default CustomModel
