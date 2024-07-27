import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Alert from '../../shared/components/Alert.js';
import PlanCard from '../components/PlanCard';
import Links from '../../workouts/components/Links.js';
import Button from '../../shared/components/Button.js';
import { getWorkoutPlans } from '../services/requests';
import { validateToken, getToken } from '../../auth/services/auth';
import { SESSION_EXPIRED } from '../../auth/services/message';
import { ERROR_ON_GETTING_PLANS } from '../services/message';
import { WARNING } from '../../shared/services/message';

const ListPlans = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { type } = useParams();

  const [entities, setEntities] = useState([]);

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    dispatch({ type: 'SET_CURRENT_URL', payload: { currentUrl: location.pathname } });

    const fetchData = async() => {
      try {
        const data = await validateToken();
        if (data.status === 200) {
          dispatch({ type: 'LOGGED_IN' });
          dispatch({ type: 'SET_USER_DATA', payload: { fullName: data.body[1] } });
          let response;
          if (type === 'workouts') {
            response = await getWorkoutPlans(getToken());
          }
          if (response.status === 200) {
            setEntities(response.body);
          } else {
            setMessageType(WARNING);
            setMessage(ERROR_ON_GETTING_PLANS);
          }
        } else {
          dispatch({ type: 'LOGGED_OUT' });
          dispatch({ type: 'CLEAR_USER_DATA' });
          dispatch({ type: 'SET_GLOBAL_MESSAGE', payload: { message: SESSION_EXPIRED, messageType: WARNING } });
          navigate('/login');
        }
      } catch (error) {
        setMessageType(WARNING);
        setMessage(error.message);
      }
    };

    fetchData();
  }, []);

  return (<>
    <HelmetProvider>
      <Helmet>
        <title>Workout Reminders</title>
        <html lang='en' />
      </Helmet>
    </HelmetProvider>

    <Links active='reminders' />

    <Alert message={message} messageType={messageType} />

    <div>
      <Button title='Add reminder' link='/plans/workouts/add' />
      <br /><br />
    </div>

    {entities && entities.length > 0 && (
      <div className='d-flex flex-wrap justify-content-left'>
        {entities.map(item => (
          <PlanCard
            key={item.id}
            id={item.id}
            workoutId={item.workoutId}
            workoutTitle={item.workoutTitle}
            startDate={item.startDate}
            endDate={item.endDate}
            jsonDescription={item.jsonDescription}
          />
        ))
        }
      </div>
    )}
  </>);
};

export default ListPlans;
