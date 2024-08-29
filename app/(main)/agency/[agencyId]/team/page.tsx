import React from 'react'
import { db } from '@/lib/db'
import DataTable from '@/app/(main)/agency/[agencyId]/team/data-table'
import { PlusIcon } from 'lucide-react'
import { currentUser } from '@clerk/nextjs/server'
import { columns } from '@/app/(main)/agency/[agencyId]/team/columns'
import SendInvitation from '@/components/forms/send-invitation'

type Props = {
    params: {
        agencyId: string
    }
}

const Page = async ({ params }: Props) => {
    const authUser = await currentUser()
    const teammembers = await db.user.findMany({
        where: {
            Agency: {
                id: params.agencyId,
            },
        },
        include: {
            Agency: { include: { SubAccount: true } },
            Permissions: {
                include: {
                    SubAccount: true,
                },
            },
        },
    })
    if (!teammembers) return null
    const agencyDetails = await db.agency.findUnique({
        where: {
            id: params.agencyId,
        },
        include: {
            SubAccount: true,
        },
    })
    if (!agencyDetails) return null
    return (
        <DataTable
            actionButtonText={
                <>
                    <PlusIcon size={15} /> Add{' '}
                </>
            }
            modalChildren={<SendInvitation agencyId={params.agencyId} />}
            filterValue={'name'}
            columns={columns}
            data={teammembers}></DataTable>
    )
}

export default Page
