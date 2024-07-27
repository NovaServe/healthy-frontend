import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import BackLink from '../../shared/components/BackLink';
import WorkoutDetail from '../components/WorkoutDetail';
import Alert from '../../shared/components/Alert';
import { getDefaultWorkoutById, getCustomWorkoutById } from '../services/requests';
import { validateToken, getToken } from '../../auth/services/auth';

const GetWorkoutDetail = ({ urlHistory }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { type, id } = useParams();
  const [entity, setEntity] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    const fetchData = async() => {
      try {
        const data = await validateToken();
        if (data.status === 200) {
          dispatch({ type: 'LOGGED_IN' });
          dispatch({ type: 'SET_USER_DATA', payload: { fullName: data.body[1] } });
          let response;
          if (type === 'custom') {
            const token = getToken();
            response = await getCustomWorkoutById(id, token);
          } else if (type === 'default') {
            response = await getDefaultWorkoutById(id);
          }
          setEntity(response.body);
        } else {
          dispatch({ type: 'LOGGED_OUT' });
          dispatch({ type: 'CLEAR_USER_DATA' });
          const response = await getDefaultWorkoutById(id);
          setEntity(response.body);
        }
      } catch (error) {
        setMessageType('WARNING');
        setMessage(error.message);
      }
    };

    dispatch({ type: 'SET_CURRENT_URL', payload: { currentUrl: location.pathname } });
    fetchData();
  }, []);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Workout Detail</title>
          <html lang="en" />
        </Helmet>
      </HelmetProvider>

      <BackLink previousUrl={urlHistory.previousUrl} currentUrl={urlHistory.currentUrl} />

      {message && messageType && (<Alert message={message} messageType={messageType} />)}

      <WorkoutDetail
        key={entity.id}
        title={entity.title}
        subtitle={`${entity.isCustom ? 'Custom' : 'In-app'}` + ' | ' + `${entity.needsEquipment ? 'With equipment' : 'Without equipment'}`}
        tags={entity.bodyParts}
        description={entity.description}
        exercises={entity.exercises}
      />
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    urlHistory: state.urlHistory
  };
};

export default connect(mapStateToProps)(GetWorkoutDetail);
