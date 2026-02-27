import { combineReducers } from 'redux';
import authReducer from './slice/auth.slice';

export const rootReducer = combineReducers({
    auth: authReducer,
});
