import React from 'react'
import { getAuthUserDetails, verifyAndAcceptInvitation } from '@/lib/queries'
import Unauthorized from '@/components/unauthorized'
import { search } from 'effect/String'
import { redirect } from 'next/navigation'

type Props = {
    searchParams: { state: string; code: string }
}

const SubAccountMainPage = async ({ searchParams }: Props) => {
    const agencyId = await verifyAndAcceptInvitation()
    if (!agencyId) {
        return <Unauthorized />
    }
    const user = await getAuthUserDetails()
    if (!user) return
    const getFirstSubAccountWithAccess = user.Permissions.find(
        permission => permission.access,
    )
    if (searchParams.state) {
        const statePath = searchParams.state.split('___')[0]
        const stateSubAccountId = searchParams.state.split('___')[1]
        if (!stateSubAccountId) return <Unauthorized />
        return redirect(
            `/subaccount/${stateSubAccountId}/${statePath}?code=${searchParams.code}`,
        )
    }
    if (getFirstSubAccountWithAccess) {
        return redirect(
            `/subaccount/${getFirstSubAccountWithAccess.subAccountId}`,
        )
    }
    return <Unauthorized />
}

export default SubAccountMainPage
