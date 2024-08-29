import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { db } from '@/lib/db'
import CheckCircle from '@/components/icons/check_circled'
import { CheckCircleIcon } from 'lucide-react'
import Link from 'next/link'

type Props = {
    params: {
        agencyId: string
    }
    searchParams: { code: string }
}

const Page = async ({ params, searchParams }: Props) => {
    const agencyDetails = await db.agency.findUnique({
        where: {
            id: params.agencyId,
        },
    })
    if (!agencyDetails) return
    const allDetailsExist =
        agencyDetails.address &&
        agencyDetails.agencyLogo &&
        agencyDetails.city &&
        agencyDetails.companyEmail &&
        agencyDetails.companyPhone &&
        agencyDetails.country &&
        agencyDetails.name &&
        agencyDetails.state &&
        agencyDetails.zipCode

    return (
        <div className={'flex flex-col justify-center items-center'}>
            <div className={'w-full h-full max-w-[800px]'}>
                <Card className={'border-none'}>
                    <CardHeader>
                        <CardTitle>Lets get started!</CardTitle>
                        <CardDescription>
                            Follow the steps below to get yur account setup.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className={'flex flex-col gap-4'}>
                        <div
                            className={
                                'flex justify-between items-center w-full border p-4 rounded-lg gap-2 dark:border-gray-800'
                            }>
                            <div className="flex md:items-center gap-4 flex-col md:!flex-row">
                                <Image
                                    src={'/appstore.png'}
                                    alt={'App logo'}
                                    width={80}
                                    height={80}
                                    className={'rounded-md object-contain'}
                                />
                                <p className={'flex-1'}>
                                    Save the website as a shortcut on your
                                    mobile device
                                </p>
                            </div>
                            <Button>Start</Button>
                        </div>{' '}
                        <div
                            className={
                                'flex justify-between items-center w-full border p-4 rounded-lg gap-2 dark:border-gray-800'
                            }>
                            <div className="flex md:items-center gap-4 flex-col md:!flex-row">
                                <Image
                                    src={'/stripelogo.png'}
                                    alt={'App logo'}
                                    width={80}
                                    height={80}
                                    className={'rounded-md object-contain'}
                                />
                                <p className={'flex-1'}>
                                    Connect your stripe account to accept
                                    payments and see your dashboard
                                </p>
                            </div>
                            <Button>Start</Button>
                        </div>{' '}
                        <div
                            className={
                                'flex justify-between items-center w-full border p-4 rounded-lg gap-2 dark:border-gray-800'
                            }>
                            <div className="flex md:items-center gap-4 flex-col md:!flex-row">
                                <Image
                                    src={agencyDetails.agencyLogo}
                                    alt={'App logo'}
                                    width={80}
                                    height={80}
                                    className={'rounded-md object-contain'}
                                />
                                <p className={'flex-1'}>
                                    Fill in all your business details
                                </p>
                            </div>
                            {allDetailsExist ? (
                                <CheckCircleIcon
                                    size={50}
                                    className={'text-pretty p-2 flex-shrink-0'}
                                />
                            ) : (
                                <Link
                                    className={
                                        'bg-primary py-2 px-4 rounded-md'
                                    }
                                    href={`/agency/${agencyDetails.id}/settings`}>
                                    Start
                                </Link>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default Page
