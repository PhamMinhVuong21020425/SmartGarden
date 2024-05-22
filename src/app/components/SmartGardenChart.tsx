"use client";
import { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Loading from './Loading';
import { Metrics, Field } from '../pages/Home';



type Props = {
    field: string,
    color: string,
    feeds: Metrics
}

const mapping: Field = {
    "field1": 'CO2',
    "field2": 'Humidity',
    "field3": 'Room Temperature',
    "field4": 'Sensor Temperature',
    "field5": 'SHT85 Temperature'
}

function formatTime(time: string): string {
    const date = new Date(time);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${hours}:${minutes}`;
}

export default function SmartGardenChart({ att }: { att: Props }) {
    const [dataPoints, setDataPoints] = useState<Object[]>();

    useEffect(() => {
        let i = true;
        setDataPoints(att.feeds!.map((feed) => {
            if (i) {
                i = false;
                let start = feed[att.field as keyof Metrics[0]] as number
                return {
                    name: "",
                    [mapping[att.field as keyof Field]]: start * 2.5,
                }
            }
            return {
                name: formatTime(feed.created_at),
                [mapping[att.field as keyof Field]]: feed[att.field as keyof Metrics[0]] as number,
            }
        }));
    }, [att.feeds]);

    return (
        dataPoints ?
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
