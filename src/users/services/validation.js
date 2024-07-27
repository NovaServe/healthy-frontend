const containsForbiddenChars = (str, forbiddenChars) => {
  return forbiddenChars.some(char => str.includes(char));
};

export const validateEmail = (email) => {
  const invalidChars = [' ', ',', ';', '<', '>', '(', ')', '[', ']', '\\', '"', '$', '%', '^', '*'];
  const minLength = 7;
  const maxLength = 60;
  let message = '';

  if (email) {
    const [localPart, domain] = email.split('@', 2);

    if (!localPart.length || !domain.length) {
      message += 'Email should contain an "@" symbol with text before and after it. ';
    } else {
      const domainParts = domain.split('.');
      const isDomainInvalid = domainParts.length < 2
                || domainParts.some(part => !part.length)
                || domainParts[0].length === 0
                || domainParts[domainParts.length - 1].length === 0;

      if (isDomainInvalid) {
        message += 'Email should contain a "." symbol (not the first or last character). ';
      }
    }

    if (email.length < minLength || email.length > maxLength) {
      message += 'Email length should be between ' + minLength + ' and ' + maxLength + ' characters. ';
    }

    if (containsForbiddenChars(email, invalidChars)) {
      message += `Email contains forbidden characters: (${invalidChars.join(' ')}). `;
    }
  } else {
    message += 'Email is required. ';
  }

  return message;
};

export const validateFullname = (fullname) => {
  const invalidChars = [',', ';', '<', '>', '(', ')', '[', ']', '\\', '"', '$', '%', '^', '&', '*'];
  const minLength = 2;
  const maxLength = 50;
  let message = '';

  if (fullname) {
    if (containsForbiddenChars(fullname, invalidChars)) {
      message += `Fullname contains forbidden characters: (${invalidChars.join(' ')}). `;
    }

    if (fullname.length < minLength || fullname.length > maxLength) {
      message += `Fullname length should be between ${minLength} and ${maxLength} characters. `;
    }

  } else {
    message += 'Fullname is required. ';
  }

  return message;
};

export const validateUsername = (username) => {
  const invalidChars = [' ', ',', ';', '<', '>', '(', ')', '[', ']', '\\', '"', '$', '%', '^', '&', '*'];
  const minLength = 5;
  const maxLength = 20;
  let message = '';

  if (username) {
    if (containsForbiddenChars(username, invalidChars)) {
      message += `Username contains forbidden characters: (${invalidChars.join(' ')}). `;
    }

    if (username.length < minLength || username.length > maxLength) {
      message += `Username length should be between ${minLength} and ${maxLength} characters. `;
    }

  } else {
    message += 'Username is required. ';
  }

  return message;
};

export const validatePassword = (password) => {
  const invalidChars = [' ', ',', ';', '<', '>', '(', ')', '[', ']', '\\', '"', '$', '%', '^', '*'];
  const minLength = 10;
  const maxLength = 20;
  let message = '';

  if (password) {
    if (password !== '' && password !== null && password !== undefined) {
      if (password.length < minLength || password.length > maxLength) {
        message += 'Length should be between ' + minLength + ' and ' + maxLength + ' characters. ';
      }

      if (containsForbiddenChars(password, invalidChars)) {
        message += `Password contains forbidden characters: (${invalidChars.join(' ')}). `;
      }
    }
  }

  return message;
};

export const validateConfirmPassword = (password, confirmPassword) => {
  let message = '';

  if (confirmPassword) {
    message += validatePassword(confirmPassword);
    if (confirmPassword !== password) {
      message += 'Passwords do not match. ';
    }
  }

  return message;
};

export const validateCountry = (country) => {
  let message = '';

  if (!country) {
    message += 'Country is required. ';
  }

  return message;
};

export const validateTimezone = (timezone) => {
  let message = '';

  if (!timezone) {
    message += 'Timezone is required. ';
  }

  return message;
};

export const validateAge = (age) => {
  let message = '';

  if (age) {
    const ageNumber = Number(age);
    if (isNaN(ageNumber)) {
      message += 'Age should be a number';
    } else {
      if (ageNumber <= 0) {
        message += 'Age should be a positive number. ';
      }
    }
  }

  return message;
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

export const validateForm = (formData) => {
  const errors = {
    fullName: validateFullname(formData.fullName),
    username: validateUsername(formData.username),
    email: validateEmail(formData.email),
    password: validatePassword(formData.password),
    confirmPassword: validateConfirmPassword(formData.password, formData.confirmPassword),
    countryId: validateCountry(formData.countryId),
    timezoneId: validateTimezone(formData.timezoneId),
    age: validateAge(formData.age),
  };

  const isValid = Object.values(errors).every((error) => error === '');

  return {
    isValid,
    ...errors
  };
};