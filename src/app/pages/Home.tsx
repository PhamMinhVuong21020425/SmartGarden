"use client"
import React, { useState } from 'react';
import Select, { SingleValue } from 'react-select';
import SmartGardenChart from '../components/SmartGardenChart';

interface Option {
    value: string;
    label: string;
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SmartGardenChart att={{ field: "field1", color: "#82ca9d" }} />
                <SmartGardenChart att={{ field: "field2", color: "pink" }} />
                <SmartGardenChart att={{ field: "field3", color: "orange" }} />
                <SmartGardenChart att={{ field: "field4", color: "blue" }} />
            </div>
            <SmartGardenChart att={{ field: "field5", color: "#8884d8" }} />
        </div>
    );
}