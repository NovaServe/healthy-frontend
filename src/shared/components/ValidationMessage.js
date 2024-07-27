import React from 'react';
import '../style/validation-message.css';

const ValidationMessage = ({ message }) => {
  return (<div className='validation-message'>{message}</div>);
};

export default ValidationMessage;