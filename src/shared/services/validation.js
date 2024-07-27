const containsForbiddenChars = (str, forbiddenChars) => {
  for (let char of str) {
    if (forbiddenChars.includes(char)) {
      return true;
    }
  }
  return false;
};

export const validateTitle = (title) => {
  const invalidChars = ['@', '$', '%', '^', '*'];
  const minLength = 3;
  const maxLength = 20;
  let message = '';

  if (title !== '' && title !== null && title !== undefined) {
    if (title.length < minLength || title.length > maxLength) {
      message += 'Length should be between ' + minLength + ' and ' + maxLength + ' characters. ';
    }

    if (containsForbiddenChars(title, invalidChars)) {
      message += 'Contains forbidden characters (\'@\', \'$\', \' % \', \' ^ \', \' * \'). ';
    }
  }

  return message;
};

export const validateDescription = (description) => {
  const minLength = 3;
  const maxLength = 20;
  let message = '';

  if (description !== null && description !== '') {
    if (description.length < minLength || description.length > maxLength) {
      message += 'Length should be between ' + minLength + ' and ' + maxLength + ' characters. ';
    }
  }

  return message;
};

export const validateDescriptionEmptyAllowed = (description) => {
  const maxLength = 255;
  let message = '';

  if (description === '' || description === null) {
    return message;
  } else {
    if (description.length > maxLength) {
      message += 'Length should be 255 characters or less';
    }
    return message;
  }
};

export const validateHttpLink = (link) => {
  let message = '';

  if (!(link.startsWith('http://') || link.startsWith('https://'))) {
    message += 'HTTP link should start with http:// or https://';
  }

  return message;
};

export const validateInput = (title, description) => {
  const invalidChars = ['!', ',', '.', '@', '#', '$', '%', '^', '&', '*', '&'];
  const minLength = 3;
  const maxLength = 20;
  let message = '';

  const containsForbiddenChars = (str, forbiddenChars) => {
    for (let char of str) {
      if (forbiddenChars.includes(char)) {
        return true;
      }
    }
    return false;
  };

  if (title !== '' && title !== null && title !== undefined) {
    if (title.length < minLength || title.length > maxLength) {
      message += 'Title length should be between ' + minLength + ' and ' + maxLength + ' characters. ';
    }

    if (containsForbiddenChars(title, invalidChars)) {
      message += 'Title contains forbidden characters. ';
    }
  }

  if (description !== '' && description !== null && description !== undefined) {
    if (description.length < minLength || description.length > maxLength) {
      message += 'Description length should be between ' + minLength + ' and ' + maxLength + ' characters. ';
    }

    if (containsForbiddenChars(description, invalidChars)) {
      message += 'Description contains forbidden characters. ';
    }
  }

  if (message !== '') return message;
  return null;
};