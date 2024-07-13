const containsForbiddenChars = (str, forbiddenChars) => {
    for (let char of str) {
        if (forbiddenChars.includes(char)) {
            return true;
        }
    }
    return false;
};

export const validateUsername = (username) => {
    const invalidChars = [' ', ',', ';', '<', '>', '(', ')', '[', ']', '\\', '\"', '@', '$', '%', '^', '*'];
    const minLength = 5;
    const maxLength = 20;
    let message = '';

    if (username !== '' && username !== null && username !== undefined) {
        if (username.length < minLength || username.length > maxLength) {
            message += 'Length should be between ' + minLength + ' and ' + maxLength + ' characters. ';
        }

        if (containsForbiddenChars(username, invalidChars)) {
            message += `Username contains forbidden characters: (${invalidChars.join(' ')}). `;
        }
    }

    return message;
};

export const validateEmail = (email) => {
    const invalidChars = [' ', ',', ';', '<', '>', '(', ')', '[', ']', '\\', '\"', '$', '%', '^', '*'];
    const minEmailLength = 7;
    const maxEmailLength = 60;
    let message = '';

    if (email !== '' && email !== null && email !== undefined) {
        if (email.includes('@')) {
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

            if (email.length < minEmailLength || email.length > maxEmailLength) {
                message += 'Email length should be between ' + minEmailLength + ' and ' + maxEmailLength + ' characters. ';
            }

            if (containsForbiddenChars(email, invalidChars)) {
                message += `Email contains forbidden characters: (${invalidChars.join(' ')}). `;
            }
        } else {
            message += 'Email should contain an "@" symbol. ';
        }
    }

    return message;
};

export const validateUsernameOrEmail = (title) => {
    let message = '';

    if (title !== '' && title !== null && title !== undefined) {
        if (title.includes('@')) {
            message += validateEmail(title);
        } else {
            message += validateUsername(title);
        }
    }

    return message;
};

export const validatePassword = (password) => {
    const invalidChars = [' ', ',', ';', '<', '>', '(', ')', '[', ']', '\\', '\"', '$', '%', '^', '*'];
    const minLength = 10;
    const maxLength = 20;
    let message = '';

    if (password !== '' && password !== null && password !== undefined) {
        if (password.length < minLength || password.length > maxLength) {
            message += 'Length should be between ' + minLength + ' and ' + maxLength + ' characters. ';
        }

        if (containsForbiddenChars(password, invalidChars)) {
            message += `Password contains forbidden characters: (${invalidChars.join(' ')}). `;
        }
    }

    return message;
};

export const validateLoginForm = (usernameOrEmail, password) => {
    const errors = {
        usernameOrEmail: validateUsernameOrEmail(usernameOrEmail),
        password: validatePassword(password),
    };

    const isValid = Object.values(errors).every((error) => error === '');
    return {
        isValid,
        ...errors,
    };
};