import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
    { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
    { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
    { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
    { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
    { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
    { name: 'Page H', uv: 3490, pv: 4300, amt: 2100 },
    { name: 'Page I', uv: 3490, pv: 4300, amt: 2100 },
    { name: 'Page J', uv: 3490, pv: 4300, amt: 2100 },
];

const FixedYAxisChart = () => {
    return (
        <div className="relative w-full h-96 overflow-x-auto">
            <div className="sticky left-0 z-10 bg-white" style={{ width: '60px', height: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                        <YAxis axisLine={true} tick={{ fontSize: 12 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="absolute top-0 left-[60px] right-0 bottom-0">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis axisLine={false} tick={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="pv" stroke="#8884d8" />
                        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default FixedYAxisChart;