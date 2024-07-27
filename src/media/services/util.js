import { NO_UPDATES_REQUEST, SAME_VALUE } from '../../shared/services/message';
import { validateTitle, validateDescription, validateHttpLink } from '../../shared/services/validation';

export const buildUrlMediaFilter = (mediaName, description, isCustom, isDefault, sortField, sortDirection,
  pageSize, pageNumberZeroBased) => {

  if ((mediaName === null || mediaName === '') &&
        (description === null || description === '') &&
        ((isCustom === true && isDefault === true) || (isCustom === false && isDefault === false)) &&
        (sortField === null || sortField === '') &&
        (sortDirection === null || sortDirection === '') &&
        (pageSize === null || pageSize === '') &&
        (pageNumberZeroBased === 0)
  ) return '';

  let urlPostfix = '?';
  if (mediaName !== null && mediaName !== '') urlPostfix += `name=${mediaName}&`;
  if (description !== null && description !== '') urlPostfix += `description=${description}&`;
  if (isCustom === true && isDefault === false) urlPostfix += 'isCustom=true&';
  if (isCustom === false && isDefault === true) urlPostfix += 'isCustom=false&';
  if (sortField !== null && sortField !== '') urlPostfix += `sortField=${sortField}&`;
  if (sortDirection !== null && sortDirection !== '') urlPostfix += `sortDirection=${sortDirection}&`;
  if (pageSize !== null && pageSize !== '') urlPostfix += `pageSize=${pageSize}&`;
  if (pageNumberZeroBased > 0) urlPostfix += `pageNumber=${pageNumberZeroBased}&`;
  return urlPostfix.substring(0, urlPostfix.length - 1);
};

export const validateUpdateMedia = (currentHttpRef, updateTitle, updateDescription,
  updateHttpRef, updateHttpRefType) => {
  const result = {
    status: false,
    requestBody: {
      name: null,
      description: null,
      httpRefType: null,
      ref: null
    },
    validation: {
      message: '',
      name: '',
      description: '',
      ref: ''
    }
  };

  // No updates (empty form)
  if ((updateTitle === null || updateTitle === '') &&
        (updateDescription === null || updateDescription === '') &&
        (updateHttpRef === null || updateHttpRef === '') &&
        (updateHttpRefType === null || updateHttpRefType === '')
  ) {
    result.validation.message = NO_UPDATES_REQUEST;
  }

  if (result.validation.message === '') {
    // Updated value is the same
    if ((updateTitle !== null || updateTitle !== '') && updateTitle === currentHttpRef.name) {
      result.validation.name = SAME_VALUE;
    }
    if ((updateDescription !== null || updateDescription !== '') && updateDescription === currentHttpRef.description) {
      result.validation.description = SAME_VALUE;
    }
    if ((updateHttpRef !== null || updateHttpRef !== '') && updateHttpRef === currentHttpRef.ref) {
      result.validation.ref = SAME_VALUE;
    }

    // Length and forbidden chars validation
    if (updateTitle !== null && updateTitle !== '' && updateTitle !== currentHttpRef.name) {
      const validatedMessageTitle = validateTitle(updateTitle);
      if (validatedMessageTitle !== '') {
        result.validation.name += validatedMessageTitle;
      }
    }

    if (updateDescription !== null && updateDescription !== '' && updateDescription !== currentHttpRef.description) {
      const validatedMessageDescription = validateDescription(updateDescription);
      if (validatedMessageDescription !== '') {
        result.validation.description += validatedMessageDescription;
      }
    }

    if (updateHttpRef !== null && updateHttpRef !== '' && updateHttpRef !== currentHttpRef.ref) {
      const validatedMessageHttpRef = validateHttpLink(updateHttpRef);
      if (validatedMessageHttpRef !== '') {
        result.validation.ref += validatedMessageHttpRef;
      }
    }
  }

  // Valid
  if (result.validation.message === '' &&
        result.validation.name === '' &&
        result.validation.description === '' &&
        result.validation.ref === '') {

    result.status = true;
    if (updateTitle !== null && updateTitle !== '') {
      result.requestBody.name = updateTitle;
    }
    if (updateDescription !== null && updateDescription !== '') {
      result.requestBody.description = updateDescription;
    }
    if (updateHttpRef !== null && updateHttpRef !== '') {
      result.requestBody.ref = updateHttpRef;
    }
    if (updateHttpRefType !== null && updateHttpRefType !== '') {
      result.requestBody.httpRefType = updateHttpRefType;
    }
  }
  return result;
};