import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import YouTubeCard from '../components/YouTubeCard.js';
import Links from '../../workouts/components/Links.js';
import Filter from '../../shared/components/Filter.js';
import Pagination from '../../shared/components/Pagination.js';
import Button from '../../shared/components/Button.js';
import Alert from '../../shared/components/Alert.js';
import { validateToken, getToken } from '../../auth/services/auth.js';
import { getDefaultMedia, getCustomMedia } from '../services/requests.js';
import { buildUrlMediaFilter } from '../services/util.js';

const ListMedia = ({ isLoggedIn }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [defaultMedia, setDefaultMedia] = useState([]);
  const [customMedia, setCustomMedia] = useState([]);
  const [filterParams, setFilterParams] = useState({
    mediaName: '',
    description: '',
    isCustom: false,
    isDefault: false,
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
      const urlPostfix = buildUrlMediaFilter(
        filterParams.mediaName,
        filterParams.description,
        filterParams.isCustom,
        filterParams.isDefault,
        filterParams.sortField,
        filterParams.sortDirection,
        filterParams.pageSize,
        filterParams.currentPageZeroBased);

      try {
        const data = await validateToken();
        if (data.status === 200) {
          dispatch({ type: 'LOGGED_IN' });
          dispatch({ type: 'SET_USER_DATA', payload: { fullName: data.body[1] } });
          const token = getToken();
          const customMedia = await getCustomMedia(token, urlPostfix);
          setCustomMedia(customMedia.body.content);
          setTotalPages(customMedia.body.totalPages);
          setTotalElements(customMedia.body.totalElements);
        } else {
          dispatch({ type: 'LOGGED_OUT' });
          dispatch({ type: 'CLEAR_USER_DATA' });
          const defaultMedia = await getDefaultMedia(urlPostfix);
          setDefaultMedia(defaultMedia.body.content);
          setTotalPages(defaultMedia.body.totalPages);
          setTotalElements(defaultMedia.body.totalElements);
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
          <title>Workouts Media</title>
          <html lang='en' />
        </Helmet>
      </HelmetProvider>

      <Links active='media' />

      {isLoggedIn && (
        <div>
          <Button title='Add media' link='/media/workouts/add' />
          <br /><br />
        </div>
      )}
      <Filter onFilterChange={handleFilterChange} />

      {message && messageType && (<Alert message={message} messageType={messageType} />)}

      <div>Found {totalElements}</div>

      {defaultMedia && defaultMedia.length > 0 && (
        <div className='d-flex flex-wrap justify-content-left'>
          {defaultMedia.map(item => (
            <YouTubeCard
              key={item.id}
              id={item.id}
              title={item.name}
              subtitle={`${item.isCustom ? 'Custom' : 'In-app'}`}
              description={item.description}
              httpRef={item.ref}
              httpRefTypeName={item.httpRefTypeName}
              isCustom={item.isCustom}
            />
          ))
          }
        </div>
      )}

      {customMedia && customMedia.length > 0 && (
        <div className='d-flex flex-wrap justify-content-left'>
          {customMedia.map(item => (
            <YouTubeCard
              key={item.id}
              id={item.id}
              title={item.name}
              subtitle={`${item.isCustom ? 'Custom' : 'In-app'}`}
              description={item.description}
              httpRef={item.ref}
              httpRefTypeName={item.httpRefTypeName}
              isCustom={item.isCustom}
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

export default connect(mapStateToProps)(ListMedia);