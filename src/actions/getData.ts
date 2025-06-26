'use server';
import { loginThingsboard } from '@/utils/thingsboard';

export const getData = async () => {
  try {
    const token = await loginThingsboard(
      process.env.THINGSBOARD_USERNAME!,
      process.env.THINGSBOARD_PASSWORD!
    );
    const keys = [
      'TB1_ppm',
      'TB1_humi',
      'TB1_temp',
      'TB2_ppm',
      'TB2_humi',
      'TB2_temp',
      'TB3_ppm',
      'TB3_humi',
      'TB3_temp',
    ];
    const keysQuery = keys.join(',');
    const startTs = Date.now() - 30 * 60 * 1000; // 30 minutes ago
    const endTs = Date.now();
    const limit = 100;
    const url = `${process.env.THINGSBOARD_API_URL!}?keys=${keysQuery}&startTs=${startTs}&endTs=${endTs}&limit=${limit}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return { token, data };
  } catch (error: unknown) {
    console.log(error);
    throw new Error(`An error happened: ${error}`);
  }
};
