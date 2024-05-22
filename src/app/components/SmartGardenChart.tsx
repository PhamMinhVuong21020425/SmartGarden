"use client";
import { useState, useEffect } from 'react'
import { getData } from '@/actions/getData'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Loading from './Loading';

const CO2 = 'field1'
const HUMIDITY = 'field2'
const ROOM_TEMPERATURE = 'field3'
const SENSOR_TEMPERATURE = 'field4'
const SHT85_TEMPERATURE = 'field5'

type Props = {
    field: string,
    color: string,
}

type Field = {
    [CO2]: string,
    [HUMIDITY]: string,
    [ROOM_TEMPERATURE]: string,
    [SENSOR_TEMPERATURE]: string,
    [SHT85_TEMPERATURE]: string,
}

const mapping: Field = {
    [CO2]: 'CO2',
    [HUMIDITY]: 'Humidity',
    [ROOM_TEMPERATURE]: 'Room Temperature',
    [SENSOR_TEMPERATURE]: 'Sensor Temperature',
    [SHT85_TEMPERATURE]: 'SHT85 Temperature'
}

export type Metrics = {
    entry_id: number,
    created_at: string,
    [CO2]: number,
    [HUMIDITY]: number,
    [ROOM_TEMPERATURE]: number,
    [SENSOR_TEMPERATURE]: number,
    [SHT85_TEMPERATURE]: number,
}[]

function formatTime(time: string): string {
    const date = new Date(time);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
}

export default function SmartGardenChart({ att }: { att: Props }) {
    const [data, setData] = useState<Metrics>();
    const [dataPoints, setDataPoints] = useState<Object[]>();
    const [refreshToken, setRefreshToken] = useState(Math.random());

    useEffect(() => {
        getData()
            .then((feeds) => {
                setData(feeds);
                setDataPoints(feeds.map((feed) => {
                    return {
                        name: formatTime(feed.created_at),
                        [mapping[att.field as keyof Field]]: feed[att.field as keyof Metrics[0]] as number,
                    }
                }));
            })
            .finally(() => {
                // Update refreshToken after 3 seconds so this event will re-trigger and update the data
                setTimeout(() => setRefreshToken(Math.random()), 10000);
            });
    }, [refreshToken]);

    return (
        data ?
            <div>
                {/* <h1>Created at: {data[1999].created_at}</h1>
                <h1>CO2: {data[1999][CO2]}</h1>
                <h1>Humidity: {data[1999][HUMIDITY]}</h1>
                <h1>Room Temperature: {data[1999][ROOM_TEMPERATURE]}</h1>
                <h1>Sensor Temperature: {data[1999][SENSOR_TEMPERATURE]}</h1>
                <h1>SHT85 Temperature: {data[1999][SHT85_TEMPERATURE]}</h1> */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <ResponsiveContainer width="100%" height={400}>
                        <AreaChart data={dataPoints}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip />
                            <Legend />
                            <Area type="monotone" dataKey={mapping[att.field as keyof Field]} stackId="1" stroke={att.color} fill={att.color} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
            : <Loading />
    )
}
