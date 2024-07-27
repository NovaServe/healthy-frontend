import { VALIDATE_TOKEN, LOGIN } from './URL';

export const getToken = () => {
  const token = localStorage.getItem('token');
  if (token === null) return null;
  if (token === '') {
    localStorage.removeItem('token');
    return null;
  }
  return token;
};

export const validateToken = async() => {
  const token = getToken();
  if (token === null) return { status: 401 };

  const response = await fetch(VALIDATE_TOKEN, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  return {
    status: response.status,
    body: data
  };
};

export const setToken = (token) => {
  localStorage.setItem('token', token);
  // localStorage.setItem('token', JSON.stringify(token).slice(1, -1));
};

export const login = async(requestBody) => {
  const response = await fetch(LOGIN, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  const data = await response.json();
  return {
    status: response.status,
    body: data,
  };
};

export const deleteToken = () => {
  localStorage.removeItem('token');
};
