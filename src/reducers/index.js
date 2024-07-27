import { combineReducers } from 'redux';
import loginReducer from './loginReducer';
import userDataReducer from './userDataReducer';
import globalMessageReducer from './globalMessageReducer';
import urlHistoryReducer from './urlHistoryReducer';

const rootReducer = combineReducers({
  isLoggedIn: loginReducer,
  userData: userDataReducer,
  globalMessage: globalMessageReducer,
  urlHistory: urlHistoryReducer
});

export default rootReducer;
