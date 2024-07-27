import React from 'react';
import CardButton from '../../shared/components/CardButton.js';
import '../../shared/style/card.css';

const PlanCard = ({ id, workoutTitle, startDate, endDate, jsonDescription }) => {
  const buildDate = (date) => {
    return `${date[0]}-${date[1]}-${date[2]}`;
  };

  const buildDateTimeOnce = () => {
    const parsedJSON = JSON.parse(jsonDescription);
    const time = `${parsedJSON[0].hours}:${handleOneZero(parsedJSON[0].minutes)}`;
    const date = buildDate(startDate);
    return `${date} at ${time}`;
  };

  const buildDateTimeRepeatDays = () => {
    let text = [];
    const parsedJSON = JSON.parse(jsonDescription);
    parsedJSON.map((item) => {
      let itemText = `${handleDayOfWeek(item.dayOfWeek)} at ${item.hours}:${handleOneZero(item.minutes)}`;
      text.push(itemText);
    });
    return text;
  };

  const isOnce = () => {
    return buildDate(startDate) === buildDate(endDate);
  };

  const handleOneZero = (minutes) => {
    if (minutes === 0) {
      return '00';
    }
    return minutes;
  };

  const handleDayOfWeek = (dayOfWeek) => {
    const lowerCase = dayOfWeek.toLowerCase();
    return lowerCase.charAt(0).toUpperCase() + lowerCase.slice(1);
  };

  return (
    <div className='card-custom'>
      <div className='card-title-custom'>{workoutTitle}</div>
      <div className='card-subtitle-custom'>{isOnce() ? 'Repeat once' : 'Repeat days'}</div>

      {isOnce() && (
        <div className='card-description'>{buildDateTimeOnce()}</div>
      )}

      {!isOnce() && (
        <div>
          {buildDateTimeRepeatDays().map((item, index) => (<div key={index} className='card-description'>{item}</div>))}
          <div className='card-description'>{`${buildDate(startDate)} to ${buildDate(endDate)}`}</div>
        </div>
      )}

      <CardButton title='Manage' link={`/plans/workouts/${id}`} />
    </div>
  );
};

export default PlanCard;
