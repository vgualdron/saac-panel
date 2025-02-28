import types from './types';
import pointApi from '../../../api/point/pointApi';

export default {
  async [types.actions.FETCH_POINTS]({ commit }, payload) {
    console.log(payload);
    try {
      const response = await pointApi.fetchPoints(payload);
      commit(types.mutations.SET_POINTS, response.data.data);
    } catch (error) {
      console.error(error);
      commit(types.mutations.SET_POINTS, error.response.data);
    }
  },
  async [types.actions.UPDATE_POINT]({ commit }, payload) {
    try {
      const response = await pointApi.updatePoint(payload);
      commit(types.mutations.SET_STATUS, true);
      commit(types.mutations.SET_RESPONSE_MESSAGES, response.data.message);
    } catch (error) {
      commit(types.mutations.SET_STATUS, false);
      if (error.message !== 'Network Error') {
        commit(types.mutations.SET_RESPONSE_MESSAGES, error.response.data.message);
      } else {
        commit(types.mutations.SET_RESPONSE_MESSAGES, [
          {
            text: 'Error de red',
            detail: 'Intente conectarse a otra red de internet',
          },
        ]);
      }
    }
  },
};
