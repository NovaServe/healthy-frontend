export const buildMessage = (obj) => {
  let messageBuilder = '';
  if (obj === null) {
    messageBuilder = 'Unknown error occured';
  } else {
    for (const key in obj) {
      messageBuilder += `${key}: ${obj[key]}. `;
    }
  }
  return messageBuilder;
};

export const buildAlertsList = (obj) => {
  let alertsList = [];
  if (obj === null) {
    let emptyAlert = {};
    emptyAlert['Unknown'] = 'Exception occured';
    emptyAlert['keyName'] = 'Unknown';
    alertsList.push(emptyAlert);
  } else {
    for (const key in obj) {
      let alert = {};
      alert[key] = obj[key];
      alert['keyName'] = key;
      alertsList.push(alert);
    }
  }
  return alertsList;
};

export const truncateStringWithWordBoundary = (inputString, maxLength) => {
  if (inputString && inputString.length > maxLength) {
    const truncatedText = inputString.substring(0, maxLength);
    const lastSpaceIndex = truncatedText.lastIndexOf(' ');
    return lastSpaceIndex !== -1 ? truncatedText.substring(0, lastSpaceIndex) + '...' : truncatedText + '...';
  }
  return inputString;
};

export const getStringOrNull = (value) => {
  if (value === null || value.trim() === '') {
    return null;
  }
  return value.trim();
};

export const upperCaseStringToRegular = (string = 'ABC') => {
  let formatted = string[0];
  formatted += (string.substring(1, string.length)).toLowerCase();
  return formatted;
};