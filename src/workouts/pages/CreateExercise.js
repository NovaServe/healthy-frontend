import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Alert from '../../shared/components/Alert.js';
import AlertsList from '../../shared/components/AlertsList.js';
import ValidationMessage from '../../shared/components/ValidationMessage.js';
import BackLink from '../../shared/components/BackLink.js';
import { validateToken, getToken } from '../../auth/services/auth';
import { buildAlertsList } from '../../shared/services/util.js';
import { SESSION_EXPIRED } from '../../auth/services/message.js';
import { SUCCESS, WARNING } from '../../shared/services/message.js';
import { createExercise, getBodyParts } from '../services/requests.js';
import { getDefaultAndCustomMedia } from '../../media/services/requests.js';
import { EXERCISE_CREATED } from '../services/messages.js';
import { validateCreateExercise } from '../services/util.js';

const CreateExercise = ({ urlHistory }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [bodyPartsDropdown, setBodyPartsDropdown] = useState([]);
  const [httpRefsDropdown, setHttpRefsDropdown] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    needsEquipment: false,
    bodyParts: [],
    httpRefs: []
  });
  const [formValidation, setFormValidation] = useState({
    isValid: true,
    title: '',
    description: ''
  });

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [messagesList, setMessagesList] = useState([]);
  const [messagesType, setMessagesType] = useState('');

  useEffect(() => {
    dispatch({ type: 'SET_CURRENT_URL', payload: { currentUrl: location.pathname } });

    const fetchData = async() => {
      try {
        const data = await validateToken();
        if (data.status === 200) {
          dispatch({ type: 'LOGGED_IN' });
          dispatch({ type: 'SET_USER_DATA', payload: { fullName: data.body[1] } });

          const bodyPartsDropdownResponse = await getBodyParts();
          setBodyPartsDropdown(bodyPartsDropdownResponse.body);

          const httpRefsDropdownResponse = await getDefaultAndCustomMedia(getToken());
          setHttpRefsDropdown(httpRefsDropdownResponse.body.content);
        } else {
          dispatch({ type: 'LOGGED_OUT' });
          dispatch({ type: 'CLEAR_USER_DATA' });
          dispatch({
            type: 'SET_GLOBAL_MESSAGE',
            payload: { message: SESSION_EXPIRED, messageType: WARNING }
          });
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
    const requestAPI = async() => {
      try {
        const token = getToken();
        const requestDto = formData;
        if (formData.description === '') {
          requestDto.description = null;
        }
        const response = await createExercise(token, requestDto);
        if (response.status === 201) {
          handleClearForm();
          setMessage(EXERCISE_CREATED);
          setMessageType(SUCCESS);
          setMessagesList([]);
          setMessagesType('');
        } else if (response.status === 401) {
          dispatch({ type: 'LOGGED_OUT' });
          dispatch({ type: 'CLEAR_USER_DATA' });
          dispatch({
            type: 'SET_GLOBAL_MESSAGE',
            payload: { message: SESSION_EXPIRED, messageType: WARNING }
          });
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
    const validated = validateCreateExercise(formData.title, formData.description);
    setFormValidation(validated);
    console.log(formValidation);
    if (validated.isValid) {
      requestAPI();
    }
  };

  const handleClearForm = () => {
    setFormData({
      title: '',
      description: '',
      needsEquipment: false,
      bodyParts: [],
      httpRefs: []
    });

    setFormValidation({});
    setMessage('');
    setMessageType('');
    setMessagesList([]);
    setMessagesType('');
  };

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Add Exercise</title>
          <html lang='en' />
        </Helmet>
      </HelmetProvider>

      <BackLink previousUrl={urlHistory.previousUrl} currentUrl={urlHistory.currentUrl} />

      <div className='custom-heading'>Add a new exercise</div>

      <Alert message={message} messageType={messageType} />

      {messagesList && messagesList.length > 0 &&
                (<AlertsList messages={messagesList} messageType={messagesType} />)}

      <form onSubmit={handleSubmit}>

        <div className='form-group filter-mr'>
          <label htmlFor='title' className='form-label'>Title</label>
          <input type='text' id='title' name='title' className='form-input'
            value={formData.title} onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })} required />
          {formValidation && !formValidation.isValid && formValidation.title !== ''
                        && <ValidationMessage message={formValidation.title} />}
        </div>

        <div className='form-group'>
          <label htmlFor='description' className='form-label'>Description</label>
          <textarea type='text' id='description' name='description' className='form-input'
            rows={5} cols={24}
            value={formData.description} onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })} />
          {formValidation && !formValidation.isValid && formValidation.description !== ''
                        && <ValidationMessage message={formValidation.description} />}
        </div>

        <div className='filter-checkbox-group'>
          <input type="checkbox" id="needsEquipment" name="needsEquipment"
            checked={formData.needsEquipment} onChange={(e) =>
              setFormData({ ...formData, needsEquipment: e.target.checked })} />
          <label htmlFor="needsEquipment" className='filter-checkbox-mx'>Needs equipment</label><br></br>
        </div>

        <div className='form-group'>
          <label htmlFor="bodyPartsIds" className='form-label'>Focus area</label>
          <select id="bodyPartsIds" name="bodyPartsIds"
            className='form-label form-input filter-mr exercises-filter-multiple-dropdown'
            value={formData.bodyParts}
            onChange={(e) =>
              setFormData({ ...formData, bodyParts: Array.from(e.target.selectedOptions, option => option.value) })}
            multiple required >
            {bodyPartsDropdown.map(item => <option value={item.id} key={item.id}>{item.name}</option>)}
          </select>
        </div>

        <div className='form-group'>
          <label htmlFor="httpRefsIds" className='form-label'>Related media</label>
          <select id="httpRefsIds" name="httpRefsIds"
            className='form-label form-input filter-mr exercises-filter-multiple-dropdown'
            value={formData.httpRefs}
            onChange={(e) =>
              setFormData({ ...formData, httpRefs: Array.from(e.target.selectedOptions, option => option.value) })}
            multiple >
            {httpRefsDropdown.map(item => <option value={item.id} key={item.id}>{item.name}</option>)}
          </select>
        </div>

        <button type='button' className='form-btn' onClick={handleClearForm}
          style={{ marginRight: 8 }}>Clear</button>
        <input type='submit' value='Apply' className='form-btn' />
      </form>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    urlHistory: state.urlHistory
  };
};

export default connect(mapStateToProps)(CreateExercise);