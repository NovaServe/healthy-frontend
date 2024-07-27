import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const CalendarHome = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: 'LOGGED_OUT' });
    dispatch({ type: 'CLEAR_USER_DATA' });

    return () => {
    };
  }, []);

  return (
    <div>
      <h2>CalendarHome</h2>
      <p>Welcome to the CalendarHome page!</p>
    </div>
  );
};

export default CalendarHome;