'use client'
import React, { useEffect, useState } from 'react'
import { Agency } from '@prisma/client'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import FileUpload from '@/components/global/file-upload'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { NumberInput } from '@tremor/react'
import {
    deleteAgency,
    initUser,
    saveActivityLogNotification,
    updateAgencyDetails,
    upsertAgency,
} from '@/lib/queries'
import { Button } from '@/components/ui/button'
import Loading from '@/components/global/loading'
import { v4 } from 'uuid'

type Prop = {
    data?: Partial<Agency>
}

const FormSchema = z.object({
    name: z
        .string()
        .min(2, { message: 'Agency name must be at least 2 chars.' }),
    companyEmail: z.string().min(1),
    companyPhone: z.string().min(1),
    whiteLabel: z.boolean(),
    address: z.string().min(1),
    city: z.string().min(1),
    zipCode: z.string().min(1),
    state: z.string().min(1),
    country: z.string().min(1),
    agencyLogo: z.string().min(1),
})

const AgencyDetails = ({ data }: Prop) => {
    const { toast } = useToast()
    const router = useRouter()
    const [deletingAgency, setDeletingAgency] = useState(false)
    const form = useForm<z.infer<typeof FormSchema>>({
        mode: 'onChange',
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: data?.name,
            companyEmail: data?.companyEmail,
            companyPhone: data?.companyPhone,
            whiteLabel: data?.whiteLabel || false,
            address: data?.address,
            city: data?.city,
            zipCode: data?.zipCode,
            state: data?.state,
            country: data?.country,
            agencyLogo: data?.agencyLogo,
        },
    })

    const isLoading = form.formState.isSubmitting

    useEffect(() => {
        if (data) {
            form.reset(data)
        }
    }, [data])

    const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
        try {
            let newUserData
            let customerId
            if (!data?.id) {
                const bodyData = {
                    email: values.companyEmail,
                    name: values.name,
                    shipping: {
                        address: {
                            city: values.city,
                            country: values.country,
                            line1: values.address,
                            postal_code: values.zipCode,
                            state: values.zipCode,
                        },
                        name: values.name,
                    },
                    address: {
                        city: values.city,
                        country: values.country,
                        line1: values.address,
                        postal_code: values.zipCode,
                        state: values.zipCode,
                    },
                }
            }

            //TODO: Cst ID

            newUserData = await initUser({
                role: 'AGENCY_OWNER',
            })
            if (!data?.id) {
                await upsertAgency({
                    id: !data?.id ? v4() : data.id,
                    address: values.address,
                    agencyLogo: values.agencyLogo,
                    city: values.city,
                    companyPhone: values.companyPhone,
                    country: values.country,
                    name: values.name,
                    state: values.state,
                    whiteLabel: values.whiteLabel,
                    zipCode: values.zipCode,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    companyEmail: values.companyEmail,
                    connectAccountId: '',
                    goal: 5,
                })
                toast({
                    title: 'Created Agency',
                })
                return router.refresh()
            }
        } catch (err) {
            console.log(err)
            toast({
                variant: 'destructive',
                title: 'Oppse!',
                description: 'Could not create your agency',
            })
        }
    }

    const handleDeleteAgency = async () => {
        if (!data?.id) return
        setDeletingAgency(true)
        //TODO: discontinue the subscription
        try {
            const response = await deleteAgency(data.id)
            toast({
                title: 'Deleted Agency',
                description: 'Deleted your agency and all subaccounts',
            })
            router.refresh()
        } catch (error) {
            console.log(error)
            toast({
                variant: 'destructive',
                title: 'Oppse!',
                description: 'could not delete your agency ',
            })
        }
        setDeletingAgency(false)
    }

    return (
        <AlertDialog>
            <Card className={'w-full border-0'}>
                <CardHeader>
                    <CardTitle>Agency Information</CardTitle>
                    <CardDescription>
                        Lets create an agency for your business. You can edit
                        agency settings letter from the agency settings tab.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            className={'space-x-4'}
                            onSubmit={form.handleSubmit(handleSubmit)}>
                            <FormField
                                disabled={isLoading}
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className={'flex-1'}>
                                        <FormLabel>Agency logo</FormLabel>
                                        <FormControl>
                                            <FileUpload
                                                apiEndpoint={'agencyLogo'}
                                                onChange={field.onChange}
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                name={'agencyLogo'}
                            />
                            <div className={'flex md:flex-row gap-4 mt-2'}>
                                <FormField
                                    disabled={isLoading}
                                    render={({ field }) => (
                                        <FormItem className={'flex-1'}>
                                            <FormLabel>Agency Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={
                                                        'Your agency name'
                                                    }
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                    control={form.control}
                                    name={'name'}
                                />
                                <FormField
                                    disabled={isLoading}
                                    render={({ field }) => (
                                        <FormItem className={'flex-1'}>
                                            <FormLabel>Agency Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={
                                                        'Your agency name'
                                                    }
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                    control={form.control}
                                    name={'companyEmail'}
                                />
                            </div>
                            <div className="mt-3">
                                <FormField
                                    disabled={isLoading}
                                    render={({ field }) => (
                                        <FormItem className={'flex-1'}>
                                            <FormLabel>
                                                Agency Phone Number
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={'Phone'}
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                    control={form.control}
                                    name={'companyPhone'}
                                />
                            </div>
                            <div className="mt-2">
                                <FormField
                                    control={form.control}
                                    name="whiteLabel"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center  justify-between rounded-lg border dark:dark:border-gray-900 p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">
                                                    Whitelabel Agency
                                                </FormLabel>
                                                <FormDescription>
                                                    Turing on whitelabel mode
                                                    will show your agency logo
                                                    to all sub accounts by
                                                    default. You can overwrite
                                                    this functionality through
                                                    sub account settings.
                                                </FormDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="mt-2">
                                <FormField
                                    disabled={isLoading}
                                    render={({ field }) => (
                                        <FormItem className={'flex-1'}>
                                            <FormLabel>Address</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={'123 st...'}
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                    control={form.control}
                                    name={'address'}
                                />
                            </div>
                            <div className={'flex md:flex-row gap-4 mt-2'}>
                                <FormField
                                    disabled={isLoading}
                                    render={({ field }) => (
                                        <FormItem className={'flex-1'}>
                                            <FormLabel>City</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={'123 st...'}
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                    control={form.control}
                                    name={'city'}
                                />
                                <FormField
                                    disabled={isLoading}
                                    render={({ field }) => (
                                        <FormItem className={'flex-1'}>
                                            <FormLabel>State</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={'123 st...'}
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                    control={form.control}
                                    name={'state'}
                                />
                                <FormField
                                    disabled={isLoading}
                                    render={({ field }) => (
                                        <FormItem className={'flex-1'}>
                                            <FormLabel>Zipcode</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={'Zipcode'}
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                    control={form.control}
                                    name={'zipCode'}
                                />
                            </div>
                            <FormField
                                disabled={isLoading}
                                render={({ field }) => (
                                    <FormItem className={'flex-1'}>
                                        <FormLabel>Country</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={'Country'}
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                                control={form.control}
                                name={'country'}
                            />

                            {data?.id && (
                                <div className={'flex flex-col gap-2 mt-2'}>
                                    <FormLabel>Create A Goal</FormLabel>
                                    <FormDescription>
                                        ✨ Create a goal for your agency. As
                                        your business grows your goals grow too
                                        so dont forget to set the bar higher!
                                    </FormDescription>
                                    <NumberInput
                                        defaultValue={data?.goal}
                                        onValueChange={async val => {
                                            if (!data?.id) return
                                            await updateAgencyDetails(data.id, {
                                                goal: val,
                                            })
                                            await saveActivityLogNotification({
                                                agencyId: data.id,
                                                description: `Updated the agency goal to | ${val} Sub Account`,
                                                subAccountId: undefined,
                                            })
                                            router.refresh()
                                        }}
                                        min={1}
                                        className="bg-background !border !border-input"
                                        placeholder="Sub Account Goal"
                                    />
                                </div>
                            )}
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className={'mt-3'}>
                                {isLoading ? (
                                    <Loading />
                                ) : (
                                    'Save Agency Information'
                                )}
                            </Button>
                        </form>
                    </Form>
                    {data?.id && (
                        <div
                            className={
                                'flex flex-row items-center justify-between rounded-lg border border-destructive gap-4 p-4 mt-4'
                            }>
                            <div>Danger Zone</div>
                            <div className={'text-muted-foreground'}>
                                Deleting tour agency cannot be undo. This will
                                also delete al sub accounts and all data related
                                to your sub accounts. Sub accounts will no
                                longer have access to funnels, contacts etc.
                            </div>
                            <AlertDialogTrigger
                                className={
                                    'text-red-600 p-2 text-center  mt-2 rounded-md hover:bg-red-600 hover:text-white whitespace-nowrap'
                                }
                                disabled={isLoading || deletingAgency}>
                                {deletingAgency
                                    ? 'Deleting...'
                                    : 'Delete Agency'}
                            </AlertDialogTrigger>
                        </div>
                    )}
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-left">
                                Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-left">
                                This action cannot be undone. This will
                                permanently delete the Agency account and all
                                related sub accounts.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex items-center">
                            <AlertDialogCancel className="mb-2">
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                disabled={deletingAgency}
                                className="bg-destructive hover:bg-destructive"
                                onClick={handleDeleteAgency}>
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </CardContent>
            </Card>
        </AlertDialog>
    )
}

export default AgencyDetails
