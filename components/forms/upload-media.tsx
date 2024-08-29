'use client'
import React from 'react'
import { z } from 'zod'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { createMedia, saveActivityLogNotification } from '@/lib/queries'
import { Input } from '@/components/ui/input'
import FileUpload from '@/components/global/file-upload'
import { Button } from '@/components/ui/button'

const UploadMediaForm = ({ subaccountId }: { subaccountId: string }) => {
    const formSchema = z.object({
        link: z.string().min(1, { message: 'Media file is required' }),
        name: z.string().min(1, { message: 'Name file is required' }),
    })
    const { toast } = useToast()
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: 'onSubmit',
        defaultValues: {
            link: '',
            name: '',
        },
    })
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const response = await createMedia(subaccountId, values)
            await saveActivityLogNotification({
                agencyId: undefined,
                description: `Upload a media file | ${response.name}`,
                subAccountId: subaccountId,
            })
            toast({ title: 'Success', description: 'Uploaded media' })
            router.refresh()
        } catch (err) {
            console.log(err)
            toast({
                variant: 'destructive',
                title: 'Failed',
                description: 'Could not uploaded media',
            })
        }
    }

    return (
        <Card className={'w-full dark:border-gray-800'}>
            <CardHeader>
                <CardTitle>Media Information</CardTitle>
                <CardDescription>
                    Please enter the details for your file
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>File Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Your agency name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="mt-3">
                            <FormField
                                control={form.control}
                                name="link"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Media File</FormLabel>
                                        <FormControl>
                                            <FileUpload
                                                apiEndpoint="subaccountLogo"
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button type="submit" className="mt-4">
                            Upload Media
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default UploadMediaForm
