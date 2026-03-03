import { combineReducers } from 'redux';
import authReducer from './slice/auth.slice';
import chatReducer from './slice/chat.slice';
import aiReducer from './slice/ai.slice';

export const rootReducer = combineReducers({
    auth: authReducer,
    chat: chatReducer,
    ai: aiReducer
});
