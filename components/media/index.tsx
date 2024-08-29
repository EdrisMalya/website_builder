import React from 'react'
import { GetMediaFiles } from '@/lib/types'
import MediaUploadButton from '@/components/media/upload-button'
import {
    Command,
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import MediaCart from '@/components/media/media-cart'

type Props = {
    data: GetMediaFiles
    subaccountId: string
}

const MediaComponent = ({ data, subaccountId }: Props) => {
    return (
        <div className={'flex flex-col gap-4 h-full w-full'}>
            <div className={'flex justify-between items-center'}>
                <h2 className={'text-4xl'}>Media Buket</h2>
                <MediaUploadButton subaccountId={subaccountId} />
            </div>
            <Command className={'bg-transparent'}>
                <CommandInput placeholder={'Search for file name...'} />
                <CommandList className={'pb-48 max-h-max'}>
                    <CommandEmpty>No Media Files</CommandEmpty>
                    <div className={'flex flex-wrap gap-4 pt-4'}>
                        {data?.Media.map(file => (
                            <CommandItem
                                key={file.id}
                                className={
                                    'p-0 max-w-[320px] w-full rounded-lg !bg-transparent !font-medium !text-white'
                                }>
                                <MediaCart file={file} />
                            </CommandItem>
                        ))}
                    </div>
                </CommandList>
            </Command>
        </div>
    )
}

export default MediaComponent
