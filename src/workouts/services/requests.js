import {
    DEFAULT_WORKOUTS, CUSTOM_WORKOUTS,
    LIST_DEFAULT_EXERCISES, LIST_CUSTOM_EXERCISES,
    LIST_DEFAULT_MEDIA, LIST_CUSTOM_MEDIA, CREATE_CUSTOM_MEDIA
} from '../../shared/services/URL.js';

export const getDefaultWorkouts = async () => {
    const response = await fetch(DEFAULT_WORKOUTS, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch default workouts: ${response.status}`);
    }

    const data = await response.json();
    return {
        status: response.status,
        body: data
    };
};

export const getCustomWorkouts = async (token) => {
    const response = await fetch(CUSTOM_WORKOUTS, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch custom workouts: ${response.status}`);
    }

    const data = await response.json();
    return {
        status: response.status,
        body: data
    };
};

export const getDefaultExercises = async () => {
    const response = await fetch(LIST_DEFAULT_EXERCISES, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch default exercises: ${response.status}`);
    }

    const data = await response.json();
    return {
        status: response.status,
        body: data
    };
};

export const getCustomExercises = async (token) => {
    const response = await fetch(LIST_CUSTOM_EXERCISES, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch custom exercises: ${response.status}`);
    }

    const data = await response.json();
    return {
        status: response.status,
        body: data
    };
};

export const getDefaultMedia = async (urlPostfix) => {
    let url = LIST_DEFAULT_MEDIA;
    if (urlPostfix !== '') url += urlPostfix;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
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

export const getCustomMedia = async (token, urlPostfix) => {
    let url = LIST_CUSTOM_MEDIA;
    if (urlPostfix !== '') url += urlPostfix;
    
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
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

export const createHttpRef = async (token, requestBody) => {
    const response = await fetch(CREATE_CUSTOM_MEDIA, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
    });
    const data = await response.json();
    return {
        status: response.status,
        body: data
    };
}
