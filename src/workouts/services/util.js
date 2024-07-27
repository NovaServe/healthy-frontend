import { validateTitle, validateDescriptionEmptyAllowed } from '../../shared/services/validation';

export const validateCreateExercise = (title, description) => {
  const validated = {
    isValid: true,
    title: '',
    description: ''
  };

  const validatedTitle = validateTitle(title);
  if (validatedTitle !== '') {
    validated.title = validatedTitle;
    validated.isValid = false;
  }

  const validatedDescription = validateDescriptionEmptyAllowed(description);
  if (validatedDescription !== '') {
    validated.description = validatedDescription;
    validated.isValid = false;
  }

  return validated;
};

export const buildUrlFilter = (title, description, isCustom, isDefault, bodyPartsIds, sortField, sortDirection,
  pageSize, pageNumberZeroBased) => {

  if ((title === null || title === '') &&
        (description === null || description === '') &&
        ((isCustom === true && isDefault === true) || (isCustom === false && isDefault === false)) &&
        (bodyPartsIds.length === 0) &&
        (sortField === null || sortField === '') &&
        (sortDirection === null || sortDirection === '') &&
        (pageSize === null || pageSize === '') &&
        (pageNumberZeroBased === 0)
  ) return '';

  let urlPostfix = '?';
  if (title !== null && title !== '') urlPostfix += `title=${title}&`;
  if (description !== null && description !== '') urlPostfix += `description=${description}&`;
  if (isCustom === true && isDefault === false) urlPostfix += 'isCustom=true&';
  if (isCustom === false && isDefault === true) urlPostfix += 'isCustom=false&';
  if (bodyPartsIds.length > 0) {
    let ids = 'bodyPartsIds=';
    bodyPartsIds.map(item => ids += item + ',');
    ids = ids.slice(0, -1);
    urlPostfix += ids + '&';
  }
  if (sortField !== null && sortField !== '') urlPostfix += `sortField=${sortField}&`;
  if (sortDirection !== null && sortDirection !== '') urlPostfix += `sortDirection=${sortDirection}&`;
  if (pageSize !== null && pageSize !== '') urlPostfix += `pageSize=${pageSize}&`;
  if (pageNumberZeroBased > 0) urlPostfix += `pageNumber=${pageNumberZeroBased}&`;

  return urlPostfix.slice(0, -1);
};