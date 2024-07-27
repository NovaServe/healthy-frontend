const initialState = {
  body: {}
};

const userDataReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'SET_USER_DATA':
    return {
      ...state,
      body: action.payload,
    };
  case 'CLEAR_USER_DATA':
    return {
      ...state,
      body: {},
    };
  default:
    return state;
  }
};

export default userDataReducer;
