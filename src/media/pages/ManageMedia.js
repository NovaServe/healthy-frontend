import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Alert from '../../shared/components/Alert.js';
import AlertsList from '../../shared/components/AlertsList.js';
import ValidationMessage from '../../shared/components/ValidationMessage.js';
import BackLink from '../../shared/components/BackLink.js';
import { validateToken, getToken } from '../../auth/services/auth.js';
import { validateUpdateMedia } from '../services/util.js';
import { updateCustomMediaById, getCustomMediaById, deleteCustomMediaById } from '../services/requests.js';
import { buildAlertsList } from '../../shared/services/util.js';
import { SESSION_EXPIRED } from '../../auth/services/message.js';
import { SUCCESS, WARNING, } from '../../shared/services/message.js';
import { MEDIA_UPDATED, MEDIA_DELETED } from '../services/message.js';

const ManageMedia = ({ urlHistory }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentHttpRef, setCurrentHttpRef] = useState({});
  const [mediaName, setMediaName] = useState('');
  const [description, setDescription] = useState('');
  const [httpRef, setHttpRef] = useState('');
  const [httpRefType, setHttpRefType] = useState('');
  const [mediaNameValidation, setMediaNameValidation] = useState('');
  const [descriptionValidation, setDescriptionValidation] = useState('');
  const [httpRefValidation, setHttpRefValidation] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [messagesList, setMessagesList] = useState([]);
  const [messagesType, setMessagesType] = useState('');
  const [isDelete, setIsDelete] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    dispatch({ type: 'SET_CURRENT_URL', payload: { currentUrl: location.pathname } });

    const fetchData = async() => {
      try {
        const data = await validateToken();
        if (data.status === 200) {
          dispatch({ type: 'LOGGED_IN' });
          dispatch({ type: 'SET_USER_DATA', payload: { fullName: data.body[1] } });

          const params = location.pathname.split('/').slice(2);
          //const type = params[0];
          const id = params[1];
          const token = getToken();
          const response = await getCustomMediaById(id, token);
          setCurrentHttpRef(response.body);
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

  const handleSubmit = (event) => {
    const requestAPI = async(requestBody) => {
      try {
        const token = getToken();
        const params = location.pathname.split('/').slice(2);
        //const type = params[0];
        const id = params[1];
        const response = await updateCustomMediaById(token, id, requestBody);
        if (response.status === 200) {
          setMessage(MEDIA_UPDATED);
          setMessageType(SUCCESS);
          setMessagesList([]);
          setMessagesType('');
          setCurrentHttpRef(response.body);
        } else if (response.status === 401) {
          dispatch({ type: 'LOGGED_OUT' });
          dispatch({ type: 'CLEAR_USER_DATA' });
          dispatch({ type: 'SET_GLOBAL_MESSAGE', payload: { message: SESSION_EXPIRED, messageType: WARNING } });
          navigate('/login');
        } else {
          const messages = buildAlertsList(response.body);
          setMessagesType(WARNING);
          setMessagesList(messages);
        }
      } catch (error) {
        setMessageType(WARNING);
        setMessage(error.message);
      }
    };

    event.preventDefault();

    const validationResult = validateUpdateMedia(currentHttpRef, mediaName, description, httpRef, httpRefType);

    if (validationResult.status) {
      handleClearForm();
      requestAPI(validationResult.requestBody);
    } else {
      if (validationResult.validation.message !== '') {
        setMessage(validationResult.validation.message);
        setMessageType(WARNING);
      }
      if (validationResult.validation.name !== '') {
        setMediaNameValidation(validationResult.validation.name);
      }
      if (validationResult.validation.description !== '') {
        setDescriptionValidation(validationResult.validation.description);
      }
      if (validationResult.validation.ref !== '') {
        setHttpRefValidation(validationResult.validation.ref);
      }
    }
  };

  const handleSubmitDelete = (event) => {
    const requestAPIDelete = async() => {
      try {
        const token = getToken();
        const params = location.pathname.split('/').slice(2);
        //const type = params[0];
        const id = params[1];
        const response = await deleteCustomMediaById(token, id);

        if (response.status === 204) {
          setMessage(MEDIA_DELETED);
          setMessageType(SUCCESS);
          setMessagesList([]);
          setMessagesType('');
          setCurrentHttpRef({});
          setIsDeleted(true);
        } else if (response.status === 401) {
          dispatch({ type: 'LOGGED_OUT' });
          dispatch({ type: 'CLEAR_USER_DATA' });
          dispatch({ type: 'SET_GLOBAL_MESSAGE', payload: { message: SESSION_EXPIRED, messageType: WARNING } });
          navigate('/login');
        } else {
          const messages = buildAlertsList(response.body);
          setMessagesType(WARNING);
          setMessagesList(messages);
        }
      } catch (error) {
        setMessageType(WARNING);
        setMessage(error.message);
      }
    };

    event.preventDefault();
    handleClearForm();
    requestAPIDelete();
  };

  const handleClearForm = () => {
    setMediaNameValidation('');
    setDescriptionValidation('');
    setHttpRefValidation('');

    setMessagesList([]);
    setMessagesType('');

    setMediaName('');
    setDescription('');
    setHttpRef('');
    setHttpRefType('');
    setMessage('');
    setMessageType('');
  };

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Manage Media</title>
          <html lang='en' />
        </Helmet>
      </HelmetProvider>

      <BackLink previousUrl={urlHistory.previousUrl} currentUrl={urlHistory.currentUrl} />

      {!isDeleted && <div className='custom-heading'>Update media</div>}

      <Alert message={message} messageType={messageType} />

      {messagesList && messagesList.length > 0 &&
                (<AlertsList messages={messagesList} messageType={messagesType} />)}

      {!isDeleted && (
        <div>
          <form onSubmit={handleSubmit} style={{ marginBottom: 14 }}>

            <div className='form-group filter-mr'>
              <label htmlFor='name' className='form-label'>Name: {currentHttpRef.name}</label>
              <input type='text' id='name' name='name' className='form-input'
                value={mediaName} onChange={(e) => setMediaName(e.target.value)} />
              {mediaNameValidation && <ValidationMessage message={mediaNameValidation} />}
            </div>

            <div className='form-group'>
              <label htmlFor='description' className='form-label'>Description: {currentHttpRef.description}</label>
              <input type='text' id='description' name='description' className='form-input'
                value={description} onChange={(e) => setDescription(e.target.value)} />
              {descriptionValidation && <ValidationMessage message={descriptionValidation} />}
            </div>

            <div className='form-group'>
              <label htmlFor='httpRefType' className='form-label'>Media Type: {currentHttpRef.httpRefTypeName}</label>
              <select id='httpRefType' name='httpRefType' className='form-label form-input filter-mr'
                value={httpRefType} onChange={(e) => setHttpRefType(e.target.value)} >
                <option value='' disabled>Media Type</option>
                <option value='YOUTUBE' disabled={'YOUTUBE' === currentHttpRef.httpRefTypeName}>YouTube</option>
                <option value='OTHER' disabled={'OTHER' === currentHttpRef.httpRefTypeName}>Other</option>
              </select>
            </div>

            <div className='form-group'>
              <label htmlFor='httpRef' className='form-label'>Link: {currentHttpRef.ref}</label>
              <input type='text' id='httpRef' name='httpRef' className='form-input'
                value={httpRef} onChange={(e) => setHttpRef(e.target.value)} />
              {httpRefValidation && <ValidationMessage message={httpRefValidation} />}
            </div>

            <button type='button' className='form-btn' onClick={handleClearForm} style={{ marginRight: 8 }}>Clear</button>
            <input type='submit' value='Apply' className='form-btn' />
          </form>

          <form onSubmit={handleSubmitDelete}>
            <input type="checkbox" id="isDelete" name="isDelete"
              checked={isDelete} onChange={(e) => setIsDelete(e.target.checked)} />
            <label htmlFor="isDelete" className='filter-checkbox-mx'>Delete</label><br></br>

            <input type='submit' value='Delete' className={`form-btn ${!isDelete ? 'btn-disabled' : ''}`} />
          </form>
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    urlHistory: state.urlHistory
  };
};

export default connect(mapStateToProps)(ManageMedia);
