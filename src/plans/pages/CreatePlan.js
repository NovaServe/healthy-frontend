import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';

import Alert from '../../shared/components/Alert.js';
import AlertsList from '../../shared/components/AlertsList.js';
import ValidationMessage from '../../shared/components/ValidationMessage.js';
import BackLink from '../../shared/components/BackLink.js';
import DaySelection from '../components/DaySelection.js';

import { validateToken, getToken } from '../../auth/services/auth';
import { createWorkoutPlan, getDefaultAndCustomWorkoutsWithoutPlans } from '../services/requests.js';
import { buildAlertsList } from '../../shared/services/util.js';
import { SESSION_EXPIRED } from '../../auth/services/message.js';
import { SUCCESS, WARNING } from '../../shared/services/message.js';
import { WORKOUT_PLAN_CREATED, ERROR_ON_GETTING_WORKOUTS } from '../services/message.js';
import { buildCreatePlanDto, validateCreatePlan } from '../services/util.js';

import '../style/repeat-selection.css';

const CreatePlan = ({ isLoggedIn, urlHistory }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { type, id } = useParams();

    const [dropdownWorkoutsWithoutPlans, setDropdownWorkoutsWithoutPlans] = useState([]);
    const [onceRepeatSelectedOption, setOnceRepeatSelectedOption] = useState('once');
    const [daySelectionIndexes, setDaySelectionIndexes] = useState([0]);
    const [activityId, setActivityId] = useState('');
    const [onceDate, setOnceDate] = useState('');
    const [onceHours, setOnceHours] = useState('');
    const [onceMinutes, setOnceMinutes] = useState('');
    const [repeatDays, setRepeatDays] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [validationMessage, setValidationMessage] = useState({
        isValid: true,
        onceDate: null,
        onceHours: null,
        onceMinutes: null,
        startDate: null,
        endDate: null,
        repeatDays: null
    });
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
                    const response = await getDefaultAndCustomWorkoutsWithoutPlans(getToken());
                    if (response.status === 200) {
                        setDropdownWorkoutsWithoutPlans(response.body);
                        if (id !== null) {
                            setActivityId(id);
                        }
                    } else {
                        setMessageType(WARNING);
                        setMessage(ERROR_ON_GETTING_WORKOUTS);
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

    const handleOnceRepeatOptionChange = (event) => {
        setOnceRepeatSelectedOption(event.target.value);
    };

    const handleAddDaySelectionComponent = (event) => {
        event.preventDefault();
        const lastComponentIndex = daySelectionIndexes[daySelectionIndexes.length - 1];
        setDaySelectionIndexes([...daySelectionIndexes, lastComponentIndex + 1]);
    };

    const handleRemoveDaySelectionComponent = (event, componentIndex) => {
        event.preventDefault();
        if (daySelectionIndexes.length > 1) {
            setDaySelectionIndexes(daySelectionIndexes.filter((index) => index !== componentIndex));
            setRepeatDays(repeatDays.filter((elt) => elt.index !== componentIndex));
        }
    };

    const onChangeDaySelection = (newRepeatData, index) => {
        if (newRepeatData.day !== '' && newRepeatData.hours !== '' && newRepeatData.minutes !== '') {
            newRepeatData.index = index;
            setRepeatDays([...repeatDays, newRepeatData]);
        }
    }

    const handleSubmit = (event) => {
        const requestAPI = async () => {
            try {
                const token = getToken();
                const requestBody =
                    buildCreatePlanDto(onceRepeatSelectedOption === 'once', activityId, onceDate, onceHours,
                        onceMinutes, repeatDays, startDate, endDate);
                const response = await createWorkoutPlan(token, requestBody);
                if (response.status === 201) {
                    handleClearForm();
                    setMessage(WORKOUT_PLAN_CREATED);
                    setMessageType(SUCCESS);

                    const responseDropdownWorkouts = await getDefaultAndCustomWorkoutsWithoutPlans(getToken());
                    if (responseDropdownWorkouts.status === 200) {
                        setDropdownWorkoutsWithoutPlans(responseDropdownWorkouts.body);
                    } else {
                        setMessageType(WARNING);
                        setMessage(ERROR_ON_GETTING_WORKOUTS);
                    }
                } else if (response.status === 401) {
                    dispatch({ type: 'LOGGED_OUT' });
                    dispatch({ type: 'CLEAR_USER_DATA' });
                    dispatch({ type: 'SET_GLOBAL_MESSAGE', payload: { message: SESSION_EXPIRED, messageType: WARNING } });
                    navigate('/login');
                } else {
                    clearMessagedAndValidation();
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
        const validated = validateCreatePlan(onceRepeatSelectedOption === 'once', onceDate, repeatDays, startDate, endDate);
        setValidationMessage(validated);
        if (validated.isValid) {
            requestAPI();
        }
    };

    const handleClearForm = () => {
        setActivityId('');
        setStartDate('');
        setEndDate('');
        setOnceDate('');
        setOnceHours('');
        setOnceMinutes('');
        setDaySelectionIndexes([]);
        setRepeatDays([0]); // to avoid display Add button

        setMessagesList([]);
        setMessagesType('');
        setMessage('');
        setMessageType('');
        setValidationMessage({});
        setTimeout(() => {
            setDaySelectionIndexes([0]);
            setRepeatDays([]);
        }, 1);
    }

    const clearMessages = () => {
        setMessagesList([]);
        setMessagesType('');
        setMessage('');
        setMessageType('');
    }

    const clearMessagedAndValidation = () => {
        clearMessages();
        setValidationMessage({});
    }

    return (
        <>
            <HelmetProvider>
                <Helmet>
                    <title>Add to Calendar</title>
                    <html lang='en' />
                </Helmet>
            </HelmetProvider>

            <BackLink previousUrl={urlHistory.previousUrl} currentUrl={urlHistory.currentUrl} />

            <div className='custom-heading'>Add activity to the calendar</div>

            <Alert message={message} messageType={messageType} />

            {messagesList && messagesList.length > 0 &&
                (<AlertsList messages={messagesList} messageType={messagesType} />)}

            <form onSubmit={handleSubmit}>

                <div className='form-group'>
                    <select id='activityId' name='activityId' className='form-label form-input filter-mr'
                        value={activityId} onChange={(e) => setActivityId(e.target.value)} required>
                        <option value='' disabled>Select Activity</option>
                        {dropdownWorkoutsWithoutPlans && dropdownWorkoutsWithoutPlans.map(elt => (
                            <option key={elt.id} value={elt.id}>{elt.id} {elt.title}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <div>
                        <input
                            type='radio'
                            id='once'
                            value='once'
                            checked={onceRepeatSelectedOption === 'once'}
                            onChange={handleOnceRepeatOptionChange}
                        />
                        <label htmlFor='once'>Once</label>
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <input
                            type='radio'
                            id='repeat'
                            value='repeat'
                            checked={onceRepeatSelectedOption === 'repeat'}
                            onChange={handleOnceRepeatOptionChange}
                        />
                        <label htmlFor='repeat'>Repeat</label>
                    </div>

                    {onceRepeatSelectedOption === 'once' ? (
                        <div>
                            <label htmlFor='onceDate' className='form-label'>Select Date</label>
                            <input type='date' id='onceDate' name='onceDate' value={onceDate}
                                onChange={(e) => setOnceDate(e.target.value)}
                                className='form-input' style={{ marginBottom: 16 }} required></input>
                            {validationMessage && !validationMessage.isValid && validationMessage.onceDate !== ''
                                && <ValidationMessage message={validationMessage.onceDate} />}

                            <div style={{ display: 'flex' }}>
                                <select id='once-hours' name='once-hours' className='form-label form-input'
                                    value={onceHours} onChange={(e) => setOnceHours(e.target.value)} required
                                    style={{ marginRight: 16 }}>
                                    <option value='' disabled>Hours</option>
                                    <option value='5'>5 AM</option>
                                    <option value='6'>6 AM</option>
                                    <option value='7'>7 AM</option>
                                    <option value='8'>8 AM</option>
                                    <option value='9'>9 AM</option>
                                    <option value='10'>10 AM</option>
                                    <option value='11'>11 AM</option>
                                    <option value='12'>12 PM</option>
                                    <option value='13'>1 PM</option>
                                    <option value='14'>2 PM</option>
                                    <option value='15'>3 PM</option>
                                    <option value='16'>4 PM</option>
                                    <option value='17'>5 PM</option>
                                    <option value='18'>6 PM</option>
                                    <option value='19'>7 PM</option>
                                    <option value='20'>8 PM</option>
                                    <option value='21'>9 PM</option>
                                    <option value='22'>10 PM</option>
                                    <option value='23'>11 PM</option>
                                </select>

                                <select id='once-minutes' name='once-minutes' className='form-label form-input'
                                    value={onceMinutes} onChange={(e) => setOnceMinutes(e.target.value)} required>
                                    <option value='' disabled>Minutes</option>
                                    <option value='0'>00</option>
                                    <option value='10'>10</option>
                                    <option value='15'>15</option>
                                    <option value='20'>20</option>
                                    <option value='25'>25</option>
                                    <option value='30'>30</option>
                                    <option value='35'>35</option>
                                    <option value='40'>40</option>
                                    <option value='45'>45</option>
                                    <option value='50'>50</option>
                                </select>
                            </div>

                        </div>
                    ) : (
                        <div>
                            <div>
                                <div>
                                    {daySelectionIndexes.map((index) => (
                                        <div key={index}>
                                            <DaySelection key={index} index={index}
                                                onChangeRepeatSelection={onChangeDaySelection} />

                                            {daySelectionIndexes.length > 1
                                                && <button className='add'
                                                    onClick={(e) => handleRemoveDaySelectionComponent(e, index)}>Remove</button>}
                                        </div>
                                    ))}

                                    {repeatDays.length === daySelectionIndexes.length
                                        && (<button className='add' onClick={(e) => handleAddDaySelectionComponent(e)}>Add</button>)}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {onceRepeatSelectedOption === 'repeat' && (
                    <>
                        <div className='form-group'>
                            <label htmlFor='startDate' className='form-label'>Start Date</label>
                            <input type='date' id='startDate' name='startDate' value={startDate}
                                onChange={(e) => setStartDate(e.target.value)} className='form-input' required></input>
                            {validationMessage && !validationMessage.isValid && validationMessage.startDate !== ''
                                && <ValidationMessage message={validationMessage.startDate} />}
                        </div>

                        <div className='form-group'>
                            <label htmlFor='endDate' className='form-label'>End Date</label>
                            <input type='date' id='endDate' name='endDate' value={endDate}
                                onChange={(e) => setEndDate(e.target.value)} className='form-input' required></input>
                            {validationMessage && !validationMessage.isValid && validationMessage.endDate !== ''
                                && (<ValidationMessage message={validationMessage.endDate} />)}
                        </div>

                        {validationMessage && !validationMessage.isValid && validationMessage.repeatDays !== ''
                            && (<ValidationMessage message={validationMessage.repeatDays} />)}
                    </>
                )}

                <button type='button' className='form-btn' onClick={handleClearForm}
                    style={{ marginRight: 8 }}>Clear</button>
                <input type='submit' value='Apply' className='form-btn' />
            </form>
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.isLoggedIn,
        urlHistory: state.urlHistory
    };
};

export default connect(mapStateToProps)(CreatePlan);