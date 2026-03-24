import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux";
import { FLUSH, PAUSE, PERSIST, persistReducer, PURGE, REGISTER, REHYDRATE } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import { persistStore } from "redux-persist";
import authReducer from "../feature/authSlice";
import notiReducer from "../feature/notificationSlice";

const createNoopStorage = () => ({
    getItem(_key: string) {
        return Promise.resolve(null);
    },
    setItem(_key: string, value: string) {
        return Promise.resolve(value);
    },
    removeItem(_key: string) {
        return Promise.resolve();
    },
});

const storage =
    typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();


const rootReducer = combineReducers({ 
    auth: authReducer,
    noti: notiReducer,
});

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["auth", "noti"], // persist only auth
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefault) =>
        getDefault({
            serializableCheck: { ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();
