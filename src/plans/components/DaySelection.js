import React, { useState } from 'react';

const DaySelection = ({ index, onChangeRepeatSelection: onChangeDaySelection }) => {
  const [repeatData, setRepeatData] = useState({
    dayOfWeek: '',
    hours: '',
    minutes: ''
  });

  const onChangeData = (value, type) => {
    const newData = {
      ...repeatData, 
      [type]: value 
    };
    setRepeatData(newData);
    onChangeDaySelection(newData, index);
  };

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <select id='dayOfWeek' name='dayOfWeek' className='form-label form-input'
          value={repeatData.dayOfWeek} onChange={(e) => onChangeData(e.target.value, 'dayOfWeek')} required
          style={{ marginRight: 16 }}>
          <option value='' disabled>Week Day</option>
          <option value='MONDAY'>Monday</option>
          <option value='TUESDAY'>Tuesday</option>
          <option value='WEDNESDAY'>Wednesday</option>
          <option value='THURSDAY'>Thursday</option>
          <option value='FRIDAY'>Friday</option>
          <option value='SATURDAY'>Saturday</option>
          <option value='SUNDAY'>Sunday</option>
        </select>

        <select id='hours' name='hours' className='form-label form-input'
          value={repeatData.hours} onChange={(e) => onChangeData(e.target.value, 'hours')} required
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

        <select id='minutes' name='minutes' className='form-label form-input'
          value={repeatData.minutes} onChange={(e) => onChangeData(e.target.value, 'minutes')} required>
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
  );
};

export default DaySelection;