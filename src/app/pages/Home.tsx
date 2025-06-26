'use client';
import SelectDropdown from '../components/SelectDropdown';
import SmartGardenChart from '../components/SmartGardenChart';
import Loading from '../components/Loading';
import { useState, useEffect } from 'react';
import { getData } from '@/actions/getData';
import { useTelemetry } from '../hooks/useTelemetry';

const CO2 = 'ppm';
const HUMIDITY = 'humi';
const SENSOR_TEMPERATURE = 'temp';
const SOIL_HUMIDITY = 'soil';
const ROOM_TEMPERATURE = 'room';
const SHT85_TEMPERATURE = 'sht85';

export type Field = {
  [CO2]: string;
  [HUMIDITY]: string;
  [SENSOR_TEMPERATURE]: string;
  [SOIL_HUMIDITY]: string;
  [ROOM_TEMPERATURE]: string;
  [SHT85_TEMPERATURE]: string;
};

export type TimeSeriesData = {
  ts: number; // Timestamp in milliseconds
  value: number; // Value of the metric
};

export type Metrics = {
  [key: string]: TimeSeriesData[];
};

type Option = {
  value: string;
  label: string;
};

const options: Option[] = [
  { value: 'TB1', label: 'Thiết bị 1' },
  { value: 'TB2', label: 'Thiết bị 2' },
  { value: 'TB3', label: 'Thiết bị 3' },
];

const deviceId = process.env.NEXT_PUBLIC_THINGSBOARD_DEVICE_ID!;

export default function HomePage() {
  const [selectedOption, setSelectedOption] = useState<Option>(options[0]);
  const [jwtToken, setJwtToken] = useState<string>();
  const [data, setData] = useState<Metrics>();

  useEffect(() => {
    getData().then(({ token, data }) => {
      const reversed: Metrics = {};

      for (const key in data) {
        if (Array.isArray(data[key])) {
          reversed[key] = [...data[key]].reverse();
        }
      }

      setJwtToken(token);
      setData(reversed);
    });
  }, []);

  const telemetryHis = useTelemetry(deviceId, jwtToken ?? '', data ?? {});

  const handleChange = (option: Option) => {
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
      {jwtToken && data && telemetryHis ? (
        <>
          <SmartGardenChart
            att={{
              field: 'ppm',
              color: '#8bf8a7',
              metrics: telemetryHis,
              unit: 'ppm',
              device: selectedOption.value,
            }}
          />
          <br />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SmartGardenChart
              att={{
                field: 'humi',
                color: 'violet',
                metrics: telemetryHis,
                unit: '%',
                device: selectedOption.value,
              }}
            />
            <SmartGardenChart
              att={{
                field: 'temp',
                color: 'orange',
                metrics: telemetryHis,
                unit: '℃',
                device: selectedOption.value,
              }}
            />
            {/* <SmartGardenChart
              att={{
                field: 'room',
                color: 'blue',
                metrics: telemetryHis,
                unit: '℃',
                device: selectedOption.value,
              }}
            />
            <SmartGardenChart
              att={{
                field: 'sht85',
                color: '#82ca9d',
                metrics: telemetryHis,
                unit: '℃',
                device: selectedOption.value,
              }}
            /> */}
          </div>
          <br />
          <SmartGardenChart
            att={{
              field: 'soil',
              color: 'red',
              metrics: telemetryHis,
              unit: '%',
              device: selectedOption.value,
            }}
          />
        </>
      ) : (
        <Loading />
      )}
    </div>
  );
}
