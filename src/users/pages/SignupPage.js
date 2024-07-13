import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import Alert from '../../shared/components/Alert.js';
import AlertsList from '../../shared/components/AlertsList.js';

import { getCountries, signup, getTimezones } from '../services/requests.js';
import { validateForm } from '../services/validation.js';
import { buildAlertsList } from '../../shared/services/util.js';
import { SUCCESS, WARNING } from '../../shared/services/message.js';
import { ACCOUNT_EXISTS, ALREADY_EXISTS, SIGNUP_FAILED, SIGNUP_SUCCESSFULL } from '../services/message.js';
import '../../shared/style/form.css';
import ValidationMessage from '../../shared/components/ValidationMessage.js';

const SignupPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        countryId: '',
        timezoneId: '',
        age: ''
    });
    const [countries, setCountries] = useState([]);
    const [timezones, setTimezones] = useState([]);
    const [validationMessage, setValidationMessage] = useState({
        isValid: true,
        fullName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        countryId: '',
        timezoneId: '',
        age: '',
    });
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [messagesList, setMessagesList] = useState([]);
    const [messagesType, setMessagesType] = useState("");
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            const countriesResponse = await getCountries();
            setCountries(countriesResponse.body);
            const timezonesResponse = await getTimezones();
            setTimezones(timezonesResponse.body);
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleClear = () => {
        setFormData({
            fullName: '',
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            countryId: '',
            timezoneId: '',
            age: ''
        });
        setValidationMessage({
            isValid: true,
            fullName: '',
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            countryId: '',
            timezoneId: '',
            age: '',
        });
        setMessage('');
        setMessageType('');
        setMessagesList([]);
        setMessagesType('');

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        handleClear();

        const fetchSignup = async () => {
            try {
                const response = await signup(formData);

                if (response.status === 201) {
                    dispatch({
                        type: 'SET_GLOBAL_MESSAGE',
                        payload: {
                            messageType: SUCCESS,
                            message: SIGNUP_SUCCESSFULL
                        }
                    });
                    navigate('/login');
                } else if (response.status === 400) {
                    const responseBody = response.body || {};
                    const message = responseBody.message || null;

                    if (message === ALREADY_EXISTS) {
                        setMessageType(WARNING);
                        setMessage(ACCOUNT_EXISTS);
                    } else {
                        const messages = buildAlertsList(responseBody);
                        setMessagesType(WARNING);
                        setMessagesList(messages);
                    }
                } else {
                    setMessageType(WARNING);
                    setMessage(SIGNUP_FAILED);
                }
            } catch (error) {
                setMessageType(WARNING);
                setMessage(`Error: ${error.message}`);
            }
        };


        const validation = validateForm(formData);
        if (validation.isValid) {
            fetchSignup();
        } else {
            setValidationMessage(validation);
        }
    };

    return (
        <div className='d-flex flex-column align-items-center' style={{ marginTop: '6rem' }}>
            <HelmetProvider>
                <Helmet>
                    <title>Signup</title>
                    <html lang='en' />
                </Helmet>
            </HelmetProvider>

            <h3 className='text-muted' style={{ marginBottom: '1rem' }}>Signup</h3>

            <Alert message={message} messageType={messageType} />

            {messagesList && messagesList.length > 0 &&
                (<AlertsList messages={messagesList} messageType={messagesType} />)}

            <form onSubmit={handleSubmit} style={{ width: 'fit-content' }} className='form-custom mb-5'>

                <div className='form-group mb-3' controlId='fullName'>
                    <label className="form-label" for="fullname">Full Name</label>
                    <input
                        className="form-input"
                        type='text'
                        id="fullname"
                        name='fullName'
                        placeholder='Enter full name'
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                    />
                    {validationMessage && !validationMessage.isValid && validationMessage.fullName !== ''
                        && (<ValidationMessage message={validationMessage.fullName} />)}
                </div>

                <div className='form-group mb-3' controlId='username'>
                    <label className="form-label" for="username">Username</label>
                    <input
                        className="form-input"
                        type='text'
                        name='username'
                        placeholder='Enter username'
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                    {validationMessage && !validationMessage.isValid && validationMessage.username !== ''
                        && (<ValidationMessage message={validationMessage.username} />)}
                </div>

                <div className='form-group mb-3' controlId='email'>
                    <label className="form-label" for="email">Email address</label>
                    <input
                        className="form-input"
                        type='email'
                        id="email"
                        name='email'
                        placeholder='Enter email'
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    {validationMessage && !validationMessage.isValid && validationMessage.email !== ''
                        && (<ValidationMessage message={validationMessage.email} />)}
                </div>

                <div className='form-group mb-3' controlId='password'>
                    <label className="form-label" for="password">Password</label>
                    <input
                        className="form-input"
                        type='password'
                        id="password"
                        name='password'
                        placeholder='Password'
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    {validationMessage && !validationMessage.isValid && validationMessage.password
                        && (<ValidationMessage message={validationMessage.password} />)}
                </div>

                <div className='form-group mb-3' controlId='confirmPassword'>
                    <label className="form-label" for="confirmPassword">Confirm Password</label>
                    <input
                        className="form-input"
                        type='password'
                        id="confirmPassword"
                        name='confirmPassword'
                        placeholder='Confirm password'
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    {validationMessage && !validationMessage.isValid && validationMessage.confirmPassword
                        && (<ValidationMessage message={validationMessage.confirmPassword} />)}
                </div>

                {countries && (
                    <div className='form-group mb-3' controlId='countryId'>
                        <label className="form-label" for="countryId">Country</label>
                        <select aria-label='Select Country' id="countryId" name='countryId'
                            value={formData.countryId} onChange={handleChange} required>
                            <option disabled value='' aria-readonly>Select Country</option>
                            {countries.map((elt) => (
                                <option key={elt.id} value={elt.id}>
                                    {elt.name}
                                </option>
                            ))}
                        </select>
                        {validationMessage && !validationMessage.isValid && validationMessage.countryId
                            && (<ValidationMessage message={validationMessage.countryId} />)}
                    </div>
                )}

                {timezones && (
                    <div className='form-group mb-3' controlId='timezoneId'>
                        <label className="form-label" for="timezoneId">Timezone</label>
                        <select aria-label='Select Timezone' id="timezoneId" name='timezoneId'
                            value={formData.timezoneId} onChange={handleChange} required>
                            <option disabled value='' aria-readonly>Select Timezone</option>
                            {timezones.map((elt) => (
                                <option key={elt.id} value={elt.id}>
                                    {elt.name}, {elt.gmt}
                                </option>
                            ))}
                        </select>
                        {validationMessage && !validationMessage.isValid && validationMessage.timezoneId
                            && (<ValidationMessage message={validationMessage.timezoneId} />)}
                    </div>
                )}

                <div controlId='age' className='form-group mb-4'>
                    <label className="form-label" for="age">Age (optional)</label>
                    <input
                        className="form-input"
                        type='text'
                        id="age"
                        name='age'
                        value={formData.age}
                        onChange={handleChange}
                    />
                    {validationMessage && !validationMessage.isValid && validationMessage.age
                        && (<ValidationMessage message={validationMessage.age} />)}
                </div>

                <button className="form-btn me-3" type="button" onClick={handleClear} variant='primary'>
                    Clear
                </button>

                <button className="form-btn" variant='primary'>
                    Submit
                </button>
            </form>
        </div>
    );
};

export default SignupPage;
