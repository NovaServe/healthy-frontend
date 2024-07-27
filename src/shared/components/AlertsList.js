import React from 'react';
import Alert from './Alert';

const AlertsList = ({ messages, messageType }) => {
  return (messages.map(item => (
    <Alert key={item['keyName']} message={`${item['keyName']}: ${item[item['keyName']]}`} messageType={messageType} />
  )));
};

export default AlertsList;