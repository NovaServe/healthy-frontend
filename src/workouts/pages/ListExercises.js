import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Links from '../components/Links.js';
import ExercisesFilter from '../components/ExercisesFilter.js';
import Pagination from '../../shared/components/Pagination.js';
import Button from '../../shared/components/Button.js';
import Card from '../../shared/components/Card.js';
import Alert from '../../shared/components/Alert.js';
import { validateToken, getToken } from '../../auth/services/auth.js';
import { getDefaultExercises, getCustomExercises, getBodyParts } from '../services/requests.js';
import { buildUrlFilter } from '../services/util.js';

const ListExercises = ({ isLoggedIn }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [defaultEntities, setDefaultEntities] = useState([]);
  const [customEntities, setCustomEntities] = useState([]);
  const [bodyParts, setBodyParts] = useState([]);
  const [filterParams, setFilterParams] = useState({
    title: '',
    description: '',
    isCustom: false,
    isDefault: false,
    bodyPartsIds: [],
    sortField: '',
    sortDirection: '',
    pageSize: '',
    currentPageZeroBased: 0
  });
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    dispatch({ type: 'SET_CURRENT_URL', payload: { currentUrl: location.pathname } });

    const fetchData = async() => {
      const urlPostfix = buildUrlFilter(
        filterParams.title,
        filterParams.description,
        filterParams.isCustom,
        filterParams.isDefault,
        filterParams.bodyPartsIds,
        filterParams.sortField,
        filterParams.sortDirection,
        filterParams.pageSize,
        filterParams.currentPageZeroBased);
      console.log(urlPostfix);

      try {
        const data = await validateToken();
        if (data.status === 200) {
          dispatch({ type: 'LOGGED_IN' });
          dispatch({ type: 'SET_USER_DATA', payload: { fullName: data.body[1] } });
          const token = getToken();
          const customEntities = await getCustomExercises(token, urlPostfix);
          setCustomEntities(customEntities.body.content);
          setTotalPages(customEntities.body.totalPages);
          setTotalElements(customEntities.body.totalElements);
          if (bodyParts.length === 0) {
            const bodyPartsResponse = await getBodyParts();
            setBodyParts(bodyPartsResponse.body);
          }
        } else {
          dispatch({ type: 'LOGGED_OUT' });
          dispatch({ type: 'CLEAR_USER_DATA' });
          const defaultEntities = await getDefaultExercises(urlPostfix);
          setDefaultEntities(defaultEntities.body.content);
          setTotalPages(defaultEntities.body.totalPages);
          setTotalElements(defaultEntities.body.totalElements);
          if (bodyParts.length === 0) {
            const bodyPartsResponse = await getBodyParts();
            setBodyParts(bodyPartsResponse.body);
          }
        }
      } catch (error) {
        setMessageType('WARNING');
        setMessage(error.message);
      }
    };

    fetchData();
  }, [filterParams]);

  const handleFilterChange = (newFilterParams) => {
    setFilterParams(newFilterParams);
  };

  const handlePageChange = (pageNumberZeroBased) => {
    setFilterParams({
      ...filterParams,
      currentPageZeroBased: pageNumberZeroBased
    });
  };

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Exercises</title>
          <html lang='en' />
        </Helmet>
      </HelmetProvider>

      <Links active='exercises' />

      {isLoggedIn && (
        <div>
          <Button title='Add exercise' link='/workouts/exercises/add' />
          <br /><br />
        </div>
      )}
      <ExercisesFilter onFilterChange={handleFilterChange} bodyParts={bodyParts} />

      {message && messageType && (<Alert message={message} messageType={messageType} />)}

      <div>Found {totalElements}</div>

      {defaultEntities && defaultEntities.length > 0 && (
        <div className='d-flex flex-wrap justify-content-left'>
          {defaultEntities.map(item => (
            <Card
              key={item.id}
              id={item.id}
              title={item.title}
              subtitle={`${item.isCustom ? 'Custom' : 'In-app'}`}
              tags={item.bodyParts}
              description={item.description}
              isCustom={item.isCustom}
              btnTitle='Detail'
              btnLink={item.isCustom ? `/workouts/exercise/custom/${item.id}` : `/workouts/exercise/default/${item.id}`}
            />
          ))
          }
        </div>
      )}

      {customEntities && customEntities.length > 0 && (
        <div className='d-flex flex-wrap justify-content-left'>
          {customEntities.map(item => (
            <Card
              key={item.id}
              id={item.id}
              title={item.title}
              subtitle={`${item.isCustom ? 'Custom' : 'In-app'}`}
              tags={item.bodyParts}
              description={item.description}
              isCustom={item.isCustom}
              btnTitle='Detail'
              btnLink={item.isCustom ? `/workouts/exercise/custom/${item.id}` : `/workouts/exercise/default/${item.id}`}
            />
          ))
          }
        </div>
      )}

      <Pagination
        currentPageZeroBased={filterParams.currentPageZeroBased}
        totalPages={totalPages}
        onPageChange={handlePageChange} />

    </>
  );
};

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.isLoggedIn
  };
};

export default connect(mapStateToProps)(ListExercises);