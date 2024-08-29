'use client'
import React from 'react'
import { useModal } from '@/providers/model-provider'
import { Button } from '@/components/ui/button'
import CustomModel from '@/components/global/custom-model'
import UploadMediaForm from '@/components/forms/upload-media'

type Props = {
    subaccountId: string
}

const MediaUploadButton = ({ subaccountId }: Props) => {
    const { isOpen, setOpen, setClose } = useModal()
    return (
        <Button
            onClick={() => {
                setOpen(
                    <CustomModel
                        title={'Upload Media'}
                        subheading={'Upload a file yo your media bucket'}>
                        <UploadMediaForm subaccountId={subaccountId} />
                    </CustomModel>,
                )
            }}>
            Upload
        </Button>
    )
}

export default MediaUploadButton
