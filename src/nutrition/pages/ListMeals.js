import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const ListMeals = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: 'LOGGED_OUT' });
    dispatch({ type: 'CLEAR_USER_DATA' });
    return () => {
    };
  }, []);

  return (
    <div>
      <h2>NutritionHome</h2>
      <p>Welcome to the NutritionHome page!</p>
    </div>
  );
};

export default ListMeals;