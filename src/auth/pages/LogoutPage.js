import  { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteToken } from '../services/auth';

const LogoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    deleteToken();
    dispatch({ type: 'LOGGED_OUT' });
    dispatch({ type: 'CLEAR_USER_DATA' });
    navigate('/login');
  }, []);
};

export default LogoutPage;