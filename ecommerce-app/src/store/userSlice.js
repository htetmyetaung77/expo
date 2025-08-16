import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    isAuthenticated: false,
    userInfo: null,
    addresses: [],
    orders: [],
  },
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.userInfo = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userInfo = null;
      state.addresses = [];
      state.orders = [];
    },
    updateProfile: (state, action) => {
      state.userInfo = { ...state.userInfo, ...action.payload };
    },
    addAddress: (state, action) => {
      state.addresses.push(action.payload);
    },
    removeAddress: (state, action) => {
      state.addresses = state.addresses.filter(addr => addr.id !== action.payload);
    },
    addOrder: (state, action) => {
      state.orders.unshift(action.payload);
    },
  },
});

export const { login, logout, updateProfile, addAddress, removeAddress, addOrder } = userSlice.actions;
export default userSlice.reducer;