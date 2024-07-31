import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
    userType: localStorage.getItem('userType') ? localStorage.getItem('userType') : null
}
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.userInfo = action.payload.userInfo;
            state.userType = action.payload.userType;
            localStorage.setItem('userInfo', JSON.stringify(action.payload.userInfo));
            localStorage.setItem('userType', action.payload.userType);
        },
        removeCredentials: (state, action) => {
            state.userInfo = null;
            state.userType = null;
            localStorage.removeItem('userInfo');
            localStorage.removeItem('userType');
        },
    },
});

export const { setCredentials, removeCredentials } = authSlice.actions;

export default authSlice.reducer;