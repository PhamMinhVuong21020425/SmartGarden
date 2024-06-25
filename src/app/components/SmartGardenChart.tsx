"use client";
import { useState, useEffect, useRef } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts'
import Loading from './Loading';
import { Metrics, Field } from '../pages/Home';

type Props = {
    field: string,
    color: string,
    feeds: Metrics,
    unit: string,
}

interface DataPoint<T> {
    [key: string]: T,
}

type DataPointType = DataPoint<number> & {
    name: string,
    original: number
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

    return `${hours}:${minutes}:${seconds}`;
}

const generateReferenceLines = (dataPoints: DataPointType[], dataKey: string) => {
    const filteredValues = dataPoints.map(dp => dp[dataKey]);
    const minValue = Math.min(...filteredValues);
    const maxValue = Math.max(...filteredValues);
    const minOriginal = Math.min(...dataPoints.map(dp => isNaN(dp.original) ? Number.MAX_VALUE : dp.original));

    const intervalCount = 5.0; // Number of intervals to divide the y-axis range
    const interval = (maxValue - minValue) / intervalCount;

    const referenceLines = [];

    for (let i = 0; i < intervalCount; i++) {
        const yValue = minValue + i * interval;
        referenceLines.push(
            <ReferenceLine
                key={`refLine-${i}`}
                y={yValue}
                stroke="#ddd"
                strokeDasharray="5 5"
                label={{
                    position: 'left',
                    value: (yValue / 10000 + minOriginal).toFixed(2),
                    fill: '#555',
                    fontSize: 12,
                    offset: 10,
                }}
            />
        );
    }

    return referenceLines;
};

export default function SmartGardenChart({ att }: { att: Props }) {
    const [dataPoints, setDataPoints] = useState<DataPointType[]>([]);
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const [isScroll, setIsScroll] = useState(true);

    useEffect(() => {
        let minVal = Math.min(...att.feeds!.map((feed) => {
            let value = feed[att.field as keyof Metrics[0]] as number;
            if (!isNaN(value)) {
                return value;
            } else {
                return Number.MAX_VALUE;
            }
        }));
        setDataPoints(att.feeds!.map((feed) => {
            let value = feed[att.field as keyof Metrics[0]] as number;
            let newVal = 10000.0 * (value - minVal);
            if (isNaN(newVal)) {
                newVal = 0;
            }

            return {
                name: formatTime(feed.created_at),
                [mapping[att.field as keyof Field]]: newVal,
                original: value,
            } as DataPointType;
        }));
        setIsScroll(false);
    }, [att.feeds]);

    useEffect(() => {
        if (chartContainerRef.current) {
            chartContainerRef.current.scrollLeft = chartContainerRef.current.scrollWidth;
        }
    }, [isScroll]);

    return (
        dataPoints ?
            <div className="relative bg-white rounded-lg shadow-lg p-8">
                <div className="flex justify-center mb-4">
                    <h2 className="ml-2 text-xl font-bold text-gray-800">{mapping[att.field as keyof Field]}</h2>
                </div>
                <div className="absolute left-0 z-10 " style={{ width: '60px', height: '100%' }}>
                    <ResponsiveContainer className='bg-white' width="100%" height={400}>
                        <AreaChart data={dataPoints}>
                            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#333' }} />
                            <YAxis
                                tick={false}
                                axisLine={false}
                                tickLine={false}
                                label={{ value: att.unit, position: 'insideTop', fill: '#333' }}
                            />
                            {generateReferenceLines(dataPoints, mapping[att.field as keyof Field])}
                            {/* <CartesianGrid strokeDasharray="3 3" /> */}
                            <Tooltip formatter={(value) => dataPoints.find(d => d[mapping[att.field as keyof Field]] === value)?.original} />
                            {/* <Legend /> */}
                            <Area type="monotone" dataKey={mapping[att.field as keyof Field]} stackId="1" stroke={att.color} fill={att.color} />
                            {/* <ReferenceLine y={35} stroke="red" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: `${35}`, fill: 'red' }} /> */}
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div ref={chartContainerRef} className="overflow-x-auto" style={{ whiteSpace: 'nowrap' }}>
                    <ResponsiveContainer width={dataPoints.length > 100 ? dataPoints.length * 8 : "95%"} height={400}>
                        <AreaChart data={dataPoints} className='ml-8'>
                            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#333' }} />
                            {/* <YAxis
                                tick={false}
                                axisLine={false}
                                tickLine={false}
                                label={{ value: att.unit, position: 'insideTop', fill: '#333' }}
                            /> */}
                            {generateReferenceLines(dataPoints, mapping[att.field as keyof Field])}
                            {/* <CartesianGrid strokeDasharray="3 3" /> */}
                            <Tooltip formatter={(value) => dataPoints.find(d => d[mapping[att.field as keyof Field]] === value)?.original} />
                            {/* <Legend /> */}
                            <Area type="monotone" dataKey={mapping[att.field as keyof Field]} stackId="1" stroke={att.color} fill={att.color} />
                            {/* <ReferenceLine y={35} stroke="red" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: `${35}`, fill: 'red' }} /> */}
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
            : <Loading />
    )
}