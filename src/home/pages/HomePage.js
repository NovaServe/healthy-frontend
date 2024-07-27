import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const HomePage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: 'LOGGED_OUT' });
    dispatch({ type: 'CLEAR_USER_DATA' });

    return () => {
    };
  }, []);

  return (
    <div>
      <h2>Home</h2>
      <p>Welcome to the home page!</p>
    </div>
  );
};

export default HomePage;
