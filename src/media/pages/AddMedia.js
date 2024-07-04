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
import { validateTitle, validateDescription, validateHttpLink } from '../../shared/services/validation.js';
import { createMedia } from '../services/requests.js';
import { buildAlertsList } from '../../shared/services/util.js';
import { MEDIA_ADDED } from '../services/message.js';
import { SUCCESS, WARNING } from '../../shared/services/message.js';
import { SESSION_EXPIRED } from '../../auth/services/message.js';

const ListMedia = ({ urlHistory }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

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

    useEffect(() => {
        dispatch({ type: 'SET_CURRENT_URL', payload: { currentUrl: location.pathname } });

        const fetchData = async () => {
            try {
                const data = await validateToken();
                if (data.status === 200) {
                    dispatch({ type: 'LOGGED_IN' });
                    dispatch({ type: 'SET_USER_DATA', payload: { fullName: data.body[1] } });
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
        const requestAPI = async () => {
            try {
                const token = getToken();
                const requestBody = {
                    name: mediaName,
                    description: description,
                    httpRefType: httpRefType,
                    ref: httpRef
                }
                const response = await createMedia(token, requestBody);
                if (response.status === 201) {
                    handleClearForm();
                    setMessage(MEDIA_ADDED);
                    setMessageType(SUCCESS);
                    setMessagesList([]);
                    setMessagesType('');
                } else if (response.status === 401) {
                    dispatch({ type: 'LOGGED_OUT' });
                    dispatch({ type: 'CLEAR_USER_DATA' });
                    dispatch({ type: 'SET_GLOBAL_MESSAGE', payload: { message: SESSION_EXPIRED, messageType: WARNING } });
                    navigate('/login');
                } else {
                    const messages = buildAlertsList(response.body)
                    setMessagesType(WARNING);
                    setMessagesList(messages);
                }
            } catch (error) {
                setMessageType(WARNING);
                setMessage(error.message);
            }
        };

        event.preventDefault();
        const titleValidationMessage = validateTitle(mediaName);
        const descriptionValidationMessage = validateDescription(description);
        const httpRefValidationMessage = validateHttpLink(httpRef);

        if (titleValidationMessage === '' && descriptionValidationMessage === '' && httpRefValidationMessage === '') {
            requestAPI();
        } else {
            if (titleValidationMessage !== '') {
                setMediaNameValidation(titleValidationMessage);
            }
            if (descriptionValidationMessage !== '') {
                setDescriptionValidation(descriptionValidationMessage);
            }
            if (httpRefValidationMessage !== '') {
                setHttpRefValidation(httpRefValidationMessage);
            }
        }
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
    }

    return (
        <>
            <HelmetProvider>
                <Helmet>
                    <title>Add Media</title>
                    <html lang='en' />
                </Helmet>
            </HelmetProvider>

            <BackLink previousUrl={urlHistory.previousUrl} currentUrl={urlHistory.currentUrl} />

            <div className='custom-heading'>Add a new media</div>

            <Alert message={message} messageType={messageType} />

            {messagesList && messagesList.length > 0 &&
                (<AlertsList messages={messagesList} messageType={messagesType} />)}

            <form onSubmit={handleSubmit}>

                <div className='form-group filter-mr'>
                    <label htmlFor='name' className='form-label'>Name</label>
                    <input type='text' id='name' name='name' className='form-input'
                        value={mediaName} onChange={(e) => setMediaName(e.target.value)} required />
                    {mediaNameValidation && <ValidationMessage message={mediaNameValidation} />}
                </div>

                <div className='form-group'>
                    <label htmlFor='description' className='form-label'>Description</label>
                    <input type='text' id='description' name='description' className='form-input'
                        value={description} onChange={(e) => setDescription(e.target.value)} />
                    {descriptionValidation && <ValidationMessage message={descriptionValidation} />}
                </div>

                <div className='form-group'>
                    <select id='httpRefType' name='httpRefType' className='form-label form-input filter-mr'
                        value={httpRefType} onChange={(e) => setHttpRefType(e.target.value)} required>
                        <option value='' disabled>Media Type</option>
                        <option value='YOUTUBE'>YouTube</option>
                        <option value='OTHER'>Other</option>
                    </select>
                </div>

                <div className='form-group'>
                    <label htmlFor='httpRef' className='form-label'>Link</label>
                    <input type='text' id='httpRef' name='httpRef' className='form-input'
                        value={httpRef} onChange={(e) => setHttpRef(e.target.value)} required />
                    {httpRefValidation && <ValidationMessage message={httpRefValidation} />}
                </div>

                <button type='button' className='form-btn' onClick={handleClearForm}
                    style={{ marginRight: 8 }}>Clear</button>
                <input type='submit' value='Apply' className='form-btn' />
            </form>
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        urlHistory: state.urlHistory
    };
};

export default connect(mapStateToProps)(ListMedia);
