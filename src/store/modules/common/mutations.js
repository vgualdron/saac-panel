import types from './types';

export default {
  [types.mutations.SET_STATUS_SIGN](state, payload) {
    state.statusSign = payload;
  },
  [types.mutations.SET_RESPONSE_MESSAGES](state, payload) {
    state.responseMessages = payload;
  },
  [types.mutations.SET_PERMISSIONS](state, payload) {
    localStorage.setItem('permissionsMC', JSON.stringify(payload));
    state.permissions = payload;
  },
  [types.mutations.SET_MENU](state, payload) {
    localStorage.setItem('menuMC', JSON.stringify(payload));
    state.menu = payload;
  },
  [types.mutations.SET_YARD](state, payload) {
    localStorage.setItem('yardMC', payload === null ? 0 : payload);
    state.yard = payload;
  },
  [types.mutations.SET_CITY](state, payload) {
    localStorage.setItem('cityMC', payload === null ? 0 : payload);
    state.city = payload;
  },
  [types.mutations.SET_CURRENT_YARD](state, payload) {
    localStorage.setItem('currentYardMC', payload === null ? 0 : payload);
    state.currentYard = payload;
  },
  [types.mutations.SET_NAME](state, payload) {
    localStorage.setItem('nameMC', payload);
    state.name = payload;
  },
  [types.mutations.SET_DOCUMENT](state, payload) {
    state.document = payload;
  },
  [types.mutations.SET_TOKEN](state, payload) {
    localStorage.setItem('tokenMC', payload);
    state.token = payload;
  },
  [types.mutations.SET_ROLES](state, payload) {
    localStorage.setItem('rolesMC', JSON.stringify(payload));
    state.roles = payload;
  },
  [types.mutations.SET_ROLES_ARRAY](state, payload) {
    localStorage.setItem('rolesArrayMC', JSON.stringify(payload));
    state.rolesArray = payload;
  },
  [types.mutations.SET_USER](state, payload) {
    localStorage.setItem('userMC', payload);
    state.user = payload;
  },
};
