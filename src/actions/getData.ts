'use server'
import { type Metrics } from '@/app/components/SmartGardenChart'
import { revalidatePath } from 'next/cache'


export const getData = async () => {
    try {
        const url = process.env.API_URL!
        const response = await fetch(url + '?results=2000')
        const data = await response.json() as { feeds: Metrics }
        revalidatePath('/')
        return data.feeds
    } catch (error: unknown) {
        console.log(error)
        throw new Error(`An error happened: ${error}`)
    }
}