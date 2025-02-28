export default {
  PATH: '@module/file',
  actions: {
    GET_FILE: '@actions/getFile',
    LIST_STATUSES_TODAY: '@actions/listStatusesToday',
    SAVE_FILE: '@actions/saveFile',
    UPDATE_FILE: '@actions/updateFile',
    DELETE_FILE: '@actions/deleteFile',
  },
  getters: {
  },
  mutations: {
    SET_FILE: '@mutations/setFile',
    SET_STATUS: '@mutations/setStatus',
    SET_STATUSES_TODAY: '@mutations/setStatusesToday',
    SET_RESPONSE_MESSAGES: '@mutations/setResponseMessages',
  },
};
