import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { useAuth } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'

const f = createUploadthing()

const authenticateUser = async () => {
    const user = await currentUser()
    /*const user = useAuth()
    console.log('user?.userId')
    console.log(user?.userId)
    // If you throw, the user will not be able to upload
    if (!user) throw new Error('Unauthorized')
    // Whatever is returned here is accessible in onUploadComplete as `metadata`
    return user*/
}

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    subaccountLogo: f({
        image: { maxFileSize: '4MB', maxFileCount: 1 },
    }).onUploadComplete(() => {}),
    avatar: f({
        image: { maxFileSize: '4MB', maxFileCount: 1 },
    }).onUploadComplete(() => {}),
    agencyLogo: f({
        image: { maxFileSize: '4MB', maxFileCount: 1 },
    }).onUploadComplete(() => {}),
    media: f({
        image: { maxFileSize: '4MB', maxFileCount: 1 },
    }).onUploadComplete(() => {}),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
