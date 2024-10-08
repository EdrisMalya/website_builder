import { Notification, Prisma, Role } from '@prisma/client'
import { getAuthUserDetails, getMedia, getUserPermissions } from '@/lib/queries'
import { db } from '@/lib/db'

export type NotificationWithUser =
    | ({
          User: {
              id: string
              name: string
              avatarUrl: string
              email: string
              createdAt: Date
              updatedAt: Date
              role: Role
              agencyId: string | null
          }
      } & Notification)[]
    | undefined

export type UserWithPermissionWithSubAccounts = Prisma.PromiseReturnType<
    typeof getUserPermissions
>
export type AuthUserWithAgencySigebarOptionsSubAccounts =
    Prisma.PromiseReturnType<typeof getAuthUserDetails>

const __getUsersWithAgencySubAccountPermissionsSidebarOptions = async (
    agencyId: string,
) => {
    return await db.user.findFirst({
        where: { Agency: { id: agencyId } },
        include: {
            Agency: { include: { SubAccount: true } },
            Permissions: { include: { SubAccount: true } },
        },
    })
}

export type UsersWithAgencySubAccountPermissionsSidebarOptions =
    Prisma.PromiseReturnType<
        typeof __getUsersWithAgencySubAccountPermissionsSidebarOptions
    >

export type GetMediaFiles = Prisma.PromiseReturnType<typeof getMedia>

export type CreateMediaType = Prisma.MediaCreateWithoutSubaccountInput
