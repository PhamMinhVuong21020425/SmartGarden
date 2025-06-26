import { useEffect, useRef, useState } from 'react';
import type { Metrics } from '../pages/Home';

export const useTelemetry = (
  deviceId: string,
  jwtToken: string,
  initData: Metrics
) => {
  const ws = useRef<WebSocket | null>(null);
  const [telemetryHis, setTelemetryHis] = useState<Metrics>({});

  useEffect(() => {
    if (!deviceId || !jwtToken || !initData) return;

    const url = `wss://thingsboard.cloud/api/ws/plugins/telemetry?token=${jwtToken}`;
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      console.log('✅ WebSocket connected');

      // Initialize with existing data
      setTelemetryHis(initData);

      ws.current?.send(
        JSON.stringify({
          tsSubCmds: [
            {
              entityType: 'DEVICE',
              entityId: deviceId,
              scope: 'LATEST_TELEMETRY',
              cmdId: 1,
            },
          ],
          historyCmds: [],
          attrSubCmds: [],
        })
      );
    };

    ws.current.onmessage = event => {
      const message = JSON.parse(event.data);

      if (message.data) {
        setTelemetryHis(prev => {
          const updated = { ...prev };
          for (const key in message.data) {
            const newData = message.data[key].map((item: any) => ({
              ts: item[0],
              value: Number(item[1]),
            }));

            updated[key] = [...(prev[key] || []), ...newData].slice(-100);
          }
          return updated;
        });
      }
    };

    ws.current.onerror = err => {
      console.error('❌ WebSocket error:', err);
    };

    return () => {
      ws.current?.close();
    };
  }, [deviceId, jwtToken, initData]);

  return telemetryHis;
};
