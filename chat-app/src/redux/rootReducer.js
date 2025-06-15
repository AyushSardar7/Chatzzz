import appReducer from "./slices/app";
import {combineReducers} from "redux";
import storage from 'redux-persist/lib/storage';
import authReducer from "./slices/auth";
import converstionReducer from "./slices/converstion";
import audioCallReducer from './slices/audioCall';

//slices

const rootPersistConfig={
    key:'root',
    storage,
    KeyPrefix:'redux-',
    //whitelist:[],
    //blacklist:[],
}

const rootReducer=combineReducers({
    app:appReducer,
    auth:authReducer,
    conversation:converstionReducer,
    audioCall: audioCallReducer,
});

export {rootPersistConfig,rootReducer};