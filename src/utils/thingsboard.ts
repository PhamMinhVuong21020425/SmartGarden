export interface ThingsboardAuthResponse {
  token: string;
  refreshToken: string;
}

export const loginThingsboard = async (
  email: string,
  password: string
): Promise<string> => {
  const response = await fetch(process.env.NEXT_PUBLIC_THINGSBOARD_API_AUTH!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: email,
      password: password,
    }),
  });

  if (!response.ok) {
    throw new Error('Login ThingsBoard failed: ' + response.statusText);
  }

  const data = (await response.json()) as ThingsboardAuthResponse;
  return data.token;
};
