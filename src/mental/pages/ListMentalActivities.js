import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const ListMentalActivities = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: 'LOGGED_OUT' });
    dispatch({ type: 'CLEAR_USER_DATA' });

    return () => {
    };
  }, []);

  return (
    <div>
      <h2>MeditationHome</h2>
      <p>Welcome to the MeditationHome page!</p>
    </div>
  );
};

export default ListMentalActivities;