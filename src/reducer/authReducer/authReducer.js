import decodeJwt from 'jwt-decode';

import {
  SOCIAL_LOGIN_SUCCESS,
  USER_LOGIN_FAILURE,
  LOGIN_USER_SUCCESS,
  CLEAR_LOGIN_ERRORS,
  LOGIN_LOADING,
  USER_LOGOUT
} from '../../action/authActions/authActions';

const token = localStorage.getItem('userToken');

const initialAuthState = {
  isAuthenticated: Boolean(token),
  roleId: token ? decodeJwt(token).roleId : '',
  loginErrors: [],
  isLoading: false
};

const authReducer = (state = initialAuthState, { type, payload }) => {
  switch (type) {
    case SOCIAL_LOGIN_SUCCESS:
      return { ...state, ...payload, loginErrors: [] };
    case LOGIN_LOADING:
      return { ...state, isLoading: payload };
    case LOGIN_USER_SUCCESS:
      return { ...state, ...payload };
    case CLEAR_LOGIN_ERRORS:
      return { ...state, loginErrors: [] };
    case USER_LOGIN_FAILURE:
      return { ...state, ...{ isAuthenticated: false, roleId: '', loginErrors: [...payload], isLoading: false } };
    case USER_LOGOUT:
      return { ...initialAuthState, isAuthenticated: false };
    default:
      return state;
  }
};

export default authReducer;
