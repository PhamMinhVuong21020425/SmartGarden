'use client';
import { useState, useEffect, useRef } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import Loading from './Loading';
import { Metrics, Field } from '../pages/Home';

type Props = {
  field: string;
  color: string;
  metrics: Metrics;
  unit: string;
  device: string;
};

interface DataPoint<T> {
  [key: string]: T;
}

type DataPointType = DataPoint<number> & {
  name: string;
  original: number;
};

const mapping: Field = {
  ppm: 'CO2',
  humi: 'Humidity',
  temp: 'Sensor Temperature',
  soil: 'Soil Humidity',
  room: 'Room Temperature',
  sht85: 'SHT85 Temperature',
};

function formatTime(ms: number): string {
  const date = new Date(ms);

  const pad = (num: number) => String(num).padStart(2, '0');

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${hours}:${minutes}:${seconds}`;
}

const generateReferenceLines = (
  dataPoints: DataPointType[],
  dataKey: string
) => {
  const filteredValues = dataPoints.map(dp => dp[dataKey]);
  const minValue = Math.min(...filteredValues);
  const maxValue = Math.max(...filteredValues);
  const minOriginal = Math.min(
    ...dataPoints.map(dp =>
      isNaN(dp.original) ? Number.MAX_VALUE : dp.original
    )
  );

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
    let key = `${att.device}_${att.field as keyof Metrics}`;
    if (att.field === 'soil') {
      key = `${att.device.replace('TB', 'SM')}_soil`;
    }
    if (!att.metrics || !att.metrics[key]) {
      return;
    }
    const minVal = Math.min(
      ...att.metrics[key].map(point => {
        const value = point.value;
        if (!isNaN(value)) {
          return value;
        } else {
          return Number.MAX_VALUE;
        }
      })
    );
    setDataPoints(
      att.metrics[key].map(point => {
        const value = point.value;
        let newVal = 10000.0 * (value - minVal);
        if (isNaN(newVal)) {
          newVal = 0;
        }

        return {
          name: formatTime(point.ts),
          [mapping[att.field as keyof Field]]: newVal,
          original: value,
        } as DataPointType;
      })
    );
    setIsScroll(false);
  }, [att.metrics, att.device]);

  useEffect(() => {
    if (chartContainerRef.current) {
      chartContainerRef.current.scrollLeft =
        chartContainerRef.current.scrollWidth;
    }
  }, [isScroll]);

  return dataPoints ? (
    <div className="relative bg-white rounded-lg shadow-lg p-8">
      <div className="flex justify-center mb-4">
        <h2 className="ml-2 text-xl font-bold text-gray-800">
          {mapping[att.field as keyof Field]}
        </h2>
      </div>
      <div
        className="absolute left-0 z-10"
        style={{ width: '60px', height: '100%' }}
      >
        <ResponsiveContainer className="bg-white" width="100%" height={400}>
          <AreaChart data={dataPoints}>
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#333' }} />
            <YAxis
              tick={false}
              axisLine={false}
              tickLine={false}
              label={{ value: att.unit, position: 'insideTop', fill: '#333' }}
            />
            {generateReferenceLines(
              dataPoints,
              mapping[att.field as keyof Field]
            )}
            {/* <CartesianGrid strokeDasharray="3 3" /> */}
            <Tooltip
              formatter={value =>
                dataPoints.find(
                  d => d[mapping[att.field as keyof Field]] === value
                )?.original
              }
            />
            {/* <Legend /> */}
            <Area
              type="monotone"
              dataKey={mapping[att.field as keyof Field]}
              stackId="1"
              stroke={att.color}
              fill={att.color}
            />
            {/* <ReferenceLine y={35} stroke="red" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: `${35}`, fill: 'red' }} /> */}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div
        ref={chartContainerRef}
        className="overflow-x-auto"
        style={{ whiteSpace: 'nowrap' }}
      >
        <ResponsiveContainer
          width={dataPoints.length > 100 ? dataPoints.length * 8 : '95%'}
          height={400}
        >
          <AreaChart data={dataPoints} className="ml-8">
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#333' }} />
            {/* <YAxis
                                tick={false}
                                axisLine={false}
                                tickLine={false}
                                label={{ value: att.unit, position: 'insideTop', fill: '#333' }}
                            /> */}
            {generateReferenceLines(
              dataPoints,
              mapping[att.field as keyof Field]
            )}
            {/* <CartesianGrid strokeDasharray="3 3" /> */}
            <Tooltip
              formatter={value =>
                dataPoints.find(
                  d => d[mapping[att.field as keyof Field]] === value
                )?.original
              }
            />
            {/* <Legend /> */}
            <Area
              type="monotone"
              dataKey={mapping[att.field as keyof Field]}
              stackId="1"
              stroke={att.color}
              fill={att.color}
            />
            {/* <ReferenceLine y={35} stroke="red" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: `${35}`, fill: 'red' }} /> */}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  ) : (
    <Loading />
  );
}
