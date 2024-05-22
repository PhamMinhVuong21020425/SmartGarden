"use client"
import Select, { SingleValue } from 'react-select';
import SmartGardenChart from '../components/SmartGardenChart';
import { getData } from '@/actions/getData';
import { useState, useEffect } from 'react'
import Loading from '../components/Loading';

interface Option {
    value: string;
    label: string;
}

const CO2 = 'field1'
const HUMIDITY = 'field2'
const ROOM_TEMPERATURE = 'field3'
const SENSOR_TEMPERATURE = 'field4'
const SHT85_TEMPERATURE = 'field5'

export type Metrics = {
    entry_id: number,
    created_at: string,
    [CO2]: number,
    [HUMIDITY]: number,
    [ROOM_TEMPERATURE]: number,
    [SENSOR_TEMPERATURE]: number,
    [SHT85_TEMPERATURE]: number,
}[]

export type Field = {
    [CO2]: string,
    [HUMIDITY]: string,
    [ROOM_TEMPERATURE]: string,
    [SENSOR_TEMPERATURE]: string,
    [SHT85_TEMPERATURE]: string,
}

const options: Option[] = [
    { value: 'option1', label: 'Thiết bị 1' },
    { value: 'option2', label: 'Thiết bị 2' },
    { value: 'option3', label: 'Thiết bị 3' },
    { value: 'option2', label: 'Thiết bị 4' },
    { value: 'option3', label: 'Thiết bị 5' },
];



export default function HomePage() {
    const [selectedOption, setSelectedOption] = useState<Option | null>(null);
    const [data, setData] = useState<Metrics>();
    const [refreshToken, setRefreshToken] = useState(Math.random());

    useEffect(() => {
        getData()
            .then((feeds) => setData(feeds))
            .finally(() => {
                // Update refreshToken after 3 seconds so this event will re-trigger and update the data
                setTimeout(() => setRefreshToken(Math.random()), 5000);
            });
    }, [refreshToken]);

    const handleChange = (option: SingleValue<Option>) => {
        setSelectedOption(option);
    };

    return (
        <div className="container mx-auto px-4">
            {/* Banner */}
            <div className="bg-gray-200 h-96 mb-8">
                <img src="https://static.vecteezy.com/system/resources/thumbnails/002/375/822/small_2x/smart-integrated-garden-and-farming-technology-free-vector.jpg" alt="Banner" className="object-cover h-full w-full" />
            </div>

            {/* Tiêu đề */}
            <h1 className="text-3xl font-bold mb-4">My Smart Garden</h1>

            {/* Dropdown */}
            <div className="mb-8">
                <Select
                    value={selectedOption}
                    onChange={handleChange}
                    options={options}
                    placeholder="Chọn thiết bị"
                />
            </div>

            {/* Đồ thị */}
            {
                data ?
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SmartGardenChart att={{ field: "field1", color: "#8bf8a7", feeds: data }} />
                            <SmartGardenChart att={{ field: "field2", color: "pink", feeds: data }} />
                            <SmartGardenChart att={{ field: "field3", color: "orange", feeds: data }} />
                            <SmartGardenChart att={{ field: "field4", color: "blue", feeds: data }} />
                        </div>
                        <SmartGardenChart att={{ field: "field5", color: "#82ca9d", feeds: data }} />
                    </>
                    : <Loading />
            }
        </div>

    );
}