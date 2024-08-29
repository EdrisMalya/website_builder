import React from 'react'
import { getMedia } from '@/lib/queries'
import MediaComponent from '@/components/media'

type Props = {
    params: { subaccountId: string }
}

const MediaPage = async ({ params }: Props) => {
    const data = await getMedia(params.subaccountId)
    return (
        <div>
            <MediaComponent data={data} subaccountId={params.subaccountId} />
        </div>
    )
}

export default MediaPage
