import React from 'react'
import { getAuthUserDetails } from '@/lib/queries'
import MenuOptions from '@/components/sidebar/menu-options'

type Props = {
    id: string
    type: 'agency' | 'subaccount'
}

const Sidebar = async ({ id, type }: Props) => {
    const user = await getAuthUserDetails()
    if (!user) return null
    if (!user.Agency) return

    const details =
        type === 'agency'
            ? user?.Agency
            : user?.Agency?.SubAccount?.find(subaccount => subaccount.id === id)
    const isWhitelabelAgency = user.Agency.whiteLabel
    let sidebarLogo = user.Agency.agencyLogo || '/assets/plura-logo.svg'
    if (!isWhitelabelAgency) {
        if (type === 'subaccount') {
            sidebarLogo =
                user?.Agency?.SubAccount?.find(sub => sub.id === id)
                    ?.subAccountLogo || user.Agency?.agencyLogo
        }
    }

    const sidebarOpt =
        type === 'agency'
            ? user.Agency?.SidebarOption || []
            : user.Agency.SubAccount.find(sub => sub.id === id)
                  ?.SidebarOption || []
    const subaccounts = user.Agency.SubAccount.filter(subaccount =>
        user.Permissions.find(
            permission =>
                permission.subAccountId === subaccount.id && permission.access,
        ),
    )

    return (
        <>
            <MenuOptions
                defaultOpen={true}
                details={details}
                id={id}
                sidebarLogo={sidebarLogo}
                sidebarOpt={sidebarOpt}
                subAccounts={subaccounts}
                user={user}
            />
            <MenuOptions
                details={details}
                id={id}
                sidebarLogo={sidebarLogo}
                sidebarOpt={sidebarOpt}
                subAccounts={subaccounts}
                user={user}
            />
        </>
    )
}

export default Sidebar
