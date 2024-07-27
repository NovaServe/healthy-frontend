import {
  LIST_DEFAULT_WORKOUT_MEDIA, LIST_CUSTOM_WORKOUT_MEDIA, CREATE_CUSTOM_WORKOUT_MEDIA,
  GET_CUSTOM_WORKOUT_MEDIA_BY_ID, UPDATE_CUSTOM_WORKOUT_MEDIA_BY_ID,
  DELETE_CUSTOM_WORKOUT_MEDIA_BY_ID, LIST_DEFAULT_AND_CUSTOM_MEDIA
} from './URL.js';

export const createMedia = async(token, requestBody) => {
  const response = await fetch(CREATE_CUSTOM_WORKOUT_MEDIA, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(requestBody)
  });
  const data = await response.json();
  return {
    status: response.status,
    body: data
  };
};

export const updateCustomMediaById = async(token, id, requestBody) => {
  const response = await fetch(UPDATE_CUSTOM_WORKOUT_MEDIA_BY_ID + id, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(requestBody)
  });
  const data = await response.json();
  return {
    status: response.status,
    body: data
  };
};

export const getCustomMediaById = async(id, token) => {
  const response = await fetch(GET_CUSTOM_WORKOUT_MEDIA_BY_ID + id, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch custom media: ${response.status}`);
  }

  const data = await response.json();
  return {
    status: response.status,
    body: data
  };
};

export const getDefaultMedia = async(urlPostfix) => {
  let url = LIST_DEFAULT_WORKOUT_MEDIA;
  if (urlPostfix !== '') url += urlPostfix;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch default media: ${response.status}`);
  }

  const data = await response.json();
  return {
    status: response.status,
    body: data
  };
};

export const getCustomMedia = async(token, urlPostfix) => {
  let url = LIST_CUSTOM_WORKOUT_MEDIA;
  if (urlPostfix !== '') url += urlPostfix;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch custom media: ${response.status}`);
  }

  const data = await response.json();
  return {
    status: response.status,
    body: data
  };
};

export const getDefaultAndCustomMedia = async(token) => {
  const response = await fetch(LIST_DEFAULT_AND_CUSTOM_MEDIA, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch media: ${response.status}`);
  }

  const data = await response.json();
  return {
    status: response.status,
    body: data
  };
};

export const deleteCustomMediaById = async(token, id) => {
  const response = await fetch(DELETE_CUSTOM_WORKOUT_MEDIA_BY_ID + id, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  return {
    status: response.status
  };
};