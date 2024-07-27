import { CREATE_WORKOUT_PLAN, GET_WORKOUTS_WITHOUT_PLANS, GET_WORKOUT_PLANS } from './URL';

export const createWorkoutPlan = async(token, requestBody) => {
  const response = await fetch(CREATE_WORKOUT_PLAN, {
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

export const getDefaultAndCustomWorkoutsWithoutPlans = async(token) => {
  const response = await fetch(GET_WORKOUTS_WITHOUT_PLANS, {
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

export const getWorkoutPlans = async(token) => {
  const response = await fetch(GET_WORKOUT_PLANS, {
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