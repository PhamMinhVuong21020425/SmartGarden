'use server'
import { Metrics } from '@/app/pages/Home'
import { revalidatePath } from 'next/cache'


export const getData = async (numRes: number) => {
    try {
        const url = process.env.API_URL!
        const response = await fetch(url + `?results=${numRes}`)
        const data = await response.json()
        revalidatePath('/')
        return data.feeds as Metrics
    } catch (error: unknown) {
        console.log(error)
        throw new Error(`An error happened: ${error}`)
    }
}