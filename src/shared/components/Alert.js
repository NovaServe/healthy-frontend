import React from 'react';
import { SUCCESS } from '../services/message';
import '../style/alert.css';

const Alert = ({ message, messageType }) => {
  return (<div className={'alert-custom' + (messageType === SUCCESS ? ' alert-success' : ' alert-warning')}>{message}</div>);
};

export default Alert;