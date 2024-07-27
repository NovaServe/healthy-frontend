import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Card from '../../shared/components/Card.js';
import Links from '../components/Links.js';
import Pagination from '../../shared/components/Pagination.js';
import ExercisesFilter from '../components/ExercisesFilter.js';
import Alert from '../../shared/components/Alert.js';
import { validateToken, getToken } from '../../auth/services/auth.js';
import { buildUrlFilter } from '../services/util.js';
import { getCustomWorkouts, getDefaultWorkouts, getBodyParts } from '../services/requests.js';

const ListWorkouts = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [defaultWorkouts, setDefaultWorkouts] = useState([]);
  const [customWorkouts, setCustomWorkouts] = useState([]);
  const [bodyParts, setBodyParts] = useState([]);
  const [filterParams, setFilterParams] = useState({
    pageSize: '',
    sortField: '',
    sortDirection: '',
    isDefault: false,
    isCustom: false,
    bodyPartsIds: [],
    title: '',
    description: '',
    currentPageZeroBased: 0,
  });
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  
  const handlePageChange = (currentPageZeroBased) => {
    setFilterParams(prev => ({ ...prev, currentPageZeroBased }));
  };

  const handleApplyChanges = (newFilterParams) => {
    setFilterParams(newFilterParams);
  };

  useEffect(() => {
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
        filterParams.currentPageZeroBased,
      );
      try {
        const data = await validateToken();
        if (data.status === 200) {
          dispatch({ type: 'LOGGED_IN' });
          dispatch({ type: 'SET_USER_DATA', payload: { fullName: data.body[1] } });
          const token = getToken();
          const customWorkouts = await getCustomWorkouts(token, urlPostfix);
          setCustomWorkouts(customWorkouts.body.content);
          setTotalPages(customWorkouts.body.totalPages);
          setTotalElements(customWorkouts.body.totalElements);
          if (bodyParts.length === 0) {
            const bodyPartsResponse = await getBodyParts();
            setBodyParts(bodyPartsResponse.body);
          }
        } else {
          dispatch({ type: 'LOGGED_OUT' });
          dispatch({ type: 'CLEAR_USER_DATA' });
          const defaultWorkouts = await getDefaultWorkouts(urlPostfix);
          setDefaultWorkouts(defaultWorkouts.body.content);
          setTotalPages(defaultWorkouts.body.totalPages);
          setTotalElements(defaultWorkouts.body.totalElements);
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

    dispatch({ type: 'SET_CURRENT_URL', payload: { currentUrl: location.pathname } });
    fetchData();
  }, [filterParams]);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Workouts</title>
          <html lang="en" />
        </Helmet>
      </HelmetProvider>

      <div>
        <Links active='workouts' />

        <ExercisesFilter onFilterChange={handleApplyChanges} bodyParts={bodyParts} />

        {message && messageType && (<Alert message={message} messageType={messageType} />)}

        <div>Found {totalElements}</div>

        {defaultWorkouts && defaultWorkouts.length > 0 && (
          <div className='d-flex flex-wrap justify-content-left'>
            {defaultWorkouts.map(item => (
              <Card
                key={item.id}
                title={item.title}
                subtitle={`${item.isCustom ? 'Custom' : 'In-app'}` + ' | ' + `${item.needsEquipment ? 'With equipment' : 'Without equipment'}`}
                tags={item.bodyParts}
                description={item.description}
                btnTitle={'Detail'}
                btnLink={item.isCustom ? `/workouts/custom/${item.id}` : `/workouts/default/${item.id}`}
              />
            ))
            }
          </div>
        )}

        {customWorkouts && customWorkouts.length > 0 && (
          <div className='d-flex flex-wrap justify-content-left'>
            {customWorkouts.map(item => (
              <Card
                key={item.id}
                title={item.title}
                subtitle={`${item.isCustom ? 'Custom' : 'In-app'}` + ' | ' + `${item.needsEquipment ? 'With equipment' : 'Without equipment'}`}
                tags={item.bodyParts}
                description={item.description}
                btnTitle={'Detail'}
                btnLink={item.isCustom ? `/workouts/custom/${item.id}` : `/workouts/default/${item.id}`}
              />
            ))
            }
          </div>
        )}

        <Pagination
          currentPageZeroBased={filterParams.currentPageZeroBased}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default ListWorkouts;