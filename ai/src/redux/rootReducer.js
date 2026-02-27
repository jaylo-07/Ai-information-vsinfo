import { combineReducers } from 'redux';
import authReducer from './slice/auth.slice';
import chatReducer from './slice/chat.slice';

export const rootReducer = combineReducers({
    auth: authReducer,
    chat: chatReducer
});
