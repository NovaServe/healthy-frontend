import { SIGNUP, COUNTRIES, TIMEZONES } from './URL.js';

export const getCountries = async() => {
  const response = await fetch(COUNTRIES, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch countries: ${response.status}`);
  }

  const data = await response.json();
  return {
    status: response.status,
    body: data,
  };
};

export const getTimezones = async() => {
  const response = await fetch(TIMEZONES, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch timezones: ${response.status}`);
  }

  const data = await response.json();
  return {
    status: response.status,
    body: data,
  };
};

export const signup = async(requestBody) => {
  const response = await fetch(SIGNUP, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  if (response.status === 201) {
    return { status: response.status };
  }

  // if (response.status !== 201) {
  //     throw new Error(`Failed to signup: ${response.status}`);
  // }
  const data = await response.json();

  return {
    status: response.status,
    body: data,
  };
};
