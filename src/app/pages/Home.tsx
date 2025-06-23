'use client';
import SelectDropdown from '../components/SelectDropdown';
import SmartGardenChart from '../components/SmartGardenChart';
import { getData } from '@/actions/getData';
import { useState, useEffect } from 'react';
import Loading from '../components/Loading';

interface Option {
  value: string;
  label: string;
}

const CO2 = 'field1';
const HUMIDITY = 'field2';
const ROOM_TEMPERATURE = 'field3';
const SENSOR_TEMPERATURE = 'field4';
const SHT85_TEMPERATURE = 'field5';

export type Metrics = {
  entry_id: number;
  created_at: string;
  [CO2]: number;
  [HUMIDITY]: number;
  [ROOM_TEMPERATURE]: number;
  [SENSOR_TEMPERATURE]: number;
  [SHT85_TEMPERATURE]: number;
}[];

export type Field = {
  [CO2]: string;
  [HUMIDITY]: string;
  [ROOM_TEMPERATURE]: string;
  [SENSOR_TEMPERATURE]: string;
  [SHT85_TEMPERATURE]: string;
};

const options: Option[] = [
  { value: 'option1', label: 'Thiết bị 1' },
  { value: 'option2', label: 'Thiết bị 2' },
  { value: 'option3', label: 'Thiết bị 3' },
];

export default function HomePage() {
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [data, setData] = useState<Metrics>();
  const [refreshToken, setRefreshToken] = useState(Math.random());

  useEffect(() => {
    getData(100)
      .then(feeds => {
        // const averages: Metrics = [];

        // for (let i = 0; i < feeds.length; i += 20) {
        //     const sums: { [key: string]: number } = {
        //         field1: 0,
        //         field2: 0,
        //         field3: 0,
        //         field4: 0,
        //         field5: 0,
        //     };

        //     const counts: { [key: string]: number } = {
        //         field1: 0,
        //         field2: 0,
        //         field3: 0,
        //         field4: 0,
        //         field5: 0,
        //     };

        //     const chunk: Metrics = feeds.slice(i, i + 20);
        //     const entry_id = chunk[0].entry_id;
        //     const created_at = chunk[0].created_at;

        //     chunk.forEach(item => {
        //         for (const key of Object.keys(sums)) {
        //             const value = +item[key as keyof Metrics[0]];
        //             if (!isNaN(value)) {
        //                 sums[key as keyof Field] += value;
        //                 counts[key as keyof Field]++;
        //             }
        //         }
        //     });
        //     const average = {
        //         entry_id,
        //         created_at,
        //         field1: sums.field1 / counts.field1,
        //         field2: sums.field2 / counts.field2,
        //         field3: sums.field3 / counts.field3,
        //         field4: sums.field4 / counts.field4,
        //         field5: sums.field5 / counts.field5,
        //     } as Metrics[0];

        //     averages.push(average);
        // }

        setData(feeds);
      })
      .finally(() => {
        // Update refreshToken after 10 seconds so this event will re-trigger and update the data
        setTimeout(() => setRefreshToken(Math.random()), 10000);
      });
  }, [refreshToken]);

  const handleChange = (option: Option | null) => {
    setSelectedOption(option);
  };

  return (
    <div className="container mx-auto px-4">
      {/* Banner */}
      <div className="bg-gray-200 h-96 mb-8">
        <img
          src="https://static.vecteezy.com/system/resources/thumbnails/002/375/822/small_2x/smart-integrated-garden-and-farming-technology-free-vector.jpg"
          alt="Banner"
          className="object-cover h-full w-full"
        />
      </div>

      {/* Header */}
      <h1 className="text-3xl font-bold mb-4">My Smart Garden</h1>

      {/* Dropdown */}
      <div className="mb-8">
        <SelectDropdown
          value={selectedOption}
          onChange={handleChange}
          options={options}
          placeholder="Chọn thiết bị"
        />
      </div>

      {/* Graph */}
      {data ? (
        <>
          <SmartGardenChart
            att={{
              field: 'field1',
              color: '#8bf8a7',
              feeds: data,
              unit: 'ppm',
            }}
          />
          <br />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SmartGardenChart
              att={{
                field: 'field2',
                color: 'pink',
                feeds: data.slice(data.length - 100),
                unit: '%',
              }}
            />
            <SmartGardenChart
              att={{
                field: 'field3',
                color: 'orange',
                feeds: data.slice(data.length - 100),
                unit: '℃',
              }}
            />
            <SmartGardenChart
              att={{
                field: 'field4',
                color: 'blue',
                feeds: data.slice(data.length - 100),
                unit: '℃',
              }}
            />
            <SmartGardenChart
              att={{
                field: 'field5',
                color: '#82ca9d',
                feeds: data.slice(data.length - 100),
                unit: '℃',
              }}
            />
          </div>
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
}
