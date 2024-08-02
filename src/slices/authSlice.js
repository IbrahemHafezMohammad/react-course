import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
    userType: localStorage.getItem('userType') ? localStorage.getItem('userType') : null,
    emailVerified: localStorage.getItem('emailVerified') ? localStorage.getItem('emailVerified') : null,
    token: localStorage.getItem('token') ? localStorage.getItem('token') : null,
}
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.userInfo = action.payload.userInfo;
            state.userType = action.payload.userType;
            state.emailVerified = action.payload.emailVerified;
            localStorage.setItem('userInfo', JSON.stringify(action.payload.userInfo));
            localStorage.setItem('userType', action.payload.userType);
            localStorage.setItem('emailVerified', action.payload.emailVerified);
            if (action.payload.token) {
                state.token = action.payload.token
                localStorage.setItem('token', action.payload.token);
            }
        },
        removeCredentials: (state, action) => {
            state.userInfo = null;
            state.userType = null;
            state.emailVerified = null;
            state.token = null;
            localStorage.removeItem('userInfo');
            localStorage.removeItem('userType');
            localStorage.removeItem('emailVerified');
            localStorage.removeItem('token');
        },
        changeVerifyEmailStatus: (state, action) => {
            state.emailVerified = action.payload.emailVerified;
            localStorage.setItem('emailVerified', action.payload.emailVerified);
        },
    },
});

export const { setCredentials, removeCredentials, changeVerifyEmailStatus } = authSlice.actions;

export default authSlice.reducer;