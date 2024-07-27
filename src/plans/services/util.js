export const validateCreatePlan = (isOnce, onceDate, repeatDays, startDate, endDate) => {
  const validation = {
    isValid: true,
    onceDate: '',
    startDate: '',
    endDate: '',
    repeatDays: ''
  };

  if (isOnce) {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const inputDate = new Date(onceDate);
    inputDate.setHours(0, 0, 0, 0);
    if (inputDate < currentDate) {
      validation.isValid = false;
      validation.onceDate += 'Date should be today or later';
    }
  } else {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const inputStartDate = new Date(startDate);
    inputStartDate.setHours(0, 0, 0, 0);
    const inputEndDate = new Date(endDate);
    inputEndDate.setHours(0, 0, 0, 0);
    if (inputStartDate < currentDate) {
      validation.isValid = false;
      validation.startDate = 'Start date should be today or later';
    }

    if (inputEndDate < inputStartDate ) {
      validation.isValid = false;
      validation.endDate = 'End date should be later than start date';
    }

    if (repeatDays.length === 0) {
      validation.isValid = false;
      validation.repeatDays = 'No days specified';
    } else {
      let repeatDaysMessage = '';
      for (let i = 0; i < repeatDays.length - 1; i++) {
        for (let j = i + 1; j < repeatDays.length; j++) {
          if (repeatDays[i].dayOfWeek === repeatDays[j].dayOfWeek 
                            && repeatDays[i].hours === repeatDays[j].hours
                            && repeatDays[i].minutes === repeatDays[j].minutes) {
            repeatDaysMessage += `${repeatDays[i].dayOfWeek} ${repeatDays[i].hours}:${repeatDays[i].minutes} and 
                            ${repeatDays[j].dayOfWeek} ${repeatDays[j].hours}:${repeatDays[j].minutes} are the same. `;
          }
        }
      }
      if (repeatDaysMessage !== '') {
        validation.isValid = false;
        validation.repeatDays = repeatDaysMessage;
      }
    }
  }

  return validation;
};

export const buildCreatePlanDto = (isOnce, workoutId, onceDate, onceHours, onceMinutes, repeatDays, startDate, endDate) => {
  const requestDto = {
    workoutId: null,
    startDate: null,
    endDate: null,
    jsonDescription: null
  };

  if (isOnce) {
    requestDto.workoutId = workoutId;
    requestDto.startDate = onceDate;
    requestDto.endDate = onceDate;
    requestDto.jsonDescription = JSON.stringify([{
      dayOfWeek: null,
      hours: onceHours,
      minutes: onceMinutes
    }]);
  } else {
    requestDto.workoutId = workoutId;
    requestDto.startDate = startDate;
    requestDto.endDate = endDate;
    let jsonDescription = [];
    for (let i = 0; i < repeatDays.length; i++) {
      jsonDescription = [...jsonDescription, {
        dayOfWeek: repeatDays[i].dayOfWeek,
        hours: repeatDays[i].hours,
        minutes: repeatDays[i].minutes
      }];
    }
    requestDto.jsonDescription = JSON.stringify(jsonDescription);
  }

  return requestDto;
};